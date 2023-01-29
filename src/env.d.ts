/// <reference path="../.astro/types.d.ts" />
/// <reference types="@astrojs/image/client" />

interface ImportMetaEnv {
  readonly PUBLIC_APPNAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
