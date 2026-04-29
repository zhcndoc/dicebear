---
title: Angular Avatar Library – DiceBear 集成
description: >
  通过 JavaScript avatar 库或 avatar API，将 DiceBear 的 SVG 头像集成到 Angular 应用中。
---

# Angular Avatar Library – 在 Angular 中使用 DiceBear

DiceBear 可以通过 Signals（Angular 17+）或 `OnChanges` 生命周期钩子集成到 Angular 组件中。使用 JavaScript 库可在客户端生成 SVG 头像，或者使用 HTTP API 作为一个简单的 `<img>` 来源，无需额外依赖。

你可以通过 [JS-Library](/how-to-use/js-library/) 或 [HTTP-API](/how-to-use/http-api/) 在 Angular 中使用 DiceBear。

## 使用 JS 库

::: code-group

```typescript [Angular 17+]
import { Component, input, computed } from '@angular/core';
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

@Component({
  selector: 'app-avatar',
  template: `<img [src]="avatarUrl()" alt="头像" />`,
})
export class AvatarComponent {
  seed = input('John Doe');

  avatarUrl = computed(() =>
    new Avatar(lorelei, {
      seed: this.seed(),
      size: 128,
      // ... 其他选项
    }).toDataUri()
  );
}
```

```typescript [Angular 16 and earlier]
import { Component, Input, OnChanges } from '@angular/core';
import { Avatar } from '@dicebear/core';
import lorelei from '@dicebear/definitions/lorelei.json' with { type: 'json' };

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `<img [src]="avatarUrl" alt="头像" />`,
})
export class AvatarComponent implements OnChanges {
  @Input() seed: string = 'John Doe';
  avatarUrl: string = '';

  ngOnChanges() {
    this.avatarUrl = new Avatar(lorelei, {
      seed: this.seed,
      size: 128,
      // ... 其他选项
    }).toDataUri();
  }
}
```

:::

## 使用 HTTP API

::: code-group

```typescript [Angular 17+]
import { Component, input, computed } from '@angular/core';

@Component({
  selector: 'app-avatar',
  template: `<img [src]="avatarUrl()" alt="头像" />`,
})
export class AvatarComponent {
  seed = input('John Doe');

  avatarUrl = computed(() => {
    const url = new URL('https://api.dicebear.com/10.x/lorelei/svg');
    url.searchParams.set('seed', this.seed());
    url.searchParams.set('size', '128');
    // ... 其他选项
    return url.href;
  });
}
```

```typescript [Angular 16 and earlier]
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-avatar',
  standalone: true,
  template: `<img [src]="avatarUrl" alt="头像" />`,
})
export class AvatarComponent implements OnChanges {
  @Input() seed: string = 'John Doe';
  avatarUrl: string = '';

  ngOnChanges() {
    const url = new URL('https://api.dicebear.com/10.x/lorelei/svg');
    url.searchParams.set('seed', this.seed);
    url.searchParams.set('size', '128');
    // ... 其他选项
    this.avatarUrl = url.href;
  }
}
```

:::
