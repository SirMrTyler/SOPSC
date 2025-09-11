import React, { useEffect } from "react";
import * as Linking from "expo-linking";
import { consumePendingUrl } from "./intentQueue";

interface AuthGateProps {
  user: any | null;
  bootstrapped: boolean;
  children: React.ReactNode;
}

const AuthGate = ({ user, bootstrapped, children }: AuthGateProps) => {
  useEffect(() => {
    if (!bootstrapped || !user) return;
    const url = consumePendingUrl();
    if (url) {
      Linking.openURL(url);
    }
  }, [bootstrapped, user]);

  return <>{children}</>;
};

export default AuthGate;
