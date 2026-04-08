import { readonly, ref, type InjectionKey, type Ref } from 'vue';
import type { ComponentDependency } from '@theme/composables/useDependencyMap';
import type { ComponentPreview } from '@theme/utils/componentPreview';

export const componentNamesKey: InjectionKey<Ref<string[]>> = Symbol('componentNames');
export const componentNamesDefault = readonly(ref<string[]>([]));

export const componentDepsKey: InjectionKey<Ref<Record<string, ComponentDependency>>> = Symbol('componentDeps');
export const componentDepsDefault = readonly(ref<Record<string, ComponentDependency>>({}));

export const styleColorsKey: InjectionKey<Ref<Record<string, string[]>>> = Symbol('styleColors');
export const styleColorsDefault = readonly(ref<Record<string, string[]>>({}));

export const componentPreviewKey: InjectionKey<Ref<ComponentPreview | null>> = Symbol('componentPreview');

export const styleDefaultsKey: InjectionKey<Ref<Record<string, unknown>>> = Symbol('styleDefaults');
export const styleDefaultsDefault = readonly(ref<Record<string, unknown>>({}));
