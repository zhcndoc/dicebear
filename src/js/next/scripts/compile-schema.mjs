import Ajv from 'ajv/dist/2020.js';
import standaloneCode from 'ajv/dist/standalone/index.js';
import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';

const require = createRequire(import.meta.url);
const schema = require('@dicebear/schema/definition.json');

const ajv = new Ajv({ code: { source: true, esm: true } });
const validate = ajv.compile(schema);
const moduleCode = standaloneCode(ajv, validate);

mkdirSync('./src/generated', { recursive: true });
writeFileSync('./src/generated/validateDefinition.js', moduleCode);
