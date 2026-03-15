---
title: Self-Hosted Avatar API – Host DiceBear Yourself
description: >
  Self-host the DiceBear avatar API for privacy-by-design and commercial use.
  Docker and Node.js deployment options available.
---

# Self-Hosted Avatar API – Host DiceBear Yourself

In this guide, we will show you how to host the HTTP API yourself. This is not
necessary for most users, but it can be useful in some cases.

You can find the source code for the HTTP API on
[GitHub](https://github.com/dicebear/api). The code is written in TypeScript and
uses the [Fastify](https://www.fastify.io/) framework.

## With docker

The easiest way to host the HTTP API yourself is to use the docker image. You
can find the image on [Docker Hub](https://hub.docker.com/r/dicebear/api).

```
docker run --tmpfs /run --tmpfs /tmp -p 3000:3000 -i -t dicebear/api:3
```

Or you can use `docker-compose.yml` to configure the HTTP API and start it with
"docker compose up".

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

## Without docker

If you don't want to use docker, you can also run the HTTP API directly on your
machine. You need to have [Node.js](https://nodejs.org/) installed.

```
git clone git@github.com:dicebear/api.git
cd api

npm install
npm run build
npm start
```

## Environment variables

The HTTP API supports the following environment variables:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `3000` | Port to listen on. |
| `HOST` | `0.0.0.0` | Host to bind to (all IPv4 addresses by default). |
| `LOGGER` | `0` | Enable request logger (1 = on, 0 = off). |
| `PNG` | `1` | Enable the PNG endpoint (1 = on, 0 = off). |
| `PNG_SIZE_MIN` | `1` | Minimum allowed PNG size in px. |
| `PNG_SIZE_MAX` | `128` | Maximum allowed PNG size in px. |
| `PNG_SIZE_DEFAULT` | `128` | Default PNG size in px. |
| `PNG_EXIF` | `1` | Enable EXIF metadata for PNG (1 = on, 0 = off). Requires Perl and procps. |
| `JPEG` | `1` | Enable the JPEG endpoint (1 = on, 0 = off). |
| `JPEG_SIZE_MIN` | `1` | Minimum allowed JPEG size in px. |
| `JPEG_SIZE_MAX` | `128` | Maximum allowed JPEG size in px. |
| `JPEG_SIZE_DEFAULT` | `128` | Default JPEG size in px. |
| `JPEG_EXIF` | `1` | Enable EXIF metadata for JPEG (1 = on, 0 = off). Requires Perl and procps. |
| `WEBP` | `1` | Enable the WebP endpoint (1 = on, 0 = off). |
| `WEBP_SIZE_MIN` | `1` | Minimum allowed WebP size in px. |
| `WEBP_SIZE_MAX` | `128` | Maximum allowed WebP size in px. |
| `WEBP_SIZE_DEFAULT` | `128` | Default WebP size in px. |
| `WEBP_EXIF` | `1` | Enable EXIF metadata for WebP (1 = on, 0 = off). Requires Perl and procps. |
| `AVIF` | `1` | Enable the AVIF endpoint (1 = on, 0 = off). |
| `AVIF_SIZE_MIN` | `1` | Minimum allowed AVIF size in px. |
| `AVIF_SIZE_MAX` | `128` | Maximum allowed AVIF size in px. |
| `AVIF_SIZE_DEFAULT` | `128` | Default AVIF size in px. |
| `AVIF_EXIF` | `1` | Enable EXIF metadata for AVIF (1 = on, 0 = off). Requires Perl and procps. |
| `VERSIONS` | `5,6,7,8,9` | Comma-separated list of supported DiceBear major versions. |
| `CACHE_CONTROL_AVATARS` | `31536000` | Cache duration for avatar responses in seconds (1 year). |
| `WORKERS` | `1` | Number of Node.js worker threads. |
| `QUERY_STRING_ARRAY_LIMIT_MIN` | `20` | Minimum number of values allowed per array parameter. |
| `QUERY_STRING_PARAMETER_LIMIT_MIN` | `100` | Minimum number of query string parameters allowed. |

:::info EXIF metadata
The `*_EXIF` variables require [Perl](https://www.npmjs.com/package/exiftool-vendored#installation)
and [procps](https://www.npmjs.com/package/exiftool-vendored#this-package-requires-procps) to be installed.
:::
