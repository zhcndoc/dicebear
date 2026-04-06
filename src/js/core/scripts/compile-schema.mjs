import Ajv from 'ajv';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';

const require = createRequire(import.meta.url);

function compileValidator({ schemaModule, domain }) {
  const errorClass = `${domain}ValidationError`;
  const validatorClass = `${domain}Validator`;

  const schema = require(schemaModule);

  const ajv = new Ajv({ code: { source: true, esm: true } });
  const validate = ajv.compile(schema);
  const moduleCode = standaloneCode(ajv, validate);

  const match = moduleCode.match(/export default (\w+)/);

  if (!match) {
    throw new Error(`Could not find default export in Ajv standalone output for ${schemaModule}`);
  }

  const fnName = match[1];

  // Strip Ajv's own exports and replace its require() call for the ucs2length
  // runtime helper with a plain function reference. This eliminates any runtime
  // dependency on the ajv package — the generated validators are fully standalone.
  const internalCode = moduleCode
    .replaceAll(`export const validate = ${fnName};`, '')
    .replaceAll(`export default ${fnName};`, '')
    .replaceAll('require("ajv/dist/runtime/ucs2length").default', 'ucs2length');

  const needsUcs2 = internalCode.includes('ucs2length');

  const preamble = [`import { ${errorClass} } from '../Error/${errorClass}.js';`];

  if (needsUcs2) {
    // Ajv's ucs2length manually detects surrogate pairs via charCodeAt() for
    // ES5 compatibility. Since ES2015, the string iterator (used by for...of)
    // handles this natively, making the manual approach unnecessary.
    preamble.push(`function ucs2length(str) { let n = 0; for (const _ of str) n++; return n; }`);
  }

  const classCode = `${preamble.join('\n')}

${internalCode}

export class ${validatorClass} {
  static validate(data) {
    if (!${fnName}(data)) {
      throw new ${errorClass}(${fnName}.errors || []);
    }
  }
}
`;

  writeFileSync(`./src/Validator/${validatorClass}.js`, classCode);
}

mkdirSync('./src/Validator', { recursive: true });

compileValidator({ schemaModule: '@dicebear/schema/definition.json', domain: 'Style' });
compileValidator({ schemaModule: '@dicebear/schema/options.json', domain: 'Options' });

