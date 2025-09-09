import { useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { Platform } from "react-native";
import axios from "axios";
import { getToken, getDeviceId } from "../components/serviceHelpers";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const usePushNotifications = (user: any) => {
  const lastExpoPushToken = useRef<string | undefined>(undefined);
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

    async function registerDevice(expoPushToken: string) {
      const maxRetries = 3;
      const api = axios.create({
        baseURL: process.env.EXPO_PUBLIC_API_URL,
      });
      const authToken = await getToken();
      const deviceId = await getDeviceId();
      const platform = Platform.OS;
      const payload = { expoPushToken, platform, deviceId };

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          await api.post("/devices/register", payload, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${authToken}`,
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
                console.error("Network error sending push token", error.message);
              }
            } else {
              console.error("Failed to send push token", error);
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
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          showBadge: true,
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

      if (lastExpoPushToken.current !== expoToken) {
        await registerDevice(expoToken);
        lastExpoPushToken.current = expoToken;
      }
    }

    register();
  }, [user]);
};
