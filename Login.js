import * as React from "react";
import { Platform, View, Text, TouchableOpacity } from "react-native";
import { Checkbox, Colors, Button } from "react-native-ui-lib";
import { getDataModel } from "./DataModel";
import { googleLoginConfig } from "./secret";
import * as Google from "expo-auth-session/providers/google";
import * as SecureStore from "expo-secure-store";
import * as WebBrowser from "expo-web-browser";
import Logo from "./assets/svg/logo.svg";
import { makeRedirectUri } from "expo-auth-session";

WebBrowser.maybeCompleteAuthSession();

console.log("In Login.js...");

export function Login({ navigation }) {

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      expoClientId: googleLoginConfig.expoClientId,
      iosClientId: googleLoginConfig.iosClientId,
      scopes: googleLoginConfig.scopes,
      prompt: googleLoginConfig.prompt,
      redirectUri: makeRedirectUri({ scheme: 'planneregy' }),
    }
  )

  let auth;
  let dataModel = getDataModel();
  const [requestFrom, setRequestFrom] = React.useState("");

  React.useEffect(() => {
    async function handleResponse() {
      if (response?.type === "success") {
        
        const { authentication } = response;
        auth = authentication;

        let accessToken = auth.accessToken;
        console.log("accessToken attained");
        // console.log("dataModel.isLogin",dataModel.isLogin);
        let userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
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
    } handleResponse();
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
          if (__DEV__) {
            console.log("Dev Mode Active");
            let dataModel = getDataModel();

            const emailTest = "planneregyemailtest@gmail.com";
            const tempToken = "ya29.a0AeXRPp4nN546r3qBjOxDZe0buZaFmfoAoQezviR6xiuQVfwauO4TQ4cpyNRjt1ith5TZ1wnpj7dOHEuXKr20T_URtU783SjaZVe4bSyobZvmmWoWj1KBJEwh_haIZ6m6OrOmCUUZyDIhlYmRi8MkhGQExaOUcveqGwvDC_BoaCgYKAcESARASFQHGX2Mi4mW4JGKwlqG5fbRdv_KaLg0175";

            try {
              let userCreationResult = await dataModel.createNewUser(emailTest);
              console.log("Dev User Created!", userCreationResult);
            } catch (error) {
              console.error("Firebase error in user creation:", error);
            }

            let testKey = dataModel.getUserKey();

            console.log("Dev Key Obtained!");

            await SecureStore.setItemAsync("USER_EMAIL", emailTest);
            await SecureStore.setItemAsync("ACCESS_TOKEN", tempToken);
            await SecureStore.setItemAsync("USER_KEY", testKey);

            console.log("Dev Setup Complete");

            navigation.navigate("OnboardingScreen", {
              userEmail: emailTest,
              userKey: testKey,
            });
          }
          await setRequestFrom((requestFrom) => (requestFrom = "1"));
          // console.log("requestFrom",requestFrom);
          promptAsync();
        }}
      />
    </View>
  );
}
