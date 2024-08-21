import { __unstable__loadDesignSystem } from 'tailwindcss';
import theme from 'tailwindcss/theme.css?raw';

export type DesignSystem = Awaited<
  ReturnType<typeof __unstable__loadDesignSystem>
>;
export type DesignSystemCandidate = NonNullable<
  ReturnType<DesignSystem['parseCandidate']>
>;

/**
 * Loads the design system from the default theme.
 */
export async function loadDesignSystem(): Promise<DesignSystem> {
  return await __unstable__loadDesignSystem(theme);
}

/**
 * Checks if the given value is not null.
 * @param value The value to check.
 * @returns `true` if the value is not null, `false` otherwise.
 */
export function isNotNull<T>(value: T): value is NonNullable<T> {
  return value != null;
}
