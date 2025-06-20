/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/design/rjF7B4FgtEB3FC8ruNuUGf/%40dicebear%2Fdylan
 */

import type { Prng } from '@dicebear/core';
import type { Options, ComponentPickCollection } from '../types.js';
import { pickComponent } from './pickComponent.js';

type Props = {
  prng: Prng;
  options: Options;
};

export function getComponents({
  prng,
  options,
}: Props): ComponentPickCollection {
  const facialHairComponent = pickComponent({
    prng,
    group: 'facialHair',
    values: options.facialHair,
  });
  const moodComponent = pickComponent({
    prng,
    group: 'mood',
    values: options.mood,
  });
  const hairComponent = pickComponent({
    prng,
    group: 'hair',
    values: options.hair,
  });

  return {
    facialHair: prng.bool(options.facialHairProbability)
      ? facialHairComponent
      : undefined,
    mood: moodComponent,
    hair: hairComponent,
  };
}
