/**
 * Componente para gestionar tutores de pacientes menores
 */

"use client";

import { useState } from "react";
import { useCreateGuardian, useGuardians } from "@/hooks/usePatients";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card, CardBody } from "@/components/Card";
import { LoadingSpinner } from "@/components/LoadingAndStates";
import { RELATIONSHIPS } from "../types";
import { Guardian } from "@/types";

interface GuardianManagerProps {
  patientId: string;
  patientIsMinor: boolean;
}

export function GuardianManager({
  patientId,
  patientIsMinor,
}: GuardianManagerProps) {
  const { data: guardians = [], isLoading } = useGuardians(patientId);
  const { mutate: createGuardian, isPending } = useCreateGuardian();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    document_type_id: "",
    document_number: "",
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

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "El nombre completo es requerido";
    }

    if (!formData.document_type_id) {
      newErrors.document_type_id = "El tipo de documento es requerido";
    }

    if (!formData.document_number?.trim()) {
      newErrors.document_number = "El número de documento es requerido";
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
        patient_id: patientId,
        full_name: formData.full_name.trim(),
        document_type_id: Number(formData.document_type_id),
        document_number: formData.document_number.trim(),
        phone: formData.phone.trim(),
        relationship: formData.relationship,
      },
      {
        onSuccess: () => {
          setFormData({
            full_name: "",
            document_type_id: "",
            document_number: "",
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
                        {guardian.full_name}
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
                  label="Nombre Completo"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Juan Pérez García"
                  error={errors.full_name}
                  required
                />

                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    Tipo de Documento
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="document_type_id"
                    value={formData.document_type_id}
                    onChange={handleInputChange}
                    className={`
                      w-full px-3 py-2 text-base
                      border border-input rounded-md bg-background
                      text-foreground
                      focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                      ${errors.document_type_id ? "border-destructive" : ""}
                    `}
                  >
                    <option value="">Seleccionar...</option>
                    <option value="cc">Cédula de Ciudadanía</option>
                    <option value="ti">Tarjeta de Identidad</option>
                    <option value="ce">Cédula de Extranjería</option>
                    <option value="pasaporte">Pasaporte</option>
                  </select>
                  {errors.document_type_id && (
                    <p className="mt-1 text-sm text-destructive">
                      {errors.document_type_id}
                    </p>
                  )}
                </div>

                <Input
                  label="Número de Documento"
                  name="document_number"
                  value={formData.document_number}
                  onChange={handleInputChange}
                  placeholder="1234567890"
                  error={errors.document_number}
                  required
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
