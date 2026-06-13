<script setup lang="ts">
import {
  kebabCase,
  constantCase,
  pascalCase,
  snakeCase,
  camelCase,
} from 'change-case';
import { UiCard, UiCode as Code } from '../ui';
import { computed, ref } from 'vue';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';

const props = defineProps<{
  styleName: string;
}>();

const tab = ref('http-api');

const exampleHttpApiUrl = computed(() => {
  return `https://api.dicebear.com/10.x/${kebabCase(props.styleName)}/svg`;
});

const exampleHttpApiImgTag = computed(() => {
  return `<img
  src="https://api.dicebear.com/10.x/${kebabCase(props.styleName)}/svg"
  alt="avatar"
/>`;
});

const exampleJsLibraryInstall = computed(() => {
  return `npm install @dicebear/core @dicebear/styles --save`;
});

const exampleJsLibraryUsage = computed(() => {
  return `import { Style, Avatar } from '@dicebear/core';
import definition from '@dicebear/styles/${kebabCase(props.styleName)}.json' with { type: 'json' };

const style = new Style(definition);
const avatar = new Avatar(style, {
  // ... options
});

const svg = avatar.toString();
`;
});

const exampleRustInstall = computed(() => {
  return `cargo add dicebear-core serde_json
cargo add dicebear-styles --features ${kebabCase(props.styleName)}`;
});

const exampleRustUsage = computed(() => {
  return `use dicebear_core::{Avatar, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::${constantCase(props.styleName)})?;
let avatar = Avatar::new(&style, json!({
  // ... options
}))?;

let svg = avatar.to_svg();
`;
});

const exampleGoInstall = computed(() => {
  return `go get github.com/dicebear/dicebear-go/v10
go get github.com/dicebear/styles/v10`;
});

const exampleGoUsage = computed(() => {
  return `import (
	dicebear "github.com/dicebear/dicebear-go/v10"
	"github.com/dicebear/styles/v10"
)

style, _ := dicebear.NewStyle([]byte(styles.${pascalCase(props.styleName)}))
avatar, _ := dicebear.NewAvatar(style, map[string]any{
	// ... options
})

svg := avatar.SVG()
`;
});

const exampleDartInstall = computed(() => {
  return `dart pub add dicebear_core dicebear_styles`;
});

const exampleDartUsage = computed(() => {
  return `import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/${snakeCase(props.styleName)}.dart';

final style = Style.parse(${camelCase(props.styleName)});
final avatar = Avatar(style, {
  // ... options
});

final svg = avatar.svg;
`;
});

const exampleCliInstall = computed(() => {
  return `npm install --global dicebear`;
});

const examplePhpInstall = computed(() => {
  return `composer require dicebear/core dicebear/styles`;
});

const examplePhpUsage = computed(() => {
  return `<?php

use Composer\\InstalledVersions;
use DiceBear\\Style;
use DiceBear\\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$definition = json_decode(file_get_contents($basePath . '/src/${kebabCase(props.styleName)}.json'), true);

$style = new Style($definition);
$avatar = new Avatar($style, [
  // ... options
]);

$svg = (string) $avatar;
`;
});

const examplePythonInstall = computed(() => {
  return `pip install dicebear-core dicebear-styles`;
});

const examplePythonUsage = computed(() => {
  return `import json
from importlib.resources import files

from dicebear import Avatar, Style

definition = json.loads(
    files("dicebear_styles").joinpath("${kebabCase(props.styleName)}.json").read_text("utf-8")
)

style = Style(definition)
avatar = Avatar(style, {
    # ... options
})

svg = avatar.to_string()
`;
});

const exampleCliUsage = computed(() => {
  return `dicebear ${props.styleName}`;
});
</script>

<template>
  <UiCard class="style-usage" flush>
    <Tabs v-model:value="tab">
      <TabList>
        <Tab value="http-api">HTTP-API</Tab>
        <Tab value="js-library">JS</Tab>
        <Tab value="php-library">PHP</Tab>
        <Tab value="python-library">Python</Tab>
        <Tab value="rust-library">Rust</Tab>
        <Tab value="go-library">Go</Tab>
        <Tab value="dart-library">Dart</Tab>
        <Tab value="cli">CLI</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="http-api" class="style-usage-body">
          <p>Use this URL to request this avatar style via our HTTP API.</p>
          <Code :code="exampleHttpApiUrl" />

          <p>You can use the URL directly as image source.</p>
          <Code lang="html" :code="exampleHttpApiImgTag" />
          <p>
            See <a href="/how-to-use/http-api">HTTP-API</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="js-library" class="style-usage-body">
          <p>First install the required packages via npm:</p>
          <Code :code="exampleJsLibraryInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code lang="js" :code="exampleJsLibraryUsage" />
          <p>
            See <a href="/how-to-use/js-library">JS</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="php-library" class="style-usage-body">
          <p>First install the required packages via Composer:</p>
          <Code :code="examplePhpInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code lang="php" :code="examplePhpUsage" />
          <p>
            See <a href="/how-to-use/php-library">PHP</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="python-library" class="style-usage-body">
          <p>First install the required packages via pip:</p>
          <Code :code="examplePythonInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code lang="python" :code="examplePythonUsage" />
          <p>
            See <a href="/how-to-use/python-library">Python</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="rust-library" class="style-usage-body">
          <p>First add the required crates via Cargo:</p>
          <Code :code="exampleRustInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code lang="rust" :code="exampleRustUsage" />
          <p>
            See <a href="/how-to-use/rust-library">Rust</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="go-library" class="style-usage-body">
          <p>First add the required modules with go get:</p>
          <Code :code="exampleGoInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code lang="go" :code="exampleGoUsage" />
          <p>
            See <a href="/how-to-use/go-library">Go</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="dart-library" class="style-usage-body">
          <p>First add the required packages with dart pub:</p>
          <Code :code="exampleDartInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code lang="dart" :code="exampleDartUsage" />
          <p>
            See <a href="/how-to-use/dart-library">Dart</a> docs for more
            information.
          </p>
        </TabPanel>
        <TabPanel value="cli" class="style-usage-body">
          <p>First install the CLI package via npm:</p>
          <Code :code="exampleCliInstall" />

          <p>Then you can create this avatar as follows:</p>
          <Code :code="exampleCliUsage" />
          <p>
            See <a href="/how-to-use/cli">CLI</a> docs for more information.
          </p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </UiCard>
</template>

<style lang="scss" scoped>
.style-usage {
  overflow: hidden;

  :deep(.style-usage-body) {
    > *:first-child {
      margin-top: 0 !important;
    }

    > *:last-child {
      margin-bottom: 0 !important;
    }
  }
}
</style>
