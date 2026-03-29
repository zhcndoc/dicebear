import { ValidationError } from './ValidationError.js';

export interface StyleValidationErrorDetail {
  readonly message?: string;
  readonly instancePath?: string;
}

export class StyleValidationError extends ValidationError {
  readonly details: readonly StyleValidationErrorDetail[];

  constructor(details: readonly StyleValidationErrorDetail[]) {
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

    super(`Invalid style definition: ${message}`);
    this.name = 'StyleValidationError';
    this.details = details;
  }
}
