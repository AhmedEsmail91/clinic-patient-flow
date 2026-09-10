import Joi from "joi";
import type { FormValidationResult } from "@/types";

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
});

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
});

export const appointmentSchema = Joi.object({
  schedule_id: Joi.string().uuid().required(),
  contact: Joi.string().pattern(/^[0-9+\-\s()]*$/).min(7).max(15).required(),
  appointment_mode: Joi.string().valid("online", "in-person").required(),
  type: Joi.string().valid("consultation", "follow-up", "emergency").required(),
  notes: Joi.string().max(1000).allow("").optional(),
  images: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().required(),
        type: Joi.string().valid("image/jpeg", "image/png", "image/jpg").required(),
        size: Joi.number().max(10485760).required(),
      })
    )
    .max(10)
    .optional(),
  scope_id: Joi.string().uuid().required(),
  countryCode: Joi.string().valid("eg", "sa", "ae", "us", "uk").required(),
});

export const validateForm = (
  schema: Joi.ObjectSchema,
  data: Record<string, unknown>
): FormValidationResult => {
  const { error, value } = schema.validate(data, { abortEarly: false });
  if (error) {
    const errors: Record<string, string> = {};
    error.details.forEach((detail) => {
      errors[String(detail.path[0])] = detail.message;
    });
    return { errors, isValid: false };
  }

  return { value, isValid: true };
};
