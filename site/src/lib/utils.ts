import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names.
 *
 * clsx flattens conditionals/arrays/objects into a string; twMerge then resolves
 * conflicts by keeping the LAST utility in each group, so a caller's `px-8`
 * overrides a component's default `px-4` instead of both landing in the class
 * list and letting CSS source order decide. Every shadcn/ui primitive expects
 * this exact helper at `@/lib/utils` (see components.json aliases).
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
