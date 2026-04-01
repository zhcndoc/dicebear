export type StyleOptionsFlipValue = 'none' | 'horizontal' | 'vertical' | 'both';
export type StyleOptionsColorFillValue = 'solid' | 'linear' | 'radial';

// ---------------------------------------------------------------------------
// StyleOptions
//
// Uses mapped types and template literal types to derive a precise options
// interface from a style definition. When D has literal keys (e.g. from a
// JSON import) the result provides full autocomplete. When D is the generic
// StyleDefinition it falls back to an index signature.
//
// The helper types use conditional `extends` checks instead of indexed access
// so that D does not need to extend StyleDefinition. This is necessary because
// JSON imports widen string values to `string`, which doesn't satisfy the
// literal unions in StyleDefinition (e.g. StyleDefinitionElementType).
// ---------------------------------------------------------------------------

// Extracts literal component/color names from D; `never` when generic.
type ComponentNames<D> = D extends {
  components: Record<infer K extends string, unknown>;
}
  ? string extends K
    ? never
    : K
  : never;

type ColorNames<D> = D extends {
  colors: Record<infer K extends string, unknown>;
}
  ? string extends K
    ? never
    : K
  : never;

// Always includes 'background' because the renderer unconditionally
// calls options.color('background') when rendering.
type AllColorNames<D> = ColorNames<D> | 'background';

// Resolves variant names for component C; falls back to `string` when
// the definition or the component is generic.
type VariantNames<D, C extends string> = D extends {
  components: Record<string, unknown>;
}
  ? C extends keyof D['components']
    ? D['components'][C] extends {
        variants: Record<infer V extends string, unknown>;
      }
      ? string extends V
        ? string
        : V
      : string
    : string
  : string;

type HasSpecificKeys<D> = [ComponentNames<D>] extends [never]
  ? [ColorNames<D>] extends [never]
    ? false
    : true
  : true;

export interface StyleOptionsBase {
  readonly seed?: string;
  readonly size?: number;
  readonly idRandomization?: boolean;
  readonly title?: string;
  readonly flip?: StyleOptionsFlipValue | readonly StyleOptionsFlipValue[];
  readonly fontFamily?: string | readonly string[];
  readonly fontWeight?: number | readonly number[];
  readonly scale?: number | readonly [number, number];
  readonly borderRadius?: number | readonly [number, number];
  readonly rotate?: number | readonly [number, number];
  readonly translateX?: number | readonly [number, number];
  readonly translateY?: number | readonly [number, number];
}

// Variant option accepts a single name, an array, or a name-to-weight record
// for weighted PRNG selection.
type ComponentVariantOption<D, K extends string> =
  | VariantNames<D, K>
  | readonly VariantNames<D, K>[]
  | Readonly<Partial<Record<VariantNames<D, K>, number>>>;

// For each component C generates: Variant, Probability, Rotate, TranslateX/Y.
type ComponentOptions<D, C extends string> = [C] extends [never]
  ? unknown
  : { readonly [K in C as `${K}Variant`]?: ComponentVariantOption<D, K> } & {
      readonly [K in C as `${K}Probability`]?: number;
    } & {
      readonly [K in C as `${K}Rotate`]?: number | readonly [number, number];
    } & {
      readonly [K in C as `${K}TranslateX`]?:
        | number
        | readonly [number, number];
    } & {
      readonly [K in C as `${K}TranslateY`]?:
        | number
        | readonly [number, number];
    };

// For each color C generates: Color, ColorFill, ColorFillStops, ColorAngle.
type ColorOptions<C extends string> = [C] extends [never]
  ? unknown
  : { readonly [K in C as `${K}Color`]?: string | readonly string[] } & {
      readonly [K in C as `${K}ColorFill`]?:
        | StyleOptionsColorFillValue
        | readonly StyleOptionsColorFillValue[];
    } & {
      readonly [K in C as `${K}ColorFillStops`]?:
        | number
        | readonly [number, number];
    } & {
      readonly [K in C as `${K}ColorAngle`]?:
        | number
        | readonly [number, number];
    };

export type StyleOptions<D = unknown> = StyleOptionsBase &
  ComponentOptions<D, ComponentNames<D>> &
  ColorOptions<AllColorNames<D>> &
  (HasSpecificKeys<D> extends true
    ? unknown
    : { readonly [key: string]: unknown });
