// plugins/withAdmobAppId.js
const { withAndroidManifest } = require("@expo/config-plugins");

function setAdmobApplicationId(androidManifest, appId) {
  const app = androidManifest.manifest.application?.[0];

  if (!app) {
    throw new Error("AndroidManifest: <application> tag not found.");
  }

  if (!app["meta-data"]) {
    app["meta-data"] = [];
  }

  // Remove old metadata if exists
  app["meta-data"] = app["meta-data"].filter(
    (item) =>
      item.$["android:name"] !== "com.google.android.gms.ads.APPLICATION_ID"
  );

  // Add new metadata
  app["meta-data"].push({
    $: {
      "android:name": "com.google.android.gms.ads.APPLICATION_ID",
      "android:value": appId,
    },
  });

  return androidManifest;
}

module.exports = function withAdmobAppId(config) {
  return withAndroidManifest(config, (config) => {
    const appId = config.extra?.reactNativeGoogleMobileAdsAppId;

    if (!appId) {
      throw new Error(
        "Missing AdMob App ID → add it in app.json under `extra.reactNativeGoogleMobileAdsAppId`"
      );
    }

    config.modResults = setAdmobApplicationId(config.modResults, appId);

    return config;
  });
};
