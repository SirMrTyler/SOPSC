import { useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import axios from "axios";
import { getApp } from '@react-native-firebase/app';
import { getMessaging, getToken as getFcmToken } from '@react-native-firebase/messaging';
import { getToken, getDeviceId } from "../components/serviceHelpers";

const messagingInst = getMessaging(getApp());

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
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
      }
    );

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response:", response);
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!user) return;

    async function sendTokens(expoPushToken: string, deviceToken: string, platform: string) {
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
            await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          }
        }
      }
    }

    async function register() {
      if (!Device.isDevice) return;
      
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        console.error("Project ID is not defined for push notifications");
        return;
      }
      
      const expoToken = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log("Expo token:", expoToken);

      let deviceToken = "";
      if (Platform.OS === "android") {
        deviceToken = (await getFcmToken(messagingInst)) ?? "";
        console.log("FCM token:", deviceToken);
      } else {
        const apns = await Notifications.getDevicePushTokenAsync();
        deviceToken = apns?.data ?? "";
        console.log("APNs token:", deviceToken);
      }

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
