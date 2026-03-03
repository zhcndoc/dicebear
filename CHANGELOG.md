# Changelog

## 9.4.0

### Security

- `@dicebear/converter`: `ensureSize()` no longer reads the SVG's `width` /
  `height` attributes to determine the output canvas size. Previously, a
  crafted SVG with extremely large dimensions could cause excessive memory
  allocation (DoS). Thanks to [@maru1009](https://github.com/maru1009) for
  reporting this issue.

### New features

- `@dicebear/converter`: New `size` option for `toPng`, `toJpeg`, `toWebp`, and
  `toAvif` (default: 512, max: 2048). Invalid values (`NaN`, `<= 0`,
  `Infinity`) fall back to 512.
- `dicebear` CLI: The `--size` flag is now forwarded to the converter, so
  rasterized output matches the requested avatar size.

### Breaking changes

- `@dicebear/converter`: The output image size is no longer derived from the
  input SVG dimensions. It is always set by the `size` option.

## 9.0.0

This release fixes a compatibility issue with Next.js caused by the converter
that can convert generated SVG avatars to PNG and JPEG. As of this version, the
converter is no longer part of the core library and must be installed
separately.

### Breaking changes

- `toDataUri` is now synchronous and `toDataUriSync` has been removed
  accordingly.
- `toPng` and `toJpeg` have been removed. These functions can still be used if
  the `@dicebear/converter` library is installed, which provides these two
  methods.

  Before:

  ```js
  import { createAvatar } from '@dicebear/core';
  import { bottts } from '@dicebear/collection';

  const avatar = createAvatar(bottts);
  const png = await avatar.toPng();
  ```

  After:

  ```js
  import { createAvatar } from '@dicebear/core';
  import { bottts } from '@dicebear/collection';
  import { toPng } from '@dicebear/converter';

  const avatar = createAvatar(bottts);
  const png = await toPng(avatar);
  ```

  See [Documentation](https://www.dicebear.com/how-to-use/js-library/converter/)
  for more information.

- `toFile` has been removed as the behaviour of the function cannot be kept
  consistent across the environments. Such a method must be implemented
  yourself.
- `toArrayBuffer` for SVG format has been removed.

### New features

- `toPng` and `toJpeg` now support `fonts` as an option to set custom fonts. See
  [Documentation](https://www.dicebear.com/how-to-use/js-library/converter/) for
  more information.

## 8.0.0

A major update with a small fix that changed the output of the avatars in some
cases. As soon as a fix changes the output of the avatars, we release a major
update to ensure that the avatars of a major version remain consistent. **This
update is backwards compatible and should not cause any issues.**

A bug with random backgrounds has been fixed. These were not consistent between
browsers due to their implementation. This problem has been fixed and the
backgrounds should now be calculated identically in all browsers.

Further information on this bug can be found in this issue:
https://github.com/dicebear/dicebear/issues/394
