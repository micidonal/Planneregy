import * as React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Login } from "./Login";
import { OnboardingScreen } from "./OnBoardingScreen";
import { PlanOnCalendar } from "./PlanOnCalendar";
import { BeforeLoginScreen } from "./BeforeLoginScreen";
import { TrackingPage } from "./TrackingPage";
import * as Font from "expo-font";

console.log("In App.js...");

const Stack = createNativeStackNavigator();

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fontsLoaded: false,
    };
  }

  async loadFonts() {
    console.log("Starting font load...");
    try {
      await Font.loadAsync({
        "RobotoBoldBold": require("./assets/fonts/Roboto-Bold.ttf"),
        "RobotoBoldBlack": require("./assets/fonts/Roboto-Black.ttf"),
        "RobotoBlackItalic": require("./assets/fonts/Roboto-BlackItalic.ttf"),
        "RobotoRegular": require("./assets/fonts/Roboto-Regular.ttf"),
      });
      console.log("Fonts loaded successfully!");
      this.setState({ fontsLoaded: true });
    } catch (error) {
      console.error("Font loading error:", error);
    }
  }

  componentDidMount() {
    console.log("Component did mount!");
    this.loadFonts();
  }

  headerTitle = (headerName) => {
    let headerStyle = {
      gestureEnabled: false,
      headerBackVisible: false,
      title: headerName,
      headerShadowVisible: false,
      headerBackTitleVisible: false,
      headerStyle: {
        backgroundColor: "white",
      },
      headerTintColor: "none",
      headerTitleStyle: {
        fontWeight: "bold",
        color: "black",
        fontFamily: "RobotoBlackItalic",
      },
    };
    return headerStyle;
  };
  render() {
    console.log("this.state.fontsLoaded", this.state.fontsLoaded);
    if (this.state.fontsLoaded) {
      console.log("font loaded");
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              options={{ headerShown: false }}
              name="BeforeLoginScreen"
              component={BeforeLoginScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Login"
              component={Login}
            />
            <Stack.Screen
              options={this.headerTitle("Welcome to Planneregy Study")}
              name="OnboardingScreen"
              component={OnboardingScreen}
            />
            <Stack.Screen
              options={{ headerShown: false, gestureEnabled: false }}
              name="PlanOnCalendar"
              component={PlanOnCalendar}
            />
            <Stack.Screen
              options={{ headerShown: false, gestureEnabled: false }}
              name="TrackingPage"
              component={TrackingPage}
            />
          </Stack.Navigator>
        </NavigationContainer>
      );
    } else {
      return <Text></Text>;
    }
  }
}
