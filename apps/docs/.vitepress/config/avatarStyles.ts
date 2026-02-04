import { AvatarStyles } from '@shared/types';
import avatarStylesJson from './avatarStyles.json';

// Avatar styles are pre-extracted at build time to avoid loading
// the entire @dicebear/collection (with create functions) at runtime.
// Run `npx tsx scripts/extract-avatar-styles.ts` to regenerate.
const avatarStyles = avatarStylesJson as unknown as AvatarStyles;

export default avatarStyles;
