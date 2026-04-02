import type { ConfigStyleCollection } from '@/types';
import { Style } from '@dicebear/core';
import getSchemaOptions from '@/utils/getSchemaOptions';

import adventurerDef from '@dicebear/definitions/adventurer.json';
import adventurerNeutralDef from '@dicebear/definitions/adventurer-neutral.json';
import avataaars from '@dicebear/definitions/avataaars.json';
import avataaarsNeutralDef from '@dicebear/definitions/avataaars-neutral.json';
import bigEarsDef from '@dicebear/definitions/big-ears.json';
import bigEarsNeutralDef from '@dicebear/definitions/big-ears-neutral.json';
import bigSmileDef from '@dicebear/definitions/big-smile.json';
import botttsDef from '@dicebear/definitions/bottts.json';
import botttsNeutralDef from '@dicebear/definitions/bottts-neutral.json';
import croodlesDef from '@dicebear/definitions/croodles.json';
import croodlesNeutralDef from '@dicebear/definitions/croodles-neutral.json';
import dylanDef from '@dicebear/definitions/dylan.json';
import funEmojiDef from '@dicebear/definitions/fun-emoji.json';
import loreleiDef from '@dicebear/definitions/lorelei.json';
import loreleiNeutralDef from '@dicebear/definitions/lorelei-neutral.json';
import micahDef from '@dicebear/definitions/micah.json';
import mininavsDef from '@dicebear/definitions/miniavs.json';
import notionistsDef from '@dicebear/definitions/notionists.json';
import notionistsNeutralDef from '@dicebear/definitions/notionists-neutral.json';
import openPeepsDef from '@dicebear/definitions/open-peeps.json';
import personasDef from '@dicebear/definitions/personas.json';
import pixelArtDef from '@dicebear/definitions/pixel-art.json';
import pixelArtNeutralDef from '@dicebear/definitions/pixel-art-neutral.json';
import toonHeadDef from '@dicebear/definitions/toon-head.json';

function createStyle(definition: unknown): { style: Style; options: ReturnType<typeof getSchemaOptions> } {
  const style = new Style(definition);

  return { style, options: getSchemaOptions(style) };
}

const availableStyles: ConfigStyleCollection = {
  adventurer: createStyle(adventurerDef),
  adventurerNeutral: createStyle(adventurerNeutralDef),
  avataaars: createStyle(avataaars),
  avataaarsNeutral: createStyle(avataaarsNeutralDef),
  bigEars: createStyle(bigEarsDef),
  bigEarsNeutral: createStyle(bigEarsNeutralDef),
  bigSmile: createStyle(bigSmileDef),
  bottts: createStyle(botttsDef),
  botttsNeutral: createStyle(botttsNeutralDef),
  croodles: createStyle(croodlesDef),
  croodlesNeutral: createStyle(croodlesNeutralDef),
  dylan: createStyle(dylanDef),
  funEmoji: createStyle(funEmojiDef),
  lorelei: createStyle(loreleiDef),
  loreleiNeutral: createStyle(loreleiNeutralDef),
  micah: createStyle(micahDef),
  miniavs: createStyle(mininavsDef),
  notionists: createStyle(notionistsDef),
  notionistsNeutral: createStyle(notionistsNeutralDef),
  openPeeps: createStyle(openPeepsDef),
  personas: createStyle(personasDef),
  pixelArt: createStyle(pixelArtDef),
  pixelArtNeutral: createStyle(pixelArtNeutralDef),
  toonHead: createStyle(toonHeadDef),
};

export default availableStyles;
