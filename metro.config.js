const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// css-tree ships CommonJS modules that Metro can't resolve inside react-native-svg/css.
// Stub them out — the CSS parsing path is only used for SVG CSS selectors which
// react-native-qrcode-svg doesn't exercise.
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.startsWith("css-tree")) {
    return { type: "empty" };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
