import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
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
  title,
  hasUnreadMessages,
  rightComponent,
}) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {showBack && (
        <View style={styles.leftContainer}>
          <TouchableOpacity
            style={styles.backRow}
            onPress={() => navigation.goBack()}
          >
            <ChevronLeftIcon color="white" size={24} />
            {title && <Text style={styles.title}>{title}</Text>}
          </TouchableOpacity>
        </View>
      )}
      <TouchableOpacity
        style={styles.logoContainer}
        onPress={() => navigation.navigate("Landing")}
      >
        <Image source={logo} style={styles.logo} />
        <Text style={styles.homeText}>home</Text>
      </TouchableOpacity>
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
  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  rightContainer: {
    position: "absolute",
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    height: 32,
    width: 32,
  },
  homeText: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
  },
  icon: {
    padding: 4,
  },
  title: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default TopBar;
