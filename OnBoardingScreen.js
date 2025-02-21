import * as React from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import Onboarding from "react-native-onboarding-swiper";
import Boarding from "./assets/svg/boarding.svg";
import * as Font from "expo-font";


export class OnboardingScreen extends React.Component {
  state = {
    fontsLoaded: false,
  };

  async loadFonts() {
    await Font.loadAsync({
      RobotoBoldBlack: require("./assets/fonts/Roboto/Roboto-Black.ttf"),
      RobotoBoldItalic: require("./assets/fonts/Roboto/Roboto-BlackItalic.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  componentDidMount() {
    this.loadFonts();
  }

  render() {
    return (
      <View style={{ height: "100%", width: "100%" }}>
        <Onboarding
          onDone={() => {
            this.props.navigation.navigate("BeforeLoginScreen", {
              // userEmail: this.state.userEmail,
            });
          }}
          titleStyles={{ color: "black" }}
          bottomBarHighlight={false}
          showSkip={false}
          nextLabel={<Text style={{ fontWeight: "bold" }}>NEXT</Text>}
          pages={[
            {
              backgroundColor: "white",
              image: (
                <View style={{ width: "80%" }}>
                  <Text style={{ fontFamily: "RobotoBoldBlack", fontSize: 24 }}>
                    In this study, you will need to:{"\n"}
                  </Text>
                  <Text
                    style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}
                  >
                    1. Create physical exercise plans weekly{"\n"}
                  </Text>
                  <Text
                    style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}
                  >
                    2. Report your plans{"\n"}
                  </Text>
                  <Text
                    style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}
                  >
                    3. Review your plans weekly and try to improve it {"\n"}
                  </Text>
                </View>
              ),
              title: "",
              subtitle: "",
            },
            {
              backgroundColor: "#fff",
              image: (
                <View style={{ width: "80%" }}>
                  <Text style={{ fontFamily: "RobotoBoldBlack", fontSize: 24 }}>
                    Your ultimate goal in this study is to:{"\n"}
                  </Text>
                  <Text
                    style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}
                  >
                    Find a planning strategy that fits well with both your body
                    and daily routines{"\n"}
                  </Text>
                </View>
              ),
              title: "",
              subtitle: "",
            },
            {
              backgroundColor: "#fff",
              image: (
                <View
                  style={{
                    width: "80%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Boarding height={473} width={363} />
                </View>
              ),
              title: "",
              subtitle: "",
            },
          ]}
        />
      </View>
    );
  }
}
