import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../../App"; // Adjust the import path as necessary

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const onHomePress = (navigation: NavigationProp) => {
    console.log('Home Pressed');
};

export const onReportPress = (navigation: NavigationProp) => {
    console.log('Report Writing Pressed');
};

export const onSchedulePress = (navigation: NavigationProp) => {
    console.log('Schedule Pressed');
};

export const onPublicPostPress = (navigation: NavigationProp) => {
    console.log('Public Post Pressed');
};

export const onInboxPress = (navigation: NavigationProp) => {
    console.log('Inbox Pressed');
    navigation.navigate('Messages');
};