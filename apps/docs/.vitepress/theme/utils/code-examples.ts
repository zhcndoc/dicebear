import { getAvatarApiUrl, getAvatarApiCommand } from './avatar/api';

export interface CodeExamples {
  httpApi: string;
  js: string;
  php: string;
  cli: string;
}

export function formatPhpValue(value: unknown, depth = 0): string {
  const indent = '    '.repeat(depth);
  const outerIndent = depth > 0 ? '    '.repeat(depth - 1) : '';

  if (value === null || value === undefined) return 'null';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';

    if (depth === 0) {
      return `[${value.map((v) => formatPhpValue(v)).join(', ')}]`;
    }

    const items = value.map((v) => `${indent}${formatPhpValue(v, depth + 1)}`);

    return `[\n${items.join(',\n')}\n${outerIndent}]`;
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) return '[]';

    if (depth === 0) {
      return `[${entries.map(([k, v]) => `'${k.replace(/'/g, "\\'")}' => ${formatPhpValue(v)}`).join(', ')}]`;
    }

    const items = entries.map(
      ([k, v]) => `${indent}'${k.replace(/'/g, "\\'")}' => ${formatPhpValue(v, depth + 1)}`,
    );

    return `[\n${items.join(',\n')}\n${outerIndent}]`;
  }

  return String(value);
}

export function generateCodeExamples(
  styleName: string,
  optionName: string,
  value: unknown,
): CodeExamples {
  const httpApi = getAvatarApiUrl(styleName, { [optionName]: value });

  const js = `new Avatar(style, {\n  ${optionName}: ${JSON.stringify(value)}\n});`;

  const php = `new Avatar($style, [\n  '${optionName}' => ${formatPhpValue(value)}\n]);`;

  const cli = getAvatarApiCommand(styleName, { [optionName]: value });

  return { httpApi, js, php, cli };
}
