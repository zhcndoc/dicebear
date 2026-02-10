# How to use the library with Angular?

To use the [JS-Library](/how-to-use/js-library/) with Angular, we convert the
SVG to a data URI and use it as the `src`.

```typescript
import { Component, OnInit } from '@angular/core';
import { createAvatar } from '@dicebear/core';
import { avataaars } from '@dicebear/collection';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `
    <img [src]="avatarUrl" alt="User Avatar" width="120" height="120" />
  `,
})
export class AvatarComponent implements OnInit {
  avatarUrl: string = '';

  ngOnInit() {
    const avatar = createAvatar(avataaars, {
      size: 128,
      // ... other options
    });

    // Returns a string like "data:image/svg+xml;utf8,..."
    this.avatarUrl = avatar.toDataUri();
  }
}
```
