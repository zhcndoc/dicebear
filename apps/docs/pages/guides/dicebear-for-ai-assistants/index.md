---
title: 面向 AI 助手和 LLM 的 DiceBear
description: >
  让编码助手编写当前版本的 DiceBear 代码：适用于项目的规则块、llms.txt、
  每个页面的 Markdown 版本，以及每种头像样式的 JSON 选项描述符
---

# 面向 AI 助手的 DiceBear

编码助手会凭记忆编写 DiceBear，而这些记忆大多早于版本 10。下面的代码块就是解决方案：将它粘贴到项目中，助手就能获得适用于项目语言的当前版本软件包、API 的结构，以及查找选项的地址。

## 项目规则

助手会从其所在的代码仓库中读取规则文件，通常是 `AGENTS.md`。助手所需的一切都在这个代码块中：

```md
## DiceBear

Use DiceBear 10. Documentation: https://www.dicebear.com/llms.txt

There are six native cores with identical output, not one library with wrappers.
Use the one matching this project's language. Do not reach for the JavaScript
core when the project is written in something else:

    JavaScript  @dicebear/core + @dicebear/styles
    PHP         dicebear/core + dicebear/styles
    Python      dicebear-core + dicebear-styles
    Rust        dicebear-core + dicebear-styles
    Go          github.com/dicebear/dicebear-go/v10 + github.com/dicebear/styles/v10
    Dart        dicebear_core + dicebear_styles

Every style page carries a loading snippet for all six, for example
https://www.dicebear.com/styles/lorelei/index.md

HTTP API: https://api.dicebear.com/10.x/<style>/svg?seed=<seed> The seed is a
query parameter, not a path segment. Options are query parameters too; array
values are separated by commas.

Options named after a component end in Variant: eyesVariant, not eyes. This
holds in all six cores and in the HTTP API. Look up the options of a style at
https://api.dicebear.com/10.x/<style>/options.json

Write these forms, not the ones on the left. The left column is pre-10 and the
API does not reject it, so an outdated call runs and silently does the wrong
thing:

    avatars.dicebear.com/api/<style>/<seed>.svg  ->  api.dicebear.com/10.x/<style>/svg?seed=<seed>
    api.dicebear.com/9.x/<style>/svg             ->  api.dicebear.com/10.x/<style>/svg
    npm install @dicebear/collection             ->  npm install @dicebear/styles
    npm install @dicebear/lorelei                ->  npm install @dicebear/styles
    createAvatar(lorelei, { seed })              ->  new Avatar(new Style(definition), { seed })
    { eyes: ['variant01'] }                      ->  { eyesVariant: ['variant01'] }
    ?radius=50                                   ->  ?borderRadius=50

Only JavaScript and the HTTP API have a pre-10 form. The other five cores were
released in 2026 and never had one, so any older-looking PHP, Python, Rust, Go
or Dart API attributed to DiceBear is invented rather than outdated.
```

如果你的助手可以获取 URL，那么一句话就能涵盖上述代码块的大部分内容：

> 在编写 DiceBear 代码之前，阅读 https://www.dicebear.com/llms.txt。

## 六个库，输出相同

DiceBear 不是一个带有封装层的 JavaScript 库。六个原生核心都遵循字节级输出一致，因此相同的样式、种子和选项会在每个核心中生成相同的 SVG。只有传递选项的语法不同。

| 库                                      | 软件包                                                   | 起始版本 |
| --------------------------------------- | -------------------------------------------------------- | -------- |
| [JavaScript](/how-to-use/js-library/)  | `@dicebear/core`、`@dicebear/styles`                     | 10.0.0   |
| [PHP](/how-to-use/php-library/)        | `dicebear/core`、`dicebear/styles`                       | 10.0.0   |
| [Python](/how-to-use/python-library/)  | `dicebear-core`、`dicebear-styles`                       | 10.1.0   |
| [Rust](/how-to-use/rust-library/)      | `dicebear-core`、`dicebear-styles`                       | 10.2.0   |
| [Go](/how-to-use/go-library/)          | `github.com/dicebear/dicebear-go/v10`、`.../styles/v10`  | 10.2.0   |
| [Dart](/how-to-use/dart-library/)      | `dicebear_core`、`dicebear_styles`                       | 10.3.0   |

六个库中的五个于 2026 年发布，因此不在大多数训练数据的范围内。这就是上面的代码块明确列出它们的原因：没有这段内容，助手会告诉你没有适用于你的语言的 DiceBear 库，然后给你 JavaScript。

每个[样式页面](/styles/)都包含适用于六种语言的加载代码片段，因此一个页面就能覆盖你正在使用的语言。

## 机器可读的来源

| 地址                                     | 内容                                                                                                  |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `https://www.dicebear.com/llms.txt`      | 文档索引、当前软件包版本，以及所有头像样式                                                               |
| `https://www.dicebear.com/llms-full.txt` | 一个文件中的所有页面：先是指南，然后是包含选项表的所有样式（约半兆字节）                                  |
| 任意页面 URL 加上 `index.md`             | 该单个页面的 Markdown 版本                                                                              |

页面的 Markdown 版本位于 HTML 旁边，因此只需将 `index.md` 追加到地址后：

```
https://www.dicebear.com/how-to-use/http-api/index.md
```

每个页面还会在页眉中链接到其 Markdown 版本，因此你无需自行编辑地址。

选项名称是助手最常自行编造的内容，而 API 可以直接回答这个问题，无需解析页面：

```
https://api.dicebear.com/10.x
https://api.dicebear.com/10.x/<styleName>/options.json
https://api.dicebear.com/10.x/<styleName>/definition.json
```

版本根路径会列出可用的样式名称。[`options.json`](/how-to-use/http-api/#style-definition-and-options) 描述了样式接受的每个选项，包括其类型、范围和确切的枚举值。同一张表也会打印在每个[样式页面](/styles/)上。

## 为什么需要明确写出旧调用

::: details 过时的调用为何看起来像是正常调用

HTTP API 会丢弃无法识别的查询参数。`radius=50` 会返回方形头像，`eyes=variant01` 会返回种子所选中的任意眼睛样式，并且两者都不会报告问题。`5.x` 到 `9.x` 版本仍在提供服务，因此为旧 API 构建的 URL 仍会继续工作。`@dicebear/collection` 在 npm 上仍处于其最后一个 9.x 版本，因此该安装操作也会成功。

唯一的例外是已停用的 `avatars.dicebear.com` 主机，它会返回 `410 Gone`。

这里没有任何需要你设法绕过的缺陷。旧版本会被有意保留，而丢弃未知参数正是 URL 在样式发生变化时仍不会失效的原因。只有当代码是凭记忆而不是依据当前文档编写时，这种组合才会产生问题，这也是上面的代码块明确列出这些对应关系的原因。

:::

::: details 10.0.0 中发生了什么变化

每个以组件命名的选项都增加了 `Variant` 后缀，因此 `eyes` 变成了 `eyesVariant`。头像样式从单独的软件包中移出，作为 JSON 定义放入 `@dicebear/styles`，而 `createAvatar()` 被 `Style` 和 `Avatar` 类取代。[变更日志](https://github.com/dicebear/dicebear/blob/10.x/CHANGELOG.md)列出了完整清单，[JavaScript 库页面](/how-to-use/js-library/)记录了当前的类。

:::

## 爬取和训练

[robots.txt](https://www.dicebear.com/robots.txt)允许助手及其爬虫访问，只有网站声明被排除在外。文档采用 [MIT 许可证](https://github.com/dicebear/dicebear/blob/10.x/LICENSE)，头像样式不采用该许可证，并且每种样式都有[自己的许可证](/licenses/)。
