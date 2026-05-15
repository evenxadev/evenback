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
        .max(50, "El apellido materno no puede exceder 50 caracteres"),

    telefono: z.string()
        .min(10, "El teléfono debe tener mínimo 10 dígitos")
        .max(15, "El teléfono no puede exceder 15 dígitos")
        .regex(/^\+?[0-9]+$/, "El teléfono solo debe contener números"),

    curp: z.string()
        .length(18, "El CURP debe tener 18 caracteres")
        .regex(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9]{2}$/, "CURP inválido")
        .optional(),

    fecha_nacimiento: z.string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido, usa YYYY-MM-DD")
        .optional(),
});

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "La contraseña es requerida"),
});

export const refreshSchema = z.object({
    refresh_token: z.string(),
});

export const verificarEmailSchema = z.object({
    codigo: z.string()
        .length(6, "El código debe tener 6 dígitos")
        .regex(/^\d+$/, "El código solo debe contener números"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshSchema>;
export type VerificarEmailInput = z.infer<typeof verificarEmailSchema>;