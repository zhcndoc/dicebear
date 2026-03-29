import { ValidationError } from './ValidationError.js';

export interface OptionsValidationErrorDetail {
  readonly message?: string;
  readonly instancePath?: string;
}

export class OptionsValidationError extends ValidationError {
  readonly details: readonly OptionsValidationErrorDetail[];

  constructor(details: readonly OptionsValidationErrorDetail[]) {
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

    const message = parts.join(', ');

    super(`Invalid options: ${message}`);
    this.name = 'OptionsValidationError';
    this.details = details;
  }
}
