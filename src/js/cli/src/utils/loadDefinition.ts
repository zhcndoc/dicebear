import { Style } from '@dicebear/core';
import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Reads a style definition JSON file from disk, validates it via {@link Style},
 * and returns the wrapped style together with a name derived from the file
 * basename.
 */
export function loadDefinition(filePath: string): { style: Style; name: string } {
  const definitionPath = path.resolve(process.cwd(), filePath);
  const definition = JSON.parse(fs.readFileSync(definitionPath, 'utf-8'));
  const style = new Style(definition);
  const name = path.basename(definitionPath, path.extname(definitionPath));

  return { style, name };
}
