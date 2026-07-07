---
title: 多少种唯一头像是可能的？
description: >
  了解在默认配置下，每种 DiceBear 头像样式可以生成多少种唯一的、由 seed 驱动的头像组合。
---

<script setup lang="ts">
import UniqueAvatarsTable from '@theme/components/guides/UniqueAvatarsTable.vue';
</script>

# 每种头像样式可以生成多少种唯一头像？

下面的数字表示每种样式在默认配置下、由 seed 驱动的输出空间大小：也就是在其他所有选项都保持不变时，seed 能生成多少种不同的头像。这个计数与渲染器的实际行为一致：

- **每个组件的变体选择。** 每个可见组件都会贡献一个变体选择。`weight: 0` 的变体会被排除，因为 PRNG 永远不会选择它们（除非所有变体的 `weight` 都是 `0`，在这种情况下，PRNG 会回退为在所有变体中进行不加权选择）。
- **概率。** `probability` 严格介于 `0` 和 `100` 之间的组件，会将“未渲染”分支作为一个额外结果。`probability: 0` 的组件会退化为单一的（始终缺失的）结果。
- **每个组件的变换。** 定义中的 `rotate`、`scale` 和 `translate` 范围会针对每个组件引用以 4 位小数精度进行采样，因此一个 `[min, max]` 范围会贡献 `round((max - min) × 10000) + 1` 个不同的值。
- **颜色调色板。** 颜色组会联合评估：`notEqualTo` 会剔除引用组中被选中的 hex 值（并遵循渲染器“在过滤后为空时回退到完整调色板”的规则），而 `contrastTo` 会简化为单个、确定性的选择。
- **由 seed 派生的首字母。** 当某种样式渲染 `initial` 或 `initials` 变量时，每个输出字母的取值范围为 Unicode 的 `\p{L}` 类别（约 140,000 个不同的大写字符），并且 `initials` 每个 seed 最多输出两个字母。

用户提供的选项（自定义颜色调色板、变体白名单、额外背景、`flip`、`rotate`、`scale`、`translate`、`borderRadius`、ID 随机化等）会在此处报告的基础上进一步提高数量。

<UniqueAvatarsTable />

如果某个数字看起来不对，请在 GitHub 上打开一个
[discussion](https://github.com/orgs/dicebear/discussions)。
