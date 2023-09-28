/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_APPNAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
