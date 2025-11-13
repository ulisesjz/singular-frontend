import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const LINEAMIENTO_INSTRUCTION = `Lineamientos:
- Personalizá cada respuesta usando el perfil de onboarding cuando esté disponible.
- Respondé de manera directa y breve, no uses frases largas ni explicaciones innecesarias. Estas interactuando con estudiantes jóvenes que NO LEEN oraciones extensas.
- No asumas género, solo llama al usuario con el nombre disponible en el perfil de onboarding.
- No hace falta mencionar el perfil de onboarding en la respuesta, solo usarlo para personalizarla.`;
