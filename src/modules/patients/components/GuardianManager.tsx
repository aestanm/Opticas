/**
 * Componente para gestionar tutores de pacientes menores
 */

"use client";

import { useState } from "react";
import { useCreateGuardian, useGuardians } from "@/hooks/usePatients";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card, CardBody, CardFooter } from "@/components/Card";
import { ErrorMessage, LoadingSpinner } from "@/components/LoadingAndStates";
import { RELATIONSHIPS } from "../types";
import { Guardian } from "@/types";

interface GuardianManagerProps {
  tenantId: string;
  patientId: string;
  patientIsMinor: boolean;
}

export function GuardianManager({
  tenantId,
  patientId,
  patientIsMinor,
}: GuardianManagerProps) {
  const { data: guardians = [], isLoading } = useGuardians(patientId);
  const { mutate: createGuardian, isPending } = useCreateGuardian();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    relationship: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!patientIsMinor) {
    return null;
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

    if (!formData.first_name?.trim()) {
      newErrors.first_name = "El nombre es requerido";
    }

    if (!formData.last_name?.trim()) {
      newErrors.last_name = "El apellido es requerido";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "El teléfono es requerido";
    } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Teléfono inválido";
    }

    if (!formData.relationship) {
      newErrors.relationship = "El parentesco es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    createGuardian(
      {
        tenant_id: tenantId,
        patient_id: patientId,
        first_name: formData.first_name.trim(),
        last_name: formData.last_name.trim(),
        email: formData.email || undefined,
        phone: formData.phone.trim(),
        relationship: formData.relationship,
      },
      {
        onSuccess: () => {
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
            phone: "",
            relationship: "",
          });
          setShowForm(false);
        },
      }
    );
  };

  return (
    <Card title="Tutores" description="Gestiona los tutores del paciente menor">
      <CardBody>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            {guardians.length > 0 && (
              <div className="space-y-2 mb-4">
                {guardians.map((guardian: Guardian) => (
                  <div
                    key={guardian.id}
                    className="flex items-center justify-between rounded-md border border-border p-3 bg-card"
                  >
                    <div>
                      <p className="font-medium">
                        {guardian.first_name} {guardian.last_name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {guardian.relationship} • {guardian.phone}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!showForm && guardians.length === 0 && (
              <p className="text-sm text-muted-foreground mb-4">
                ⚠️ Se debe registrar al menos un tutor para pacientes menores
              </p>
            )}

            {showForm ? (
              <form onSubmit={handleSubmit} className="space-y-3 border-t pt-4">
                <Input
                  label="Nombre"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  placeholder="Juan"
                  error={errors.first_name}
                />

                <Input
                  label="Apellido"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  placeholder="García"
                  error={errors.last_name}
                />

                <Input
                  label="Teléfono"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+57 310 123 4567"
                  error={errors.phone}
                  required
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="juan@example.com"
                />

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Parentesco
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleInputChange}
                    className={`
                      w-full px-3 py-2 text-base
                      border border-input rounded-md bg-background
                      text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      ${errors.relationship ? "border-destructive" : ""}
                    `}
                  >
                    <option value="">Seleccionar...</option>
                    {RELATIONSHIPS.map((rel) => (
                      <option key={rel.value} value={rel.value}>
                        {rel.label}
                      </option>
                    ))}
                  </select>
                  {errors.relationship && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.relationship}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" isLoading={isPending}>
                    Guardar Tutor
                  </Button>
                </div>
              </form>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowForm(true)}
              >
                + Agregar Tutor
              </Button>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
}
