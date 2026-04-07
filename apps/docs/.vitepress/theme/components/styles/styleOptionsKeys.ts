import { readonly, ref, type InjectionKey, type Ref } from 'vue';
import type { ComponentDependency } from '@theme/composables/useDependencyMap';

export const componentNamesKey: InjectionKey<Ref<string[]>> = Symbol('componentNames');
export const componentNamesDefault = readonly(ref<string[]>([]));

export const componentDepsKey: InjectionKey<Ref<Record<string, ComponentDependency>>> = Symbol('componentDeps');
export const componentDepsDefault = readonly(ref<Record<string, ComponentDependency>>({}));
