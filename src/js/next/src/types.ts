export interface DefinitionMeta {
  title?: string;
  creator?: string;
  source?: string;
  homepage?: string;
  license?: { name: string; url: string };
}

export interface Definition {
  $schema?: string;
  $comment?: string;
  meta?: DefinitionMeta;
  attributes?: Record<string, string>;
  canvas: {
    width: number;
    height: number;
    elements: unknown[];
  };
  components?: Record<string, unknown>;
  colors?: Record<string, unknown>;
}
