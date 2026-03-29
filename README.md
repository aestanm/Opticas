# 🏥 Ópticas - Sistema de Gestión Integral para Clínicas Oftalmológicas

Sistema web moderno y escalable para la gestión completa de clínicas oftalmológicas, construido con Next.js, TypeScript, Tailwind CSS y Supabase.

## 🎯 Características Principales

### ✅ Fase 1 Implementada

- **Autenticación**: Login seguro con Supabase
- **Gestión de Pacientes**: 
  - Crear pacientes adultos y menores
  - Listado con búsqueda
  - Gestión de tutores para menores
- **Sistema de Citas**:
  - Agendar citas
  - Listado por rango de fechas
  - Seguimiento de estado (pending, confirmed, completed, cancelled)

### 🔄 Estructura Modular

```
src/
├── app/              # Páginas de Next.js (App Router)
├── modules/          # Módulos de negocio por dominio
│   ├── auth/         # Autenticación
│   ├── patients/     # Gestión de pacientes
│   └── appointments/ # Gestión de citas
├── services/         # Servicios de acceso a datos (Supabase)
├── hooks/            # Hooks personalizados (React Query)
├── components/       # Componentes UI reutilizables
├── lib/              # Utilidades y validadores
└── types/            # Tipos de TypeScript
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14+ (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **UI Components**: Componentes custom (Shadcn-compatible)
- **Backend**: Supabase (PostgreSQL + RLS)
- **Gestión de estado**: TanStack Query (React Query)
- **Validación**: Zod
- **Formas**: React Hook Form

## 📋 Requisitos

- Node.js 18+
- npm o yarn
- Cuenta en Supabase

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/opticas.git
cd opticas
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de ambiente

Copia `.env.example` a `.env.local` y configura tus credenciales de Supabase:

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📚 Estructura de Base de Datos

### Tablas Principales

#### `patients`
- `id` (uuid, primary key)
- `tenant_id` (uuid, foreign key)
- `first_name` (text)
- `last_name` (text)
- `email` (text, nullable)
- `phone` (text, nullable)
- `date_of_birth` (date)
- `is_minor` (boolean)
- `identification_number` (text, nullable)

#### `guardians`
- `id` (uuid, primary key)
- `tenant_id` (uuid, foreign key)
- `patient_id` (uuid, foreign key)
- `first_name` (text)
- `last_name` (text)
- `phone` (text)
- `relationship` (text)

#### `appointments`
- `id` (uuid, primary key)
- `tenant_id` (uuid, foreign key)
- `branch_id` (uuid, foreign key)
- `patient_id` (uuid, foreign key)
- `doctor_id` (uuid, foreign key)
- `scheduled_date` (date)
- `scheduled_time` (time)
- `status` (enum: pending, confirmed, completed, cancelled)
- `notes` (text, nullable)

## 🏗️ Arquitectura de Carpetas Explicada

### `/src/app`
Rutas y layouts de Next.js (App Router). Cada archivo `page.tsx` es una ruta.

### `/src/modules`
Módulos de negocio organizados por dominio (patients, appointments, auth). Cada módulo contiene:
- `components/` - Componentes específicos del módulo
- `types.ts` - Tipos TypeScript del módulo
- `validators.ts` - Esquemas de validación (Zod)
- `index.ts` - Exporta públicamente los componentes

### `/src/services`
Servicios que encapsulan la lógica de acceso a datos:
- `auth.service.ts` - Operaciones de autenticación
- `patient.service.ts` - CRUD de pacientes
- `appointment.service.ts` - CRUD de citas

### `/src/hooks`
Hooks personalizados que usan React Query:
- `usePatients.ts` - Queries y mutations para pacientes
- `useAppointments.ts` - Queries y mutations para citas

### `/src/components`
Componentes UI reutilizables:
- `Button.tsx` - Botón con variantes
- `Input.tsx` - Campo de entrada con label y validación
- `Card.tsx` - Contenedor de contenido
- `LoadingAndStates.tsx` - Estados de carga, error y vacío

### `/src/lib`
Utilidades y funciones auxiliares:
- `supabase.ts` - Cliente de Supabase
- `validators.ts` - Funciones de validación compartidas

### `/src/types`
Tipos TypeScript centralizados para toda la aplicación.

## 🔐 Seguridad

### Row Level Security (RLS)

Todas las tablas tienen RLS habilitado. Los usuarios solo pueden ver datos de su tenant.

Ejemplo de política RLS:

```sql
CREATE POLICY "Usuarios ven solo datos de su tenant" ON patients
  FOR SELECT USING (tenant_id = auth.uid()::uuid);
```

### Validación

- **Frontend**: Validación con Zod en formularios
- **Backend**: RLS + Constraints de base de datos

## 📖 Guía de Uso

### 1. Crear un Paciente

```tsx
import { CreatePatientForm } from "@/modules/patients";

export default function Page() {
  return (
    <CreatePatientForm 
      tenantId="test-tenant"
      onSuccess={() => console.log("Paciente creado")}
    />
  );
}
```

### 2. Listar Pacientes

```tsx
import { PatientList } from "@/modules/patients";

export default function Page() {
  return <PatientList tenantId="test-tenant" />;
}
```

### 3. Gestionar Tutores

```tsx
import { GuardianManager } from "@/modules/patients";

export default function Page() {
  return (
    <GuardianManager
      tenantId="test-tenant"
      patientId="patient-id"
      patientIsMinor={true}
    />
  );
}
```

### 4. Agendar Cita

```tsx
import { CreateAppointmentForm } from "@/modules/appointments";

export default function Page() {
  return (
    <CreateAppointmentForm
      tenantId="test-tenant"
      branchId="branch-id"
      onSuccess={() => console.log("Cita agendada")}
    />
  );
}
```

## 🎨 Temas y Estilos

La aplicación usa variables CSS para temas. Personaliza los colores en:

- `src/app/globals.css` - Variables CSS
- `tailwind.config.js` - Configuración de Tailwind

## 📦 Compilación para Producción

```bash
npm run build
npm start
```

## 🧪 Testing

```bash
npm run type-check
```

## 📝 Próximos Pasos (Fase 2)

- [ ] Récords médicos con prescripciones
- [ ] Órdenes de lentes
- [ ] Dashboard de estadísticas
- [ ] Sistema de notificaciones
- [ ] Reportes por rama
- [ ] Rol-based access control (RBAC)
- [ ] Integración con calendario visual

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🆘 Soporte

Para problemas y preguntas:

1. Abre un issue en GitHub
2. Proporciona detalles del problema
3. Incluye logs y screenshots si es relevante

## 📱 Responsive Design

La aplicación es totalmente responsive y funciona en:

- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (320px - 767px)

## 🔄 Actualización de Dependencias

```bash
npm update
```

Para actualizar a nuevas versiones mayores:

```bash
npm install package-name@latest
```

---

**Hecho con ❤️ para optimizar la gestión de clínicas oftalmológicas**
