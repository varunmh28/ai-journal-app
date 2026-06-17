const { getDefaultConfig } = require('expo/metro-config');
const { withTamagui } = require('@tamagui/metro-plugin'); // (Assuming this is imported at the top of your file)

const config = getDefaultConfig(__dirname);

// 1. Inject the standard resolution extensions here to fix markdown-it
config.resolver.sourceExts = [...config.resolver.sourceExts, 'js', 'jsx', 'json', 'ts', 'tsx'];

// 2. Keep your Tamagui export wrapper exactly the same
module.exports = withTamagui(config, {
  components: ['tamagui'],
  config: './tamagui.config.ts',
  outputCSS: './tamagui.generated.css',
});