export interface ValidationErrorDetail {
  readonly message?: string;
  readonly instancePath?: string;
}

/**
 * Base class for schema validation errors. Carries the prefix in `message`
 * and the per-field failures in {@link details}.
 */
export class ValidationError extends Error {
  readonly details: readonly ValidationErrorDetail[];

  constructor(prefix: string, details: readonly ValidationErrorDetail[]) {
    const parts: string[] = [];

    for (const detail of details) {
      const segments: string[] = [];

      if (detail.instancePath) {
        segments.push(detail.instancePath);
      }

      if (detail.message) {
        segments.push(detail.message);
      }

      parts.push(segments.join(' '));
    }

    super(`${prefix}: ${parts.join(', ')}`);
    this.name = 'ValidationError';
    this.details = details;
  }
}
