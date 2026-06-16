---
title: How Do I Set a Gender?
description: >
  DiceBear has no single gender switch, but you can shape avatars to look more
  masculine or feminine using each style's options. Here is how, plus where to
  share and reuse option sets.
---

# How do I set a gender?

DiceBear has no single `gender` switch, but you can shape any avatar to look more
masculine or feminine. Every feature is its own option, so you stay in control:
pick the ones that fit the look you want, such as the hair or facial hair, and
leave out the rest.

## Find and apply the options

The [Playground](/playground/) shows a preview for every option value and lets
you combine them, with the avatar updating as you go. Every
[avatar style page](/styles/) lists the same options as a static reference, also
with previews, so you can look them up at any time. If you would rather not write
any code, the [Editor](https://editor.dicebear.com) lets you browse styles and
adjust options visually.

Once you know which options you want, pass them as
[query parameters in the HTTP API](/how-to-use/http-api/#options) or as options
in the [JS library](/how-to-use/js-library/) and the other libraries. The
Avataaars style, for example, lets you turn facial hair off with
`facialHairProbability=0`:

```
https://api.dicebear.com/10.x/avataaars/svg?seed=Casey&facialHairProbability=0
```

The options differ from style to style, so check the style page for the one you
use.

## Share and reuse option sets

If you put together a set of options you like, share it under
[Show and tell](https://github.com/orgs/dicebear/discussions/categories/show-and-tell)
in our GitHub Discussions. Other people can then build on your work and adapt it
to their own needs, and you can reuse combinations that others have already
shared.

## Why there is no dedicated gender option

Most DiceBear styles draw a face or head, not a whole body. A face shows very
few features that clearly read as male or female, so there is no dependable set
of traits a `male`/`female` switch could flip. The closest thing to an exception
is facial hair, which grows mainly on men. Even that is a weak signal: many men
are clean-shaven by choice, culture, or religion, and in many populations men
naturally grow little facial hair, so a missing beard tells you nothing.

Beyond facial hair, what reads as "masculine" or "feminine" depends on culture
and personal taste. A hairstyle, a piece of clothing, or an accessory can mean
something different depending on where and who you are. A built-in switch would
have to settle on one fixed interpretation for everyone, and that would not fit
every project or audience.

DiceBear is used all over the world, in every kind of project, so it makes no
assumptions about what a male or female avatar should look like. No option is
tied to a gender unless the style's designer deliberately built it that way. The
options describe features such as hair or glasses, not a gender.
