import Ajv from 'ajv/dist/2020.js';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';

const require = createRequire(import.meta.url);

function compileValidator({ schemaModule, errorImport, errorClass, validatorClass, outputPath }) {
  const schema = require(schemaModule);

  const ajv = new Ajv({ code: { source: true, esm: true } });
  const validate = ajv.compile(schema);
  const moduleCode = standaloneCode(ajv, validate);

  const match = moduleCode.match(/export default (\w+)/);

  if (!match) {
    throw new Error(`Could not find default export in Ajv standalone output for ${schemaModule}`);
  }

  const fnName = match[1];

  const internalCode = moduleCode
    .replaceAll(`export const validate = ${fnName};`, '')
    .replaceAll(`export default ${fnName};`, '')
    .replaceAll('require("ajv/dist/runtime/ucs2length").default', 'ucs2length.default');

  const needsUcs2 = internalCode.includes('ucs2length');

  const imports = [`import { ${errorClass} } from '${errorImport}';`];

  if (needsUcs2) {
    imports.push(`import ucs2length from 'ajv/dist/runtime/ucs2length.js';`);
  }

  const classCode = `${imports.join('\n')}

${internalCode}

export class ${validatorClass} {
  static validate(data) {
    if (!${fnName}(data)) {
      throw new ${errorClass}(${fnName}.errors || []);
    }
  }
}
`;

  writeFileSync(outputPath, classCode);
}

mkdirSync('./src/Validator', { recursive: true });

compileValidator({
  schemaModule: '@dicebear/schema/definition.json',
  errorImport: '../Error/StyleValidationError.js',
  errorClass: 'StyleValidationError',
  validatorClass: 'StyleValidator',
  outputPath: './src/Validator/StyleValidator.js',
});

compileValidator({
  schemaModule: '@dicebear/schema/options.json',
  errorImport: '../Error/OptionsValidationError.js',
  errorClass: 'OptionsValidationError',
  validatorClass: 'OptionsValidator',
  outputPath: './src/Validator/OptionsValidator.js',
});
