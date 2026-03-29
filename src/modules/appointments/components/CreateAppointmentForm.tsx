/**
 * Formulario para crear citas
 * Permite agendar citas para pacientes con doctores
 */

"use client";

import { useState } from "react";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { usePatients } from "@/hooks/usePatients";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card, CardBody, CardFooter } from "@/components/Card";
import { ErrorMessage, SuccessMessage } from "@/components/LoadingAndStates";
import { formatDate, formatTime } from "@/lib/validators";

interface CreateAppointmentFormProps {
  tenantId: string;
  branchId: string;
  doctorId?: string;
  onSuccess?: () => void;
}

export function CreateAppointmentForm({
  tenantId,
  branchId,
  doctorId,
  onSuccess,
}: CreateAppointmentFormProps) {
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_id: doctorId || "",
    scheduled_date: "",
    scheduled_time: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: patients = [] } = usePatients(tenantId);
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
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

    if (!formData.patient_id) {
      newErrors.patient_id = "El paciente es requerido";
    }

    if (!formData.doctor_id) {
      newErrors.doctor_id = "El doctor es requerido";
    }

    if (!formData.scheduled_date) {
      newErrors.scheduled_date = "La fecha es requerida";
    } else {
      const appointmentDate = new Date(formData.scheduled_date);
      const today = new Date();
      if (appointmentDate < today) {
        newErrors.scheduled_date = "La fecha debe ser en el futuro";
      }
    }

    if (!formData.scheduled_time) {
      newErrors.scheduled_time = "La hora es requerida";
    } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(formData.scheduled_time)) {
      newErrors.scheduled_time = "Hora inválida (formato HH:MM)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createAppointment(
      {
        tenant_id: tenantId,
        branch_id: branchId,
        patient_id: formData.patient_id,
        doctor_id: formData.doctor_id,
        scheduled_date: formData.scheduled_date,
        scheduled_time: formData.scheduled_time,
        status: "pending",
        notes: formData.notes || undefined,
      },
      {
        onSuccess: () => {
          setShowSuccess(true);
          setFormData({
            patient_id: "",
            doctor_id: doctorId || "",
            scheduled_date: "",
            scheduled_time: "",
            notes: "",
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

  return (
    <Card title="Nueva Cita" description="Agenda una nueva cita para un paciente">
      <form onSubmit={handleSubmit}>
        <CardBody>
          {errors.submit && <ErrorMessage message={errors.submit} />}
          {showSuccess && <SuccessMessage message="Cita creada exitosamente" />}

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Paciente
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              name="patient_id"
              value={formData.patient_id}
              onChange={handleInputChange}
              className={`
                w-full px-3 py-2 text-base
                border border-input rounded-md bg-background
                text-foreground
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${errors.patient_id ? "border-destructive" : ""}
              `}
            >
              <option value="">Seleccionar paciente...</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.first_name} {patient.last_name}
                </option>
              ))}
            </select>
            {errors.patient_id && (
              <p className="mt-1 text-sm text-destructive">
                {errors.patient_id}
              </p>
            )}
          </div>

          <Input
            label="Doctor"
            name="doctor_id"
            value={formData.doctor_id}
            onChange={handleInputChange}
            placeholder="ID del doctor"
            error={errors.doctor_id}
            required
          />

          <Input
            label="Fecha"
            type="date"
            name="scheduled_date"
            value={formData.scheduled_date}
            onChange={handleInputChange}
            error={errors.scheduled_date}
            required
          />

          <Input
            label="Hora"
            type="time"
            name="scheduled_time"
            value={formData.scheduled_time}
            onChange={handleInputChange}
            error={errors.scheduled_time}
            required
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Notas
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Notas adicionales sobre la cita..."
              className={`
                w-full px-3 py-2 text-base
                border border-input rounded-md bg-background
                text-foreground placeholder-muted-foreground
                focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                disabled:cursor-not-allowed disabled:opacity-50
                transition-colors
              `}
              rows={3}
            />
          </div>
        </CardBody>

        <CardFooter>
          <Button variant="outline">Cancelar</Button>
          <Button type="submit" isLoading={isPending}>
            Agendar Cita
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
