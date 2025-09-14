import React from "react";
import { View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App";
import {
  BellIcon,
  EnvelopeIcon,
  EnvelopeOpenIcon,
  ChevronLeftIcon,
} from "react-native-heroicons/outline";
import logo from "../../../assets/images/notification_icon_96.png";

interface Props {
  showBack?: boolean;
  title?: string;
  hasUnreadMessages?: boolean;
  rightComponent?: React.ReactNode;
}

const TopBar: React.FC<Props> = ({
  showBack,
  hasUnreadMessages,
  rightComponent,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {showBack && (
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <ChevronLeftIcon color="white" size={24} />
          </TouchableOpacity>
        </View>
      )}
      <Image source={logo} style={styles.logo} />
      <View style={styles.rightContainer}>
        {rightComponent
          ? rightComponent
          : !showBack && (
              <>
                <TouchableOpacity style={styles.icon}>
                  <BellIcon color="white" size={22} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.icon}
                  onPress={() => navigation.navigate("Messages")}
                >
                  {hasUnreadMessages ? (
                    <EnvelopeIcon color="white" size={22} />
                  ) : (
                    <EnvelopeOpenIcon color="white" size={22} />
                  )}
                </TouchableOpacity>
              </>
            )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#0a2a63",
  },
  leftContainer: {
    position: "absolute",
    left: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    position: "absolute",
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    height: 48,
    width: 48,
  },
  icon: {
    padding: 4,
  },
});

export default TopBar;
