/**
 * Formulario para crear pacientes
 * Maneja la creación de pacientes adultos y menores con validación
 */

"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormSchema, PatientFormData } from "../schemas";
import { useCreatePatient } from "../hooks/useCreatePatient";
import { RELATIONSHIPS } from "../types";
import { isMinor } from "@/lib/validators";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card, CardBody, CardFooter } from "@/components/Card";
import { ErrorMessage, SuccessMessage } from "@/components/LoadingAndStates";

interface PatientFormProps {
  onSuccess?: () => void;
}

export function PatientForm({ onSuccess }: PatientFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const { mutate: createPatient, isPending, error } = useCreatePatient();

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      full_name: "",
      document_type_id: "",
      document_number: "",
      birth_date: "",
      guardians: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "guardians",
  });

  const birthDateValue = watch("birth_date");
  const isMinorPatient = birthDateValue ? isMinor(birthDateValue) : false;

  const onSubmit = (data: any) => {
    const formData: PatientFormData = {
      full_name: data.full_name,
      document_type_id: data.document_type_id,
      document_number: data.document_number,
      birth_date: data.birth_date,
      is_minor: isMinorPatient,
      guardians: data.guardians,
    };
    createPatient(formData, {
      onSuccess: () => {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onSuccess?.();
        }, 2000);
      },
    });
  };

  const addGuardian = () => {
    append({
      full_name: "",
      document_type_id: "",
      document_number: "",
      phone: "",
      relationship: "padre" as const,
    });
  };

  return (
    <Card title="Nuevo Paciente" description="Registra un nuevo paciente en el sistema">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardBody>
          {error && <ErrorMessage message={(error as Error).message} />}
          {showSuccess && <SuccessMessage message="Paciente creado exitosamente" />}

          <div className="space-y-4">
            {/* Información básica del paciente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nombre Completo"
                {...register("full_name", { required: false })}
                required={false}
                placeholder="Juan Pérez García"
                error={errors.full_name?.message}
              />

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Tipo de Documento
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <select
                  {...register("document_type_id")}
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
                    {errors.document_type_id.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Número de Documento"
                {...register("document_number", { required: false })}
                required={false}
                placeholder="1234567890"
                error={errors.document_number?.message}
              />

              <Input
                label="Fecha de Nacimiento"
                type="date"
                {...register("birth_date")}
                error={errors.birth_date?.message}
              />
            </div>

            {/* Sección de guardianes si es menor */}
            {isMinorPatient && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4">Tutores</h3>

                {fields.length === 0 && (
                  <p className="text-sm text-muted-foreground mb-4">
                    ⚠️ Se debe registrar al menos un tutor para pacientes menores
                  </p>
                )}

                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium">Tutor {index + 1}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => remove(index)}
                      >
                        Eliminar
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Nombre Completo"
                        {...register(`guardians.${index}.full_name`, { required: false })}
                        required={false}
                        placeholder="María González"
                        error={errors.guardians?.[index]?.full_name?.message}
                      />

                      <div>
                        <label className="block text-sm font-medium mb-1.5">
                          Tipo de Documento
                          <span className="text-red-500 ml-1">*</span>
                        </label>
                        <select
                          {...register(`guardians.${index}.document_type_id`)}
                          className={`
                            w-full px-3 py-2 text-base
                            border border-input rounded-md bg-background
                            text-foreground
                            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                            ${errors.guardians?.[index]?.document_type_id ? "border-destructive" : ""}
                          `}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="cc">Cédula de Ciudadanía</option>
                          <option value="ti">Tarjeta de Identidad</option>
                          <option value="ce">Cédula de Extranjería</option>
                          <option value="pasaporte">Pasaporte</option>
                        </select>
                        {errors.guardians?.[index]?.document_type_id && (
                          <p className="mt-1 text-sm text-destructive">
                            {errors.guardians[index].document_type_id.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Input
                        label="Número de Documento"
                        {...register(`guardians.${index}.document_number`, { required: false })}
                        required={false}
                        placeholder="1234567890"
                        error={errors.guardians?.[index]?.document_number?.message}
                      />

                      <Input
                        label="Teléfono"
                        type="tel"
                        {...register(`guardians.${index}.phone`, { required: false })}
                        required={false}
                        placeholder="+57 310 123 4567"
                        error={errors.guardians?.[index]?.phone?.message}
                      />
                    </div>

                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-1.5">
                        Parentesco
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <select
                        {...register(`guardians.${index}.relationship`)}
                        className={`
                          w-full px-3 py-2 text-base
                          border border-input rounded-md bg-background
                          text-foreground
                          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                          ${errors.guardians?.[index]?.relationship ? "border-destructive" : ""}
                        `}
                      >
                        <option value="">Seleccionar...</option>
                        {RELATIONSHIPS.map((rel) => (
                          <option key={rel.value} value={rel.value}>
                            {rel.label}
                          </option>
                        ))}
                      </select>
                      {errors.guardians?.[index]?.relationship && (
                        <p className="mt-1 text-sm text-destructive">
                          {errors.guardians[index].relationship.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addGuardian}
                >
                  + Agregar Tutor
                </Button>
              </div>
            )}
          </div>
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