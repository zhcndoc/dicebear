// @see https://www.regular-expressions.info/unicode.html
export class Initials {
  // Extracts up to two initials from a seed string. Strips everything
  // after '@' first so email addresses like "john@example.com" yield "J"
  // instead of being treated as two words.
  static fromSeed(seed: string, discardAtSymbol = true): string {
    let input = seed;

    if (discardAtSymbol) {
      input = seed.replace(/@.*/, '');
    }

    input = input.replace(/[`´'ʼ]/g, '');

    const matches = input.match(/(\p{L}[\p{L}\p{M}]*)/gu);

    if (!matches) {
      return discardAtSymbol ? this.fromSeed(seed, false) : '';
    }

    if (matches.length === 1) {
      const match = matches[0].match(/^(?:\p{L}\p{M}*){1,2}/u);

      return match ? match[0].toUpperCase() : '';
    }

    const first = matches[0].match(/^(?:\p{L}\p{M}*)/u);
    const last = matches[matches.length - 1].match(/^(?:\p{L}\p{M}*)/u);

    if (!first || !last) {
      return '';
    }

    return (first[0] + last[0]).toUpperCase();
  }
}
