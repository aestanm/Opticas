# 🚀 Guía de Inicio - Sistema Ópticas

## Pasos de Configuración Inicial

### 1. Instalar Dependencias

```bash
npm install
```

Esto instalará:
- Next.js 14
- TypeScript
- Tailwind CSS
- Supabase Client
- React Query (TanStack Query)
- Zod para validaciones
- React Hook Form

### 2. Configurar Variables de Ambiente

Copia el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Luego edita `.env.local` con tus credenciales de Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

Para obtener estas credenciales:
1. Ve a https://app.supabase.com
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia la URL y la clave anón

### 3. Crear la Base de Datos en Supabase

Ejecuta los siguientes scripts SQL en la consola de Supabase (SQL Editor):

```sql
-- 1. Crear tabla de tenants (multi-tenant)
CREATE TABLE tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 2. Crear tabla de ramas
CREATE TABLE branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name text NOT NULL,
  city text NOT NULL,
  address text NOT NULL,
  phone text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 3. Crear tabla de pacientes
CREATE TABLE patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text,
  date_of_birth date NOT NULL,
  is_minor boolean DEFAULT false,
  identification_number text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 4. Crear tabla de tutores
CREATE TABLE guardians (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text,
  phone text NOT NULL,
  relationship text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 5. Crear tabla de citas
CREATE TABLE appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL,
  scheduled_date date NOT NULL,
  scheduled_time time NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 6. Crear tabla de récords médicos
CREATE TABLE medical_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id uuid NOT NULL,
  visit_date date NOT NULL,
  diagnosis text,
  treatment text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 7. Crear tabla de prescripciones
CREATE TABLE prescriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  medical_record_id uuid NOT NULL REFERENCES medical_records(id) ON DELETE CASCADE,
  left_eye_sphere numeric,
  left_eye_cylinder numeric,
  left_eye_axis numeric,
  right_eye_sphere numeric,
  right_eye_cylinder numeric,
  right_eye_axis numeric,
  additional_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 8. Crear tabla de órdenes
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  description text NOT NULL,
  total_amount numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- 9. Crear tabla de roles
CREATE TABLE roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES ('admin'), ('secretary'), ('doctor'), ('patient');

-- 10. Crear tabla de roles de usuario
CREATE TABLE user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role_id uuid NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  branch_id uuid NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- 11. Habilitar RLS en todas las tablas
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE guardians ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- 12. Crear políticas RLS para pacientes
CREATE POLICY "Usuarios ven pacientes de su tenant"
  ON patients FOR SELECT
  USING (tenant_id::text = current_user_id()::text);

CREATE POLICY "Usuarios crean pacientes en su tenant"
  ON patients FOR INSERT
  WITH CHECK (tenant_id::text = current_user_id()::text);

-- 13. Crear políticas RLS para tutores
CREATE POLICY "Usuarios ven tutores de pacientes de su tenant"
  ON guardians FOR SELECT
  USING (tenant_id::text = current_user_id()::text);

CREATE POLICY "Usuarios crean tutores en su tenant"
  ON guardians FOR INSERT
  WITH CHECK (tenant_id::text = current_user_id()::text);

-- 14. Crear políticas RLS para citas
CREATE POLICY "Usuarios ven citas de su tenant"
  ON appointments FOR SELECT
  USING (tenant_id::text = current_user_id()::text);

CREATE POLICY "Usuarios crean citas en su tenant"
  ON appointments FOR INSERT
  WITH CHECK (tenant_id::text = current_user_id()::text);
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### 5. Crear un Tenant de Prueba

En la consola de Supabase (SQL Editor), ejecuta:

```sql
INSERT INTO tenants (name, slug) VALUES 
  ('Mi Clínica Óptica', 'mi-clinica');

INSERT INTO branches (tenant_id, name, city, address, phone) VALUES
  ((SELECT id FROM tenants WHERE slug = 'mi-clinica'), 
   'Sucursal Centro', 'Bogotá', 'Calle 10 #5-50', '+57 1 234 5678');
```

Guarda el ID del tenant devuelto y actualiza `TENANT_ID` en las páginas.

## 📁 Estructura del Proyecto

```
opticas/
├── src/
│   ├── app/                          # Rutas de Next.js
│   │   ├── layout.tsx               # Layout raíz
│   │   ├── page.tsx                 # Página de login
│   │   ├── dashboard/
│   │   │   ├── layout.tsx          # Layout del dashboard
│   │   │   ├── page.tsx            # Dashboard principal
│   │   │   ├── patients/
│   │   │   │   └── page.tsx        # Gestión de pacientes
│   │   │   └── appointments/
│   │   │       └── page.tsx        # Gestión de citas
│   │   └── globals.css             # Estilos globales
│   │
│   ├── modules/                     # Módulos por dominio
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   └── LoginForm.tsx
│   │   │   └── index.ts
│   │   ├── patients/
│   │   │   ├── components/
│   │   │   │   ├── CreatePatientForm.tsx
│   │   │   │   ├── PatientList.tsx
│   │   │   │   └── GuardianManager.tsx
│   │   │   ├── types.ts
│   │   │   ├── validators.ts
│   │   │   └── index.ts
│   │   └── appointments/
│   │       ├── components/
│   │       │   ├── CreateAppointmentForm.tsx
│   │       │   └── AppointmentList.tsx
│   │       ├── types.ts
│   │       ├── validators.ts
│   │       └── index.ts
│   │
│   ├── services/                    # Servicios de datos
│   │   ├── auth.service.ts
│   │   ├── patient.service.ts
│   │   └── appointment.service.ts
│   │
│   ├── hooks/                       # Hooks personalizados
│   │   ├── usePatients.ts
│   │   └── useAppointments.ts
│   │
│   ├── components/                  # Componentes reutilizables
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── LoadingAndStates.tsx
│   │
│   ├── lib/                         # Utilidades
│   │   ├── supabase.ts
│   │   └── validators.ts
│   │
│   └── types/                       # Tipos globales
│       └── index.ts
│
├── public/                          # Assets estáticos
├── .env.example                     # Variables de ambiente (plantilla)
├── .env.local                       # Variables de ambiente (local)
├── .gitignore
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── next.config.js
└── README.md
```

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm run dev

# Compilación
npm run build

# Producción
npm start

# Verificación de tipos
npm run type-check

# Linting (si lo añades)
npm run lint
```

## 🌐 Variables de Ambiente

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL de tu proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima de Supabase |
| `NEXT_PUBLIC_API_URL` | URL de la API (opcional) |

## 📚 Recursos Útiles

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de React Query](https://tanstack.com/query/latest)
- [Documentación de Zod](https://zod.dev)

## 🐛 Troubleshooting

### Error: "NEXT_PUBLIC_SUPABASE_URL not configured"

**Solución**: Asegúrate de que `.env.local` existe y contiene las variables correctas.

### Error: "Cannot find module 'react'"

**Solución**: Ejecuta `npm install` para instalar todas las dependencias.

### Error: "RLS Policy error"

**Solución**: Verifica que las políticas RLS están configuradas correctamente en Supabase.

## 💡 Tips de Desarrollo

1. **Usa los tipos TypeScript**: Aprovecha la tipificación para evitar errores
2. **Valida siempre con Zod**: Valida datos tanto en frontend como en backend
3. **Reutiliza componentes**: Los componentes en `src/components` son base para todo
4. **Módulos independientes**: Cada módulo debe ser independiente y reutilizable
5. **React Query**: Usa hooks de React Query para todas las operaciones async

## 📞 Soporte

Para problemas:
1. Revisa el README principal
2. Verifica las variables de ambiente
3. Consulta la documentación oficial de cada librería
4. Abre un issue si el problema persiste

---

¡Listo para empezar! 🎉
