---
title: 使用标签筛选头像变体
description: >
  变体标签描述变体的外观或行为。tags 选项用于筛选变体池。目前，它会启用
  动画样式中的可选动画功能，而即将发布的版本还会加入心情和头发长度等特征。
---

# 使用标签筛选头像变体

头像样式可以使用**标签**描述其变体。标签是简短的标记，
例如 `animation` 或 `hairLength:long`，用于说明变体的某些特征。标签只用于描述，
不会改变插图。它们可以缩小头像生成所使用的变体池，并且在所有包含标签的样式中以相同方式工作。

## 使用 `tags` 选项进行筛选

`tags` 是一个[核心选项](/guides/core-options/)，因此无论在哪里生成头像，都可以使用它。传入你想保留的标签：

```js
import { Style, Avatar } from '@dicebear/core';
import planets from '@dicebear/styles/planets.json' with { type: 'json' };

const style = new Style(planets);
const avatar = new Avatar(style, {
  seed: 'John',
  tags: ['animation'],
});
```

在 [HTTP API](/how-to-use/http-api/) 中，同样的筛选器是一个以逗号分隔的查询参数：

```
https://api.dicebear.com/10.x/planets/svg?seed=John&tags=animation
```

## 过滤器的工作原理

标签令牌可以是 `category` 或 `category:value`，也可以选择添加 `!` 前缀。
每个令牌都会缩小组件的变体池：

| 令牌              | 作用                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `category:value`  | 保留带有此标签的变体，以及在该类别中没有标签的变体。同一类别的多个值表示“或”。 |
| `category`        | 要求该类别：移除在该类别中没有标签的变体。它只对实际使用该类别的组件生效。   |
| `!category:value` | 移除带有完全匹配此标签的所有变体。                                                                         |
| `!category`       | 移除带有该类别中任意标签的所有变体。                                                                  |

以下规则将这些令牌联系起来：

- 一个类别只会影响使用它的组件，因此你可以改变一项特征，
  同时保持头像的其他部分继续变化。
- 不同类别之间表示“与”，而拒绝（`!`）始终优先于允许。
- 针对单个组件的变体选项更加具体，并且优先级更高。当你直接设置
  `animationVariant` 时，`tags` 过滤器会被动画忽略，并且只应用于其他组件。
- 只有未知类别会被忽略，未知值不会。由于没有变体与其匹配，该类别中带有标签的每个变体都会被移除。`hairLenght:long` 中的拼写错误不会产生任何影响，而 `hairLength:lng` 中的拼写错误会移除头发。

::: tip

如果过滤器导致某个组件没有匹配的变体，则不会绘制该组件。
请放宽过滤条件，或在其[样式页面](/styles/)中检查该样式实际提供的标签。将 `tags` 传递给不带任何标签的样式不会产生任何效果。

:::

## DiceBear 提供的标签

::: warning 目前仅提供 animation 标签

字符类别目前尚未应用于任何样式。像
`mood:positive` 或 `hairLength:long` 这样的过滤器暂时不会产生任何效果。

:::

目前，DiceBear 自有样式仅在一个地方携带标签：动画样式中的可选动画功能。即将发布的版本将为角色样式添加一组共享标签，包括心情、头发长度、头饰、胡须、眼镜和配饰。
这些定义已经记录在
[DiceBear 如何为变体添加标签](/guides/how-dicebear-tags-variants/)中。

| 类别        | 值                       | 应用于                                     |
| ----------- | ------------------------ | ------------------------------------------ |
| `animation` | （裸类别，无值）         | 动画样式的动画组件                         |

动画默认关闭，过滤器的控制方式如下：

| `tags`       | 结果                                              |
| ------------ | --------------------------------------------------- |
| `animation`  | 开启动画，并根据种子使用随机速度。                |
| `!animation` | 保持头像静止，这也是默认状态。                    |

如需固定速度，请跳过过滤器，直接使用
`animationVariant` 选项设置变体（例如 `animationVariant: 'slow'`）。该选项更加具体，并且始终优先。

```js
// 开启动画样式中的可选动画，并根据种子使用随机速度
// 。
const avatar = new Avatar(style, {
  seed: 'Alex',
  tags: ['animation'],
});
```

## 自定义样式

标签并不局限于此列表。[自定义样式](/guides/create-an-avatar-style-with-figma/)可以复用这些类别、添加自己的值，或定义完全不同的类别。唯一的规则是语法：标签是 `category` 或 `category:value`，每个片段都采用驼峰命名法（例如 `mouthExpression:smug` 或 `species:robot`）。样式不必遵循固定的词汇表，因此请选择能够描述你作品的类别。
