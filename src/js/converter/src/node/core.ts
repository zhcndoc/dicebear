import type {
  Result,
  Exif,
  Avatar,
  Options,
  ToPng,
  ToJpeg,
  ToWebp,
  ToAvif,
} from '../types.js';
import { promises as fs } from 'node:fs';
import { getMimeType } from '../utils/mime-type.js';
import { ensureSize, getMetadata } from '../utils/svg.js';
import * as tmp from 'tmp-promise';
import { renderAsync } from '@resvg/resvg-js';
import sharp from 'sharp';
import { exiftool } from 'exiftool-vendored';

export const toPng: ToPng = (avatar: Avatar, options: Options = {}) => {
  return toFormat(avatar, 'png', options);
};

export const toJpeg: ToJpeg = (avatar: Avatar, options: Options = {}) => {
  return toFormat(avatar, 'jpeg', options);
};

export const toWebp: ToWebp = (avatar: Avatar, options: Options = {}) => {
  return toFormat(avatar, 'webp', options);
};

export const toAvif: ToAvif = (avatar: Avatar, options: Options = {}) => {
  return toFormat(avatar, 'avif', options);
};

function toFormat(
  avatar: Avatar,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  options: Options,
): Result {
  const svg = typeof avatar === 'string' ? avatar : avatar.toString();

  const exifOption = options.includeExif ?? false;
  const exif = exifOption ? getExif(svg) : {};

  return {
    toDataUri: () => toDataUri(svg, format, exif, options),
    toArrayBuffer: () => toArrayBuffer(svg, format, exif, options),
  };
}

async function toDataUri(
  svg: string,
  format: 'svg' | 'png' | 'jpeg' | 'webp' | 'avif',
  exif: Exif,
  options: Options,
): Promise<string> {
  if (format === 'svg') {
    return `data:${getMimeType(format)};utf8,${encodeURIComponent(svg)}`;
  }

  const buffer = await toBuffer(svg, format, exif, options);

  return `data:${getMimeType(format)};base64,${buffer.toString('base64')}`;
}

async function toArrayBuffer(
  rawSvg: string,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  exif: Exif,
  options: Options,
): Promise<ArrayBufferLike> {
  return (await toBuffer(rawSvg, format, exif, options)).buffer;
}

async function toBuffer(
  rawSvg: string,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  exif: Exif,
  options: Options,
): Promise<Buffer> {
  const hasFonts = Array.isArray(options.fonts);

  const { svg, size } = ensureSize(rawSvg, options.size);

  let buffer = (
    await renderAsync(svg, {
      fitTo: { mode: 'width', value: size },
      font: {
        loadSystemFonts: !hasFonts,
        fontFiles: hasFonts ? options.fonts : undefined,
      },
    })
  ).asPng();

  if (format !== 'png') {
    const sharpInstance = sharp(buffer);

    if (format === 'jpeg') {
      sharpInstance.flatten({ background: '#ffffff' });
    }

    buffer = await sharpInstance.toFormat(format).toBuffer();
  }

  if (Object.keys(exif).length > 0) {
    buffer = await tmp.withFile(async ({ path }) => {
      await fs.writeFile(path, buffer);
      await exiftool.write(path, exif, { writeArgs: ['-overwrite_original'] });

      return fs.readFile(path);
    });
  }

  return buffer;
}

// https://www.iptc.org/std/photometadata/specification/IPTC-PhotoMetadata
// https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
function getExif(svg: string): Exif {
  const metadata = getMetadata(svg);

  const exif: Exif = {};

  if (metadata.title) {
    exif['IPTC:ObjectName'] = metadata.title;
    exif['XMP-dc:Title'] = metadata.title;
  }

  if (metadata.source) {
    exif['XMP-plus:LicensorURL'] = metadata.source;
  }

  if (metadata.creator) {
    exif['IPTC:By-line'] = metadata.creator;
    exif['XMP-dc:Creator'] = metadata.creator;

    exif['IPTC:Credit'] = metadata.creator;
    exif['XMP-photoshop:Credit'] = metadata.creator;
  }

  if (metadata.license) {
    exif['XMP-xmpRights:WebStatement'] = metadata.license;
  }

  if (metadata.copyright) {
    exif['IPTC:CopyrightNotice'] = metadata.copyright;
    exif['XMP-dc:Rights'] = metadata.copyright;
  }

  return exif;
}
