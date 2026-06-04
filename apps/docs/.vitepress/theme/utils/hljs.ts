type Hljs = typeof import('highlight.js/lib/core').default;

let hljsPromise: Promise<Hljs> | null = null;

export function loadHljs(): Promise<Hljs> {
  return (hljsPromise ??= (async () => {
    const [
      { default: core },
      { default: javascript },
      { default: xml },
      { default: php },
    ] = await Promise.all([
      import('highlight.js/lib/core'),
      import('highlight.js/lib/languages/javascript'),
      import('highlight.js/lib/languages/xml'),
      import('highlight.js/lib/languages/php'),
    ]);

    for (const [name, language] of [
      ['js', javascript],
      ['html', xml],
      ['php', php],
    ] as const) {
      core.registerLanguage(name, language);
    }

    return core;
  })());
}

export type { Hljs };
