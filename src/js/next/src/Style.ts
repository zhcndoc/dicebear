import validate from './generated/validateDefinition.js';
import type { Definition } from './types.js';

export class Style {
  #definition: Definition;

  constructor(data: unknown) {
    if (!validate(data)) {
      const errors = validate.errors
        ?.map((e) => `${e.instancePath} ${e.message}`.trim())
        .join(', ');
      throw new Error(`Invalid style definition: ${errors}`);
    }
    this.#definition = data as Definition;
  }

  get definition(): Definition {
    return this.#definition;
  }
}
