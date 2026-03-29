# 📖 Ejemplos de Uso - Sistema Ópticas

## 1. Autenticación

### Login

```tsx
// src/app/page.tsx
import { LoginForm } from "@/modules/auth";

export default function LoginPage() {
  return <LoginForm />;
}
```

**Resultado:** Página de login que redirige a `/dashboard` después de autenticarse.

---

## 2. Gestión de Pacientes

### Crear un Paciente Adulto

```tsx
// Usar el componente
<CreatePatientForm 
  tenantId="tenant-id-123"
  onSuccess={() => console.log("Paciente creado")}
/>
```

**Validaciones automáticas:**
- Nombres requeridos (2-100 caracteres)
- Email válido (si se proporciona)
- Teléfono válido (si se proporciona)
- Fecha de nacimiento requerida
- Detección automática: si es menor de 18 años, se marca `is_minor = true`

**Respuesta:**
```json
{
  "id": "uuid",
  "tenant_id": "tenant-id",
  "first_name": "Juan",
  "last_name": "García",
  "email": "juan@example.com",
  "phone": "+57 310 123 4567",
  "date_of_birth": "1990-05-15",
  "is_minor": false,
  "identification_number": "1234567890",
  "created_at": "2026-03-29T10:30:00Z",
  "updated_at": "2026-03-29T10:30:00Z"
}
```

### Crear un Paciente Menor

```tsx
<CreatePatientForm 
  tenantId="tenant-id-123"
  onSuccess={handleRefresh}
/>
```

**Diferencia:** Si `date_of_birth` indica < 18 años:
1. Se muestra notificación: "Se ha detectado que este paciente es menor de edad"
2. Después de crear, automáticamente se activa `GuardianManager`
3. Debe registrarse al menos un tutor

### Registrar Tutor para Menor

```tsx
<GuardianManager
  tenantId="tenant-id-123"
  patientId="patient-uuid"
  patientIsMinor={true}
/>
```

**Formulario de tutor:**
- Nombre completo
- Teléfono (requerido)
- Email (opcional)
- Parentesco: "padre", "madre", "abuelo", "tutor legal", etc.

**Resultado:**
```json
{
  "id": "uuid",
  "tenant_id": "tenant-id",
  "patient_id": "patient-uuid",
  "first_name": "María",
  "last_name": "García",
  "phone": "+57 300 987 6543",
  "relationship": "madre",
  "created_at": "2026-03-29T10:35:00Z"
}
```

### Listar Pacientes

```tsx
<PatientList 
  tenantId="tenant-id-123"
  onSelectPatient={(patient) => navigate(`/patient/${patient.id}`)}
/>
```

**Características:**
- Búsqueda en tiempo real por nombre o email
- Muestra badge "Menor" o "Adulto"
- Tabla responsive
- Botón "Ver detalles" para cada paciente

**Busca "juan"** → Filtra automáticamente

### Usar Hook de Pacientes Directamente

```tsx
"use client";

import { usePatients, useCreatePatient } from "@/hooks/usePatients";

export function MyPatientComponent() {
  const { data: patients, isLoading, error } = usePatients("tenant-id");
  const { mutate: createPatient, isPending } = useCreatePatient();

  const handleCreate = () => {
    createPatient({
      tenant_id: "tenant-id",
      first_name: "Carlos",
      last_name: "López",
      email: "carlos@example.com",
      phone: "+57 310 111 2222",
      date_of_birth: "1985-03-20",
      is_minor: false,
    }, {
      onSuccess: () => alert("Éxito"),
      onError: (err) => alert(`Error: ${err.message}`)
    });
  };

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <button onClick={handleCreate} disabled={isPending}>
        {isPending ? "Creando..." : "Crear Paciente"}
      </button>
      <ul>
        {patients?.map(p => (
          <li key={p.id}>{p.first_name} {p.last_name}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 3. Sistema de Citas

### Agendar una Cita

```tsx
<CreateAppointmentForm
  tenantId="tenant-id-123"
  branchId="branch-uuid"
  onSuccess={() => console.log("Cita creada")}
/>
```

**Proceso:**
1. Seleccionar paciente del dropdown
2. Ingresar ID del doctor
3. Seleccionar fecha (debe ser futura)
4. Seleccionar hora (formato 24h)
5. Agregar notas (opcional)
6. Crear

**Validaciones:**
- Fecha debe ser en el futuro
- Hora válida (HH:MM)
- Paciente requerido
- Doctor requerido

**Resultado:**
```json
{
  "id": "uuid",
  "tenant_id": "tenant-id",
  "branch_id": "branch-uuid",
  "patient_id": "patient-uuid",
  "doctor_id": "doctor-uuid",
  "scheduled_date": "2026-04-15",
  "scheduled_time": "14:30",
  "status": "pending",
  "notes": "Revisión de lentes",
  "created_at": "2026-03-29T10:40:00Z"
}
```

### Listar Citas en Rango de Fechas

```tsx
<AppointmentList tenantId="tenant-id-123" />
```

**Características:**
- Filtro por rango de fechas (default: hoy a +7 días)
- Tabla con paciente, doctor, fecha, hora, estado
- Badges de estado con colores
- Búsqueda de detalles

**Estados:**
- 🟡 Pendiente (pending)
- 🟢 Confirmada (confirmed)
- 🔵 Completada (completed)
- 🔴 Cancelada (cancelled)

### Usar Hook de Citas Directamente

```tsx
"use client";

import { 
  useAppointmentsByDateRange, 
  useCreateAppointment,
  useCancelAppointment 
} from "@/hooks/useAppointments";

export function MyAppointmentComponent() {
  const today = new Date().toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 7*24*60*60*1000)
    .toISOString()
    .split('T')[0];

  const { data: appointments } = useAppointmentsByDateRange(
    "tenant-id",
    today,
    nextWeek
  );

  const { mutate: cancelAppt } = useCancelAppointment();

  return (
    <div>
      {appointments?.map(appt => (
        <div key={appt.id}>
          <p>{appt.patient_id} - {appt.scheduled_date} {appt.scheduled_time}</p>
          <button 
            onClick={() => cancelAppt(appt.id)}
          >
            Cancelar
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

## 4. Servicios Directamente

### Usar PatientService

```typescript
import { PatientService } from "@/services/patient.service";

// Obtener todos los pacientes
const patients = await PatientService.getAllPatients("tenant-id");

// Buscar pacientes
const results = await PatientService.searchPatients("tenant-id", "juan");

// Crear paciente
const newPatient = await PatientService.createPatient({
  tenant_id: "tenant-id",
  first_name: "Ana",
  last_name: "Martínez",
  date_of_birth: "2010-06-15",
  is_minor: true,
});

// Obtener tutores
const guardians = await PatientService.getGuardians(newPatient.id);

// Agregar tutor
const guardian = await PatientService.createGuardian({
  tenant_id: "tenant-id",
  patient_id: newPatient.id,
  first_name: "Roberto",
  last_name: "Martínez",
  phone: "+57 300 123 4567",
  relationship: "padre",
});
```

### Usar AppointmentService

```typescript
import { AppointmentService } from "@/services/appointment.service";

// Obtener citas de un doctor en una fecha
const appointments = await AppointmentService.getDoctorAppointmentsByDate(
  "doctor-id",
  "2026-04-15"
);

// Crear cita
const appointment = await AppointmentService.createAppointment({
  tenant_id: "tenant-id",
  branch_id: "branch-id",
  patient_id: "patient-id",
  doctor_id: "doctor-id",
  scheduled_date: "2026-04-20",
  scheduled_time: "15:00",
  status: "pending",
  notes: "Primera consulta",
});

// Actualizar estado
await AppointmentService.updateAppointment(appointment.id, {
  status: "confirmed"
});

// Cancelar
await AppointmentService.cancelAppointment(appointment.id);

// Citas en rango
const range = await AppointmentService.getAppointmentsByDateRange(
  "tenant-id",
  "2026-04-01",
  "2026-04-30"
);
```

---

## 5. Validación

### Validar Paciente

```typescript
import { createPatientSchema } from "@/modules/patients/validators";

const data = {
  first_name: "Juan",
  last_name: "García",
  email: "juan@example.com",
  date_of_birth: "1990-05-15",
};

try {
  const validated = createPatientSchema.parse(data);
  console.log("Válido:", validated);
} catch (error) {
  console.error("Errores:", error.errors);
}
```

### Funciones de Utilidad

```typescript
import { isMinor, formatDate, formatTime } from "@/lib/validators";

// Detectar menor
const minor = isMinor("2015-06-20"); // true

// Formatear fecha
const formatted = formatDate("2026-04-15"); // "15/04/2026"

// Formatear hora
const time = formatTime("14:30"); // "14:30"

// Validar conflicto de citas (opcional para fase 2)
const hasConflict = hasTimeConflict(
  "14:00", "15:00",  // Nueva cita
  "14:30", "15:30"   // Existente
); // true
```

---

## 6. Manejo de Errores

### En Componentes

```tsx
const { mutate, isPending, error } = useCreatePatient();

const handleSubmit = () => {
  mutate(data, {
    onSuccess: () => {
      // Éxito
      showNotification("Paciente creado exitosamente");
    },
    onError: (error) => {
      // Error
      console.error("Falló:", error.message);
      // Error puede ser de:
      // - Validación: "El nombre debe tener al menos 2 caracteres"
      // - BD: "RLS policy violation"
      // - Red: "Failed to fetch"
    }
  });
};
```

### En Servicios

```typescript
try {
  const patient = await PatientService.createPatient(data);
} catch (error) {
  if (error instanceof Error) {
    console.error("Error:", error.message);
    // "Error al crear paciente: duplicate key value violates unique constraint"
  }
}
```

---

## 7. Patrones Comunes

### Componente con Datos y Formulario

```tsx
"use client";

import { useState } from "react";
import { usePatients, useCreatePatient } from "@/hooks/usePatients";
import { PatientList } from "@/modules/patients";
import { CreatePatientForm } from "@/modules/patients";

export default function PatientsPage() {
  const [tab, setTab] = useState<"list" | "create">("list");
  const { data: patients } = usePatients("tenant-id");

  return (
    <div>
      {/* Tabs */}
      <div className="tabs">
        <button 
          onClick={() => setTab("list")}
          className={tab === "list" ? "active" : ""}
        >
          Listado ({patients?.length})
        </button>
        <button 
          onClick={() => setTab("create")}
          className={tab === "create" ? "active" : ""}
        >
          Crear
        </button>
      </div>

      {/* Contenido */}
      {tab === "list" && <PatientList tenantId="tenant-id" />}
      {tab === "create" && (
        <CreatePatientForm 
          tenantId="tenant-id"
          onSuccess={() => setTab("list")}
        />
      )}
    </div>
  );
}
```

### Componente con Búsqueda en Tiempo Real

```tsx
"use client";

import { useState } from "react";
import { useSearchPatients } from "@/hooks/usePatients";
import { Input } from "@/components/Input";

export function PatientSearch() {
  const [search, setSearch] = useState("");
  const { data: results, isLoading } = useSearchPatients("tenant-id", search);

  return (
    <div>
      <Input
        placeholder="Buscar..."
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
      />
      
      {isLoading && <p>Buscando...</p>}
      
      <ul>
        {results?.map(patient => (
          <li key={patient.id}>
            {patient.first_name} {patient.last_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 8. Pruebas Manuales

### Flujo Completo: Crear Paciente Menor y Cita

```
1. Ir a /dashboard/patients
2. Click en tab "Crear Paciente"
3. Llenar formulario:
   - Nombre: "Pedro"
   - Apellido: "Rodríguez"
   - Fecha: 2015-06-20 (será detectado como menor)
   - Email: "familia@example.com"
   - Teléfono: "+57 310 555 6666"
4. Click "Crear Paciente"
5. Notificación: "Paciente creado exitosamente"
6. Mostrar GuardianManager: "Se debe registrar al menos un tutor"
7. Click "+ Agregar Tutor"
8. Llenar:
   - Nombre: "Sandra"
   - Apellido: "Rodríguez"
   - Teléfono: "+57 300 777 8888"
   - Parentesco: "madre"
9. Click "Guardar Tutor"
10. Tutor aparece en lista

11. Ir a /dashboard/appointments
12. Click "Agendar Cita"
13. Seleccionar paciente: "Pedro Rodríguez"
14. Doctor ID: "doctor-123"
15. Fecha: 2026-04-20
16. Hora: 14:30
17. Notas: "Control"
18. Click "Agendar Cita"
19. Éxito → Aparece en listado
```

---

## 🎯 Resumen de Patrones

| Patrón | Uso | Ubicación |
|--------|-----|-----------|
| **Custom Hook** | Lógica de datos | `src/hooks/*` |
| **Service** | Acceso BD | `src/services/*` |
| **Component** | UI | `src/components/*` |
| **Module** | Dominio completo | `src/modules/*` |
| **Validator** | Zod schemas | `**/validators.ts` |
| **Type** | Interfaces TS | `src/types/` |

---

**¡Listo para empezar a usar! 🚀**
