const { withAndroidManifest } = require("@expo/config-plugins");

const setCustomConfig = (config) => {
  return withAndroidManifest(config, async (config) => {
    const manifest = config.modResults;

    let application = manifest.manifest.application[0];
    // Add the `android:usesCleartextTraffic="true"` attribute to the application tag
    application["$"]["android:usesCleartextTraffic"] = "true";

    return config;
  });
};

module.exports = setCustomConfig;
