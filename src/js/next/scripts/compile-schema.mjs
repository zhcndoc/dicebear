import Ajv from 'ajv/dist/2020.js';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';

const require = createRequire(import.meta.url);
const schema = require('@dicebear/schema/definition.json');

const ajv = new Ajv({ code: { source: true, esm: true } });
const validate = ajv.compile(schema);
const moduleCode = standaloneCode(ajv, validate);

const match = moduleCode.match(/export default (\w+)/);

if (!match) {
  throw new Error('Could not find default export in Ajv standalone output');
}

const fnName = match[1];

const internalCode = moduleCode
  .replaceAll(`export const validate = ${fnName};`, '')
  .replaceAll(`export default ${fnName};`, '');

const classCode = `import { StyleValidationError } from '../Error/StyleValidationError.js';

${internalCode}

export class StyleValidator {
  static validate(data) {
    if (!${fnName}(data)) {
      throw new StyleValidationError(${fnName}.errors || []);
    }
  }
}
`;

mkdirSync('./src/Validator', { recursive: true });
writeFileSync('./src/Validator/StyleValidator.js', classCode);
