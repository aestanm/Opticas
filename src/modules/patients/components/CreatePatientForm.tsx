/**
 * Formulario para crear pacientes
 * Maneja la creación de pacientes adultos y menores
 */

"use client";

import { useState } from "react";
import { useCreatePatient } from "@/hooks/usePatients";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card, CardBody, CardFooter } from "@/components/Card";
import { ErrorMessage, SuccessMessage } from "@/components/LoadingAndStates";
import { isMinor } from "@/lib/validators";

interface CreatePatientFormProps {
  onSuccess?: () => void;
}

export function CreatePatientForm({
  onSuccess,
}: CreatePatientFormProps) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    identification_number: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutate: createPatient, isPending } = useCreatePatient();

  const checkIfMinor = (): boolean => {
    if (!formData.date_of_birth) return false;
    return isMinor(formData.date_of_birth);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name?.trim()) {
      newErrors.first_name = "El nombre es requerido";
    } else if (formData.first_name.length < 2) {
      newErrors.first_name = "El nombre debe tener al menos 2 caracteres";
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = "El apellido es requerido";
    } else if (formData.last_name.length < 2) {
      newErrors.last_name = "El apellido debe tener al menos 2 caracteres";
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = "La fecha de nacimiento es requerida";
    }

    if (
      formData.phone &&
      !/^\+?[\d\s\-()]{10,}$/.test(formData.phone)
    ) {
      newErrors.phone = "Teléfono inválido";
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createPatient(
      {
        full_name: `${formData.first_name.trim()} ${formData.last_name.trim()}`,
        phone: formData.phone.trim(),
        document_type_id: Number(formData.identification_number) > 0 ? Number(formData.identification_number) : 1, // Cambiar según la lógica de document type
        document_number: formData.identification_number || "",
        birth_date: formData.date_of_birth,
        is_minor: checkIfMinor(),
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            date_of_birth: "",
            identification_number: "",
          });
          setTimeout(() => {
            setShowSuccess(false);
            onSuccess?.();
          }, 2000);
        },
        onError: (error) => {
          setErrors({ submit: error.message });
        },
      }
    );
  };

  const minorStatus = checkIfMinor();

  return (
    <Card title="Nuevo Paciente" description="Registra un nuevo paciente en el sistema">
      <form onSubmit={handleSubmit}>
        <CardBody>
          {errors.submit && <ErrorMessage message={errors.submit} />}
          {showSuccess && <SuccessMessage message="Paciente creado exitosamente" />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nombre"
              name="first_name"
              value={formData.first_name}
              onChange={handleInputChange}
              placeholder="Juan"
              error={errors.first_name}
              required
            />
            <Input
              label="Apellido"
              name="last_name"
              value={formData.last_name}
              onChange={handleInputChange}
              placeholder="García"
              error={errors.last_name}
              required
            />
          </div>

          <Input
            label="Fecha de Nacimiento"
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleInputChange}
            error={errors.date_of_birth}
            required
          />

          {formData.date_of_birth && minorStatus && (
            <div className="rounded-md bg-blue-50 p-3 text-blue-700 text-sm">
              ℹ️ Se ha detectado que este paciente es menor de edad. Se requerirá registrar al menos un tutor.
            </div>
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="juan@example.com"
            error={errors.email}
          />

          <Input
            label="Teléfono"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+57 310 123 4567"
            error={errors.phone}
          />

          <Input
            label="Número de Identificación"
            name="identification_number"
            value={formData.identification_number}
            onChange={handleInputChange}
            placeholder="1234567890"
          />
        </CardBody>

        <CardFooter>
          <Button variant="outline">Cancelar</Button>
          <Button type="submit" isLoading={isPending}>
            Crear Paciente
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
