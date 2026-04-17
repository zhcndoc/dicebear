import { readonly, ref, type InjectionKey, type Ref } from 'vue';
import type { ComponentPreview } from '@theme/utils/componentPreview';

export const componentNamesKey: InjectionKey<Ref<string[]>> = Symbol('componentNames');
export const componentNamesDefault = readonly(ref<string[]>([]));

export const styleColorsKey: InjectionKey<Ref<Record<string, string[]>>> = Symbol('styleColors');
export const styleColorsDefault = readonly(ref<Record<string, string[]>>({}));

export const componentPreviewKey: InjectionKey<Ref<ComponentPreview | null>> = Symbol('componentPreview');
export const componentPreviewDefault = readonly(ref<ComponentPreview | null>(null));

export const styleDefaultsKey: InjectionKey<Ref<Record<string, unknown>>> = Symbol('styleDefaults');
export const styleDefaultsDefault = readonly(ref<Record<string, unknown>>({}));
