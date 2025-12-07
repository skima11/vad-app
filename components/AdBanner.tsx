// components/AdBanner.tsx
import React, { useEffect, useState } from "react";
import { View, Platform } from "react-native";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import mobileAds from 'react-native-google-mobile-ads';

export default function AdBanner() {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await mobileAds().initialize();
        if (mounted) setInitialized(true);
      } catch (e) {
        console.warn("[AdBanner] mobileAds init error", e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Always use test id if not initialized or in dev
  const unitId =
    (__DEV__ || !initialized)
      ? TestIds.BANNER
      : // production unit id (leave as-is)
        "ca-app-pub-4533962949749202/7206578732";

  // Defensive render
  try {
    return (
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <BannerAd size={BannerAdSize.FULL_BANNER} unitId={unitId} requestOptions={{ requestNonPersonalizedAdsOnly: false }} />
      </View>
    );
  } catch (e) {
    console.warn("[AdBanner] render error", e);
    return null;
  }
}
