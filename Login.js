import * as React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Checkbox, Colors, Button } from "react-native-ui-lib";
import { getDataModel } from "./DataModel";
import { googleLoginConfig } from "./secret";
import { WEATHER_API_KEY } from "./secret";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import moment, { min } from "moment";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Logo from "./assets/svg/logo.svg";


export function Login({ navigation }) {
  const [request, response, promptAsync] =
    Google.useAuthRequest(googleLoginConfig);
  let auth;
  let dataModel = getDataModel();
  const [requestFrom, setRequestFrom] = React.useState("");

  React.useEffect(async () => {
    if (response?.type === "success") {
      const { authentication } = response;
      auth = authentication;

      let accessToken = auth.accessToken;
      //console.log("auth",auth);
      // console.log("dataModel.isLogin",dataModel.isLogin);
      let userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      let userInfoResponseJSON = await userInfoResponse.json();
      let userEmail = userInfoResponseJSON.email;
      console.log("userEmail", userEmail);
      if (Platform.OS !== "web") {
        // Securely store the auth on your device
        let emailAddress = await SecureStore.getItemAsync("USER_EMAIL");
        if (emailAddress) {
          SecureStore.setItemAsync("ACCESS_TOKEN", accessToken);
          navigation.navigate("BeforeLoginScreen", {
            userEmail: userEmail,
          });
        } else {
          await dataModel.createNewUser(userEmail);
          let key = dataModel.getUserKey();
          console.log("user key", key);
          SecureStore.setItemAsync("USER_EMAIL", userEmail);
          SecureStore.setItemAsync("ACCESS_TOKEN", accessToken);
          SecureStore.setItemAsync("USER_KEY", key);

          navigation.navigate("OnboardingScreen", {
            userEmail: userEmail,
            userKey: key,
          });
        }
      }
    }
  }, [response]);

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Logo height={302} width={234} marginBottom={30}/>
      <Button
        label={"Login with Google"}
        labelStyle={{ fontWeight: "bold", fontSize: 15 }}
        size={Button.sizes.medium}
        backgroundColor={Colors.black}
        enableShadow={true}
        onPress={async () => {
          await setRequestFrom((requestFrom) => (requestFrom = "1"));
          // console.log("requestFrom",requestFrom);
          await promptAsync();
        }}
      />
    </View>
  );
}
