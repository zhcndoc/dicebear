# Changelog

## 10.0.0

### Breaking Changes

#### Avatar styles are no longer bundled with DiceBear

All individual avatar style packages (e.g. `@dicebear/initials`, `@dicebear/adventurer`, etc.) and the `@dicebear/collection` package have been removed from this repository.

Avatar styles are now distributed as JSON definition files via the separate [`dicebear/definitions`](https://github.com/dicebear/definitions) repository and installed through the `@dicebear/definitions` package. The format follows the new [DiceBear Avatar Style JSON Schema](https://github.com/dicebear/schema).

**Before:**
```bash
npm install @dicebear/core @dicebear/initials
```

```js
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/initials';

const avatar = createAvatar(initials, { seed: 'Jane' });
```

**After:**
```bash
npm install @dicebear/core @dicebear/definitions
```

```js
import { createAvatar } from '@dicebear/core';
import initials from '@dicebear/definitions/initials.json' with { type: 'json' };

const avatar = createAvatar(initials, { seed: 'Jane' });
```

This separation of design assets and code keeps the license of this repository clean and means avatar styles only need to be created once to be usable across all future DiceBear implementations in other programming languages.

