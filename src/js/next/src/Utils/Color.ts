export class Color {
  // Normalizes any hex format to 6- or 8-digit lowercase with '#' prefix.
  static toHex(hex: string): string {
    const h = hex.replace(/^#/, '').toLowerCase();

    if (h.length === 3) {
      return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    }

    if (h.length === 4) {
      return '#' + h[0] + h[0] + h[1] + h[1] + h[2] + h[2] + h[3] + h[3];
    }

    return '#' + h;
  }

  // Like toHex, but strips the alpha channel to always return 6-digit hex.
  static toRgbHex(hex: string): string {
    const h = this.toHex(hex);

    return h.length > 7 ? h.slice(0, 7) : h;
  }

  static parseHex(hex: string): [number, number, number] {
    const n = this.toRgbHex(hex).slice(1);

    return [
      parseInt(n.slice(0, 2), 16),
      parseInt(n.slice(2, 4), 16),
      parseInt(n.slice(4, 6), 16),
    ];
  }

  // WCAG 2.1 relative luminance with sRGB linearization.
  // https://www.w3.org/WAI/GL/wiki/Relative_luminance
  static luminance(hex: string): number {
    const rgb = this.parseHex(hex);
    const linearR = this.#linearize(rgb[0]);
    const linearG = this.#linearize(rgb[1]);
    const linearB = this.#linearize(rgb[2]);

    return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB;
  }

  // WCAG 2.1 contrast ratio. Returns a value between 1 (identical) and 21 (black/white).
  // https://www.w3.org/WAI/GL/wiki/Contrast_ratio
  static contrastRatio(a: string, b: string): number {
    const la = this.luminance(a);
    const lb = this.luminance(b);

    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  }

  // Returns a new array sorted by descending contrast against the reference color.
  static sortByContrast(candidates: readonly string[], refColor: string): string[] {
    return Array.from(candidates).sort(
      (a, b) =>
        this.contrastRatio(b, refColor) - this.contrastRatio(a, refColor),
    );
  }

  // Returns a new array with excluded colors removed.
  // Returns the original candidates if filtering would empty the list.
  static filterNotEqualTo(
    candidates: readonly string[],
    excluded: readonly string[],
  ): string[] {
    const normalized = new Set(excluded.map((c) => this.toRgbHex(c)));
    const filtered = candidates.filter(
      (c) => !normalized.has(this.toRgbHex(c)),
    );

    return filtered.length > 0 ? filtered : Array.from(candidates);
  }

  static #linearize(channel: number): number {
    const s = channel / 255;

    if (s <= 0.04045) {
      return s / 12.92;
    }

    return ((s + 0.055) / 1.055) ** 2.4;
  }
}
