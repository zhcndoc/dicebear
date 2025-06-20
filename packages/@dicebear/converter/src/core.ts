import type {
  Result,
  Exif,
  Avatar,
  ToJpeg,
  ToPng,
  ToWebp,
  ToAvif,
} from './types.js';
import { getMimeType } from './utils/mime-type.js';
import { ensureSize } from './utils/svg.js';

export const toPng: ToPng = (avatar: Avatar) => {
  return toFormat(avatar, 'png');
};

export const toJpeg: ToJpeg = (avatar: Avatar) => {
  return toFormat(avatar, 'jpeg');
};

export const toWebp: ToWebp = (avatar: Avatar) => {
  return toFormat(avatar, 'webp');
};

export const toAvif: ToAvif = (avatar: Avatar) => {
  return toFormat(avatar, 'avif');
};

function toFormat(
  avatar: Avatar,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
): Result {
  const svg = typeof avatar === 'string' ? avatar : avatar.toString();

  return {
    toDataUri: () => toDataUri(svg, format),
    toArrayBuffer: () => toArrayBuffer(svg, format),
  };
}

async function toDataUri(
  svg: string,
  format: 'svg' | 'png' | 'jpeg' | 'webp' | 'avif',
  exif?: Exif,
): Promise<string> {
  if ('svg' === format) {
    return `data:${getMimeType(format)};utf8,${encodeURIComponent(svg)}`;
  }

  const canvas = await toCanvas(svg, format, exif);

  return canvas.toDataURL(getMimeType(format));
}

async function toArrayBuffer(
  rawSvg: string,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  exif?: Exif,
): Promise<ArrayBufferLike> {
  const canvas = await toCanvas(rawSvg, format, exif);

  return await new Promise<ArrayBufferLike>((resolve, reject) => {
    canvas.toBlob((blob) => {
      blob
        ? resolve(blob.arrayBuffer())
        : reject(new Error('Could not create blob'));
    }, getMimeType(format));
  });
}

async function toCanvas(
  rawSvg: string,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  exif?: Exif,
): Promise<HTMLCanvasElement> {
  if (exif) {
    console.warn(
      'The `exif` option is not supported in the browser version of `@dicebear/converter`. \n' +
        'Please use the node version of `@dicebear/converter` to generate images with exif data.',
    );
  }

  const { svg, size } = ensureSize(rawSvg);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');

  if (null === context) {
    throw new Error('Could not get canvas context');
  }

  if (format === 'jpeg') {
    context.fillStyle = 'white';
    context.fillRect(0, 0, size, size);
  }

  const img = document.createElement('img');
  img.width = size;
  img.height = size;

  img.setAttribute('src', await toDataUri(svg, 'svg'));

  return new Promise((resolve, reject) => {
    img.onload = () => {
      context.drawImage(img, 0, 0, size, size);

      resolve(canvas);
    };

    img.onerror = (e) => reject(e);
  });
}
