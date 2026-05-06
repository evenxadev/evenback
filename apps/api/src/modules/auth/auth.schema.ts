import { z } from "zod";

export const registerSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string()
        .min(8, "La contraseña debe tener mínimo 8 caracteres")
        .max(32, "La contraseña no puede exceder 32 caracteres")
        .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
        .regex(/[0-9]/, "Debe contener al menos un número")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Debe contener al menos un carácter especial"),
    nombre: z.string()
        .min(2, "El nombre debe tener mínimo 2 caracteres")
        .max(50, "El nombre no puede exceder 50 caracteres"),
    apellido_paterno: z.string()
        .min(2, "El apellido paterno debe tener mínimo 2 caracteres")
        .max(50, "El apellido paterno no puede exceder 50 caracteres"),
    apellido_materno: z.string()
        .min(2, "El apellido materno debe tener mínimo 2 caracteres")
        .max(50, "El apellido materno no puede exceder 50 caracteres")
        .optional(),
    telefono: z.string()
        .min(10, "El teléfono debe tener mínimo 10 dígitos")
        .max(15, "El teléfono no puede exceder 15 dígitos")
        .regex(/^\+?[0-9]+$/, "El teléfono solo debe contener números")
        .optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
});

export const refreshSchema = z.object({
    refresh_token: z.string(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;