/**
 * Página para crear un nuevo paciente
 */

"use client";

import { useRouter } from "next/navigation";
import { PatientForm } from "@/modules/patients/components/PatientForm";

export default function CreatePatientPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/dashboard/patients");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Crear Nuevo Paciente</h1>
        <p className="text-muted-foreground">
          Registra un nuevo paciente en el sistema. Si es menor de edad, asegúrate de agregar al menos un tutor.
        </p>
      </div>

      <div className="max-w-4xl">
        <PatientForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}