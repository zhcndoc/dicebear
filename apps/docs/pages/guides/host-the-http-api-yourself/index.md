---
title: 自托管头像 API – 自己托管 DiceBear
description: >
  为隐私优先设计和商业用途自行托管 DiceBear 头像 API。
  提供 Docker 和 Node.js 部署选项。
---

# 自托管头像 API – 自己托管 DiceBear

在本指南中，我们将向你展示如何自行托管 HTTP API。对于大多数用户来说，这并不是必需的，但在某些情况下会很有用。

你可以在 [GitHub](https://github.com/dicebear/api) 上找到 HTTP API 的源代码。该代码使用 TypeScript 编写，并使用 [Fastify](https://www.fastify.io/) 框架。

## 使用 docker

自行托管 HTTP API 最简单的方法是使用 docker 镜像。你可以在 [Docker Hub](https://hub.docker.com/r/dicebear/api) 上找到该镜像。

```
docker run --tmpfs /run --tmpfs /tmp -p 3000:3000 -i -t dicebear/api:3
```

或者你也可以使用 `docker-compose.yml` 来配置 HTTP API，并通过
“docker compose up” 启动它。

```
services:
  dicebear:
    image: dicebear/api:3
    restart: always
    ports:
      - '3000:3000'
    tmpfs:
      - '/run'
      - '/tmp'
```

## 不使用 docker

如果你不想使用 docker，也可以直接在你的机器上运行 HTTP API。你需要先安装 [Node.js](https://nodejs.org/)。

```
git clone git@github.com:dicebear/api.git
cd api

npm install
npm run build
npm start
```

## 环境变量

HTTP API 支持以下环境变量：

| 变量 | 默认值 | 描述 |
| --- | --- | --- |
| `PORT` | `3000` | 监听端口。 |
| `HOST` | `0.0.0.0` | 绑定的主机（默认绑定所有 IPv4 地址）。 |
| `LOGGER` | `0` | 启用请求日志记录器（1 = 开，0 = 关）。 |
| `PNG` | `1` | 启用 PNG 端点（1 = 开，0 = 关）。 |
| `PNG_SIZE_MIN` | `1` | 允许的最小 PNG 尺寸，单位 px。 |
| `PNG_SIZE_MAX` | `128` | 允许的最大 PNG 尺寸，单位 px。 |
| `PNG_SIZE_DEFAULT` | `128` | 默认 PNG 尺寸，单位 px。 |
| `PNG_EXIF` | `1` | 为 PNG 启用 EXIF 元数据（1 = 开，0 = 关）。需要 Perl 和 procps。 |
| `JPEG` | `1` | 启用 JPEG 端点（1 = 开，0 = 关）。 |
| `JPEG_SIZE_MIN` | `1` | 允许的最小 JPEG 尺寸，单位 px。 |
| `JPEG_SIZE_MAX` | `128` | 允许的最大 JPEG 尺寸，单位 px。 |
| `JPEG_SIZE_DEFAULT` | `128` | 默认 JPEG 尺寸，单位 px。 |
| `JPEG_EXIF` | `1` | 为 JPEG 启用 EXIF 元数据（1 = 开，0 = 关）。需要 Perl 和 procps。 |
| `WEBP` | `1` | 启用 WebP 端点（1 = 开，0 = 关）。 |
| `WEBP_SIZE_MIN` | `1` | 允许的最小 WebP 尺寸，单位 px。 |
| `WEBP_SIZE_MAX` | `128` | 允许的最大 WebP 尺寸，单位 px。 |
| `WEBP_SIZE_DEFAULT` | `128` | 默认 WebP 尺寸，单位 px。 |
| `WEBP_EXIF` | `1` | 为 WebP 启用 EXIF 元数据（1 = 开，0 = 关）。需要 Perl 和 procps。 |
| `AVIF` | `1` | 启用 AVIF 端点（1 = 开，0 = 关）。 |
| `AVIF_SIZE_MIN` | `1` | 允许的最小 AVIF 尺寸，单位 px。 |
| `AVIF_SIZE_MAX` | `128` | 允许的最大 AVIF 尺寸，单位 px。 |
| `AVIF_SIZE_DEFAULT` | `128` | 默认 AVIF 尺寸，单位 px。 |
| `AVIF_EXIF` | `1` | 为 AVIF 启用 EXIF 元数据（1 = 开，0 = 关）。需要 Perl 和 procps。 |
| `VERSIONS` | `5,6,7,8,9,10` | 以逗号分隔的受支持 DiceBear 主版本列表。 |
| `CACHE_CONTROL_AVATARS` | `31536000` | 头像响应的缓存时长，单位秒（1 年）。 |
| `WORKERS` | `1` | Node.js worker 线程数量。 |
| `QUERY_STRING_ARRAY_LIMIT_MIN` | `20` | 每个数组参数允许的最少值数量。 |
| `QUERY_STRING_PARAMETER_LIMIT_MIN` | `100` | 允许的最少查询字符串参数数量。 |

:::info EXIF 元数据
`*_EXIF` 变量需要安装 [Perl](https://www.npmjs.com/package/exiftool-vendored#installation)
和 [procps](https://www.npmjs.com/package/exiftool-vendored#this-package-requires-procps)。
:::
