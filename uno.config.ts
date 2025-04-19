import {
  defineConfig,
  presetIcons,
  presetMini,
  presetTypography,
  presetWebFonts,
} from "unocss";

export default defineConfig({
  presets: [presetIcons(), presetMini(), presetWebFonts(), presetTypography()],
});
