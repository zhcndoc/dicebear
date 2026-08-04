---
title: 如何设置性别？
description: >
  DiceBear 没有单独的性别开关，但你可以通过设置每种风格的选项，让头像看起来
  更阳刚或更阴柔；未来还可以通过标签筛选变体。以下是具体方法，以及在哪里分享和
  重用选项集。
---

# 我该如何设置性别？

DiceBear 没有单独的 `gender` 开关，但你可以让任何头像看起来更阳刚或更阴柔。每个特征
都有自己的选项，你可以直接进行设置，因此可以选择符合所需外观的特征，例如头发或
面部毛发，并省略其他特征。即将发布的版本将添加描述性变体标签，让常见情况只需一行代码即可实现。

## 查找并应用选项

[Playground](/playground/) 会为每个选项值显示预览，并允许你组合这些选项，头像也会随之实时更新。每个[头像样式页面](/styles/)都会列出相同的选项，并提供静态参考和预览，方便你随时查阅。如果你不想编写任何代码，[Editor](https://editor.dicebear.com) 可以让你浏览样式并以可视化方式调整选项。

当你知道自己想要哪些选项后，可以将它们作为 [HTTP API 中的查询参数](/how-to-use/http-api/#options) 传入，或者作为 [JS 库](/how-to-use/js-library/) 及其他库中的选项传入。例如，Avataaars 样式允许你通过 `facialHairProbability=0` 关闭胡须：

```
https://api.dicebear.com/10.x/avataaars/svg?seed=Casey&facialHairProbability=0
```

不同样式的选项各不相同，因此请查看你所使用样式对应的页面。

## 按标签筛选

::: warning 角色标签尚不可用

目前还没有 DiceBear 样式携带 `hairLength` 或 `facialHair` 等标签，因此本节中的筛选器暂时不会产生任何效果。在这些标签发布之前，请设置上文所述的各项功能选项。

:::

即将发布的版本会为角色样式的变体添加描述性标签，例如
`hairLength:long` 或 `headwear:headscarf`。[`tags`](/guides/filter-variants-with-tags/) 选项只保留你选择的变体，这通常是利用那些呈现出更多男性化或女性化特征的功能的最快方式。例如，保留长发并排除面部毛发：

```js
const avatar = new Avatar(style, {
  seed: 'Casey',
  tags: ['hairLength:long', '!facialHair'],
});
```

同样的筛选器也可以作为 HTTP API 中的查询参数：

```
https://api.dicebear.com/10.x/adventurer/svg?seed=Casey&tags=hairLength:long,!facialHair
```

标签和各项功能选项可以配合使用，因此你可以将标签筛选器与
`facialHairProbability` 等选项结合起来。请参阅
[使用标签筛选变体](/guides/filter-variants-with-tags/)，了解筛选器的行为以及目前已提供的标签。

## 分享和复用选项集

如果你整理了一组自己喜欢的选项，可以在我们的 GitHub Discussions 中的
[展示与分享](https://github.com/orgs/dicebear/discussions/categories/show-and-tell)
下分享。这样其他人就可以在你的工作基础上继续构建并将其调整
以满足自己的需求，而你也可以复用其他人已经分享过的组合。

## 为什么没有专门的性别选项

DiceBear 的每个选项都描述了某种会被绘制出来的元素：发型、胡须、眼镜、帽子。这些特征没有任何一种天然属于某个性别。长发、头巾或耳环看起来是男性化还是女性化，取决于约定，而约定会因文化和个人喜好而不同。

`male`/`female` 开关必须为所有人选定一种这样的约定。DiceBear 在世界各地、各种类型的项目中被使用，因此固定的映射对相当一部分用户来说都是不正确的，而且最终会由这个库来决定男性或女性应该是什么样子。这个决定应当由你的项目来做，而不是由我们来做。

面部毛发是最接近某种性别信号的特征，但它仍然说明不了太多。人们因为审美、文化和宗教等原因留胡子或刮掉胡子，因此它的存在描述的是图像，而不是人物本身。

除非某种样式的设计者刻意如此设计，否则没有任何选项与某个性别绑定。选项描述的是头发或眼镜等特征，而你如何理解和使用它们由你决定。
