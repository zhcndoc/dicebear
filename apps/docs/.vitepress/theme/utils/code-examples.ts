import { getAvatarApiUrl, getAvatarApiCommand } from './avatar';

export interface CodeExamples {
  httpApi: string;
  js: string;
  php: string;
  cli: string;
}

function formatPhpValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return `'${value}'`;

  if (Array.isArray(value)) {
    return `[${value.map(formatPhpValue).join(', ')}]`;
  }

  if (typeof value === 'object' && value !== null) {
    const entries = Object.entries(value)
      .map(([k, v]) => `'${k}' => ${formatPhpValue(v)}`)
      .join(', ');

    return `[${entries}]`;
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
