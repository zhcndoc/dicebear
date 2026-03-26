export class Xml {
  static escape(value: string): string {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll("'", '&apos;')
      .replaceAll('"', '&quot;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;');
  }
}
