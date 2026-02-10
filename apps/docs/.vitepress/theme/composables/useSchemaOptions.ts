import { capitalCase } from 'change-case';
import { JSONSchema7 } from 'json-schema';
import { computed, toValue, MaybeRefOrGetter } from 'vue';
import { createListCollection } from '@ark-ui/vue/select';

function isPrimitive(value: unknown): value is string | number | boolean {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  );
}

function generateIntegerRange(
  minimum: number,
  maximum: number,
  suffix: string,
) {
  const result: Array<{ value: number; label: string }> = [];
  let step = 10;
  if (maximum <= 100) step = 5;
  if (maximum <= 10) step = 1;

  for (let i = minimum; i <= maximum; i += step) {
    result.push({ value: i, label: `${i}${suffix}` });
  }
  return result;
}

export function useSchemaOptions(
  field: MaybeRefOrGetter<string | number>,
  schema: MaybeRefOrGetter<JSONSchema7>,
) {
  const label = computed(() => {
    return capitalCase(toValue(field).toString());
  });

  const hint = computed(() => {
    if (toValue(field) === 'backgroundRotation') {
      return 'The PRNG generates a number between the smallest and largest value.';
    }

    return undefined;
  });

  const suffix = computed(() => {
    const f = toValue(field).toString();

    return (
      [
        ['%', f.match(/Probability$/)],
        ['%', f === 'scale'],
        ['%', f.match(/^translate/)],
        ['%', f === 'radius'],
        ['°', f === 'rotate' || f === 'backgroundRotation'],
        ['', true],
      ].find(([, match]) => match)?.[0] ?? ''
    );
  });

  const options = computed(() => {
    const s = toValue(schema);
    let result: Map<
      unknown,
      {
        value: unknown;
        label: string;
      }
    > = new Map();

    if (s.type === 'boolean') {
      result.set(true, { value: true, label: 'true' });
      result.set(false, { value: false, label: 'false' });
    }

    if (s.type === 'integer') {
      for (const entry of generateIntegerRange(
        s.minimum || 0,
        s.maximum || 100,
        suffix.value,
      )) {
        result.set(entry.value, entry);
      }
    }

    if (typeof s.items === 'object' && 'enum' in s.items && s.items.enum) {
      for (const value of s.items.enum) {
        if (isPrimitive(value)) {
          result.set(value, { value, label: `${value}${suffix.value}` });
        }
      }
    }

    if (s.enum) {
      for (const value of s.enum) {
        if (isPrimitive(value)) {
          result.set(value, { value, label: `${value}${suffix.value}` });
        }
      }
    }

    if (
      typeof s.items === 'object' &&
      'type' in s.items &&
      s.items.type === 'integer'
    ) {
      for (const entry of generateIntegerRange(
        s.items.minimum || 0,
        s.items.maximum || 100,
        suffix.value,
      )) {
        result.set(entry.value, entry);
      }
    }

    if (s.default) {
      const defaults = Array.isArray(s.default) ? s.default : [s.default];
      for (const value of defaults) {
        if (isPrimitive(value)) {
          result.set(value, { value, label: `${value}${suffix.value}` });
        }
      }
    }

    if (toValue(field) === 'backgroundColor') {
      for (const example of [
        'b6e3f4',
        'c0aede',
        'd1d4f9',
        'ffd5dc',
        'ffdfbf',
      ]) {
        result.set(example, { value: example, label: example });
      }
    }

    if (
      toValue(field)
        .toString()
        .match(/Color$/)
    ) {
      result.set('transparent', { value: 'transparent', label: 'transparent' });
    }

    return Array.from(result.values()).sort((a, b) => {
      if (typeof a.value === 'number' && typeof b.value === 'number') {
        return a.value - b.value;
      }
      if (typeof a.label === 'string' && typeof b.label === 'string') {
        return a.label.localeCompare(b.label);
      }
      return 0;
    });
  });

  const multiple = computed(() => {
    return toValue(schema).type === 'array';
  });

  const isLimited = computed(() => {
    return !!toValue(schema).maxItems;
  });

  const selectItems = computed(() =>
    options.value.map((opt) => ({
      value: String(opt.value),
      label: opt.label,
      rawValue: opt.value,
    })),
  );

  const collection = computed(() =>
    createListCollection({
      items: selectItems.value,
    }),
  );

  return {
    label,
    hint,
    suffix,
    options,
    multiple,
    isLimited,
    selectItems,
    collection,
  };
}
