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
import { ensureSize } from '../utils/svg.js';
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

  const { svg } = ensureSize(rawSvg);

  let buffer = (
    await renderAsync(svg, {
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
  const exif: Exif = {};

  const sourceName = svg.match(/<dc:title[^>]*>([^<]*)<\/dc:title>/s);
  const sourceUrl = svg.match(/<dc:source[^>]*>([^<]*)<\/dc:source>/s);
  const creatorName = svg.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/s);
  const licenseUrl = svg.match(
    /<dcterms:license[^>]*>([^<]*)<\/dcterms:license>/s,
  );
  const copyright = svg.match(/<dc:rights[^>]*>(.*?)<\/dc:rights>/s);

  if (sourceName) {
    exif['IPTC:ObjectName'] = sourceName[1];
    exif['XMP-dc:Title'] = sourceName[1];
  }

  if (sourceUrl) {
    exif['XMP-plus:LicensorURL'] = sourceUrl[1];
  }

  if (creatorName) {
    exif['IPTC:By-line'] = creatorName[1];
    exif['XMP-dc:Creator'] = creatorName[1];

    exif['IPTC:Credit'] = creatorName[1];
    exif['XMP-photoshop:Credit'] = creatorName[1];
  }

  if (licenseUrl) {
    exif['XMP-xmpRights:WebStatement'] = licenseUrl[1];
  }

  if (copyright) {
    exif['IPTC:CopyrightNotice'] = copyright[1];
    exif['XMP-dc:Rights'] = copyright[1];
  }

  return exif;
}
