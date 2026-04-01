export class Xml {
  static #entities: Record<string, string> = {
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
    '<': '&lt;',
    '>': '&gt;',
  };

  static #pattern = new RegExp(
    `[${Object.keys(Xml.#entities).join('')}]`,
    'g',
  );

  static escape(value: string): string {
    return value.replace(Xml.#pattern, (ch) => Xml.#entities[ch]);
  }
}
