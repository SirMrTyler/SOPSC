import { useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import axios from "axios";
import messaging from '@react-native-firebase/messaging';
import { getToken, getDeviceId } from "../services/serviceHelpers";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const usePushNotifications = (user: any) => {
  const lastTokens = useRef<{ expoPushToken?: string; deviceToken?: string }>({});

  useEffect(() => {
    if (!user) return;

    async function sendTokens(
      expoPushToken: string,
      deviceToken: string,
      platform: string
    ) {
      const maxRetries = 3;
      const payload = { expoPushToken, deviceToken, platform };
      const api = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
      });
      const token = await getToken();
      const deviceId = await getDeviceId();

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await api.post("/notifications/token", payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              DeviceId: deviceId,
            },
          });

          return;
        } catch (error) {
          if (attempt === maxRetries) {
            if (axios.isAxiosError(error)) {
              if (error.response) {
                console.error(
                  `Request failed with status ${error.response.status}`,
                  error.response.data
                );
              } else {
                console.error("Network error sending push tokens", error.message);
              }
            } else {
              console.error("Failed to send push tokens", error);
            }
          } else {
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * attempt)
            );
          }
        }
      }
    }

    async function register() {
      if (!Device.isDevice) return;

      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      const expoToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId: "a905a038-d584-4e7e-a7f9-cd2091702dc1",
        })
      ).data;
      console.log("Expo token:", expoToken);

      const deviceToken = await messaging().getToken();
      console.log("FCM token:", deviceToken);

      if (
        lastTokens.current.expoPushToken !== expoToken ||
        lastTokens.current.deviceToken !== deviceToken
      ) {
        const platform = Platform.OS;
        await sendTokens(expoToken, deviceToken, platform);
        lastTokens.current = { expoPushToken: expoToken, deviceToken };
      }
    }

    register();
  }, [user]);
};
