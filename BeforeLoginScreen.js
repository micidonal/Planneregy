//This screen is set between App.js and Login.js / PlanOnCalendar.js
//This screen doesn't have any content and is used to determine which screen to jump to between Login.js and PlanOnCalendar.js

import * as React from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import * as Font from "expo-font";
import * as SecureStore from "expo-secure-store";
import moment, { min } from "moment";
import AnimatedLoader from "react-native-animated-loader";
import { getDataModel } from "./DataModel";
import * as Location from "expo-location";
import { WEATHER_API_KEY } from "./secret";

export class BeforeLoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstScreenName: "",
      fontsLoaded: false,
      userEmail: "",
      data: {},
      isLoaderVis: false,
      dataType: "",
    };
    // this.checkIfUserExist();
  }
  //Get DataModel
  componentDidMount() {
    this.setState({
      isLoaderVis: !this.state.isLoaderVis,
    });

    this.dataModel = getDataModel();
    this.dataModel.asyncInit();

    this.loadFonts();
    this.checkIfUserExist();

    // console.log(
    //   "this.state.firstScreenName componentDidMount",
    //   this.state.firstScreenName
    // );
  }

  async loadFonts() {
    await Font.loadAsync({
      RobotoBoldBlack: require("./assets/fonts/Roboto/Roboto-Black.ttf"),
      RobotoBoldItalic: require("./assets/fonts/Roboto/Roboto-BlackItalic.ttf"),
    });
    this.setState({ fontsLoaded: true });
  }

  checkIfUserExist = async () => {
    // await this.setState({isLoaderVis:true});
    //Get local-stored user basic info
    let emailAddress = await SecureStore.getItemAsync("USER_EMAIL");
    let accessToken = await SecureStore.getItemAsync("ACCESS_TOKEN");
    let key = await SecureStore.getItemAsync("USER_KEY");
    // console.log("key", key);
    if (emailAddress) {
      //User already exist
      console.log("email address exist");
      //Get the date range
      let [dateMin, dateMax] = this.processDate();
      //Get users' Google calendar events
      console.log("dateMin, dateMax", dateMin, dateMax);
      let calendarsEventList = await this.getUsersCalendarEvents(
        accessToken,
        emailAddress,
        dateMin,
        dateMax
      );

      let calendarEventListJSON = await calendarsEventList.json();

      //Process Google calendar events into list for calendar view
      let [previousMonthList, thisMonthList, nextMonthList, fullEventList] =
        this.processCalEvent(calendarEventListJSON.items);
      //Get user-defined activity types
      let userDefineActivitiesNotExist =
        await this.dataModel.isUserDefineActivitiesExist(key);
      if (userDefineActivitiesNotExist) {
        await this.dataModel.createUserActivities(key);
      }
      this.setState({ dataType: "user activities" });
      let userActivityList = await this.dataModel.getUserActivities(key);
      // console.log("userActivityList",userActivityList);
      //Get user's plans made in the app
      await this.dataModel.loadUserPlans(key);
      let userPlans = [];
      userPlans = this.dataModel.getUserPlans();
      // console.log("userPlans",userPlans);

      await this.dataModel.loadUserStrategies(key);
      let userStrategies = this.dataModel.getUserStrategies();

      let navToScreen = "";
      //Object: user's basic
      let userInfo = {
        key: key,
        userPlans: userPlans,
      };

      let lastMonthWeather;
      let thisMonthWeather;
      let nextMonthWeather;

      let todayDateFormat = moment(new Date()).format().slice(0, 10);
      let recordEndDate = await SecureStore.getItemAsync("END_DATE");
      console.log("recordEndDate", recordEndDate);
      let todayDate = new Date();

      if (recordEndDate) {
        if (recordEndDate === todayDateFormat) {
          navToScreen = "PlanOnCalendar";
          this.setState({ dataType: "weather" });
          [lastMonthWeather, thisMonthWeather, nextMonthWeather] =
            await this.fetchWeatherInfo(userPlans);
          console.log("weather fetched");
          let weatherFullList = [];

          for (let weather of lastMonthWeather) {
            let newWeather = Object.assign({}, weather);
            newWeather.month = todayDate.getMonth() - 1;
            weatherFullList.push(newWeather);
          }
          for (let weather of thisMonthWeather) {
            let newWeather = Object.assign({}, weather);
            newWeather.month = todayDate.getMonth();
            weatherFullList.push(newWeather);
          }
          for (let weather of nextMonthWeather) {
            let newWeather = Object.assign({}, weather);
            newWeather.month = todayDate.getMonth() + 1;
            weatherFullList.push(newWeather);
          }
          console.log("weather processed");
          await this.dataModel.updateWeatherInfo(key, weatherFullList);
        } else {
          navToScreen = "TrackingPage";
          this.setState({ dataType: "weather" });
          let lastMonthWeatherJSON = await SecureStore.getItemAsync(
            "lastMonthWeather"
          );
          let thisMonthWeatherJSON = await SecureStore.getItemAsync(
            "thisMonthWeather"
          );
          let nextMonthWeatherJSON = await SecureStore.getItemAsync(
            "nextMonthWeather"
          );
          lastMonthWeather = JSON.parse(lastMonthWeatherJSON);
          thisMonthWeather = JSON.parse(thisMonthWeatherJSON);
          nextMonthWeather = JSON.parse(nextMonthWeatherJSON);



          // navToScreen = "PlanOnCalendar";
          // this.setState({ dataType: "weather" });
          // [lastMonthWeather, thisMonthWeather, nextMonthWeather] =
          //   await this.fetchWeatherInfo(userPlans);
          // console.log("weather fetched");
          // let weatherFullList = [];

          // for (let weather of lastMonthWeather) {
          //   let newWeather = Object.assign({}, weather);
          //   newWeather.month = todayDate.getMonth() - 1;
          //   weatherFullList.push(newWeather);
          // }
          // for (let weather of thisMonthWeather) {
          //   let newWeather = Object.assign({}, weather);
          //   newWeather.month = todayDate.getMonth();
          //   weatherFullList.push(newWeather);
          // }
          // for (let weather of nextMonthWeather) {
          //   let newWeather = Object.assign({}, weather);
          //   newWeather.month = todayDate.getMonth() + 1;
          //   weatherFullList.push(newWeather);
          // }
          // console.log("weather processed");
          // await this.dataModel.updateWeatherInfo(key, weatherFullList);
        }
      } else {
        navToScreen = "PlanOnCalendar";
        this.setState({ dataType: "weather" });
        [lastMonthWeather, thisMonthWeather, nextMonthWeather] =
          await this.fetchWeatherInfo(userPlans);
        console.log("weather fetched");
        let weatherFullList = [];

        for (let weather of lastMonthWeather) {
          let newWeather = Object.assign({}, weather);
          newWeather.month = todayDate.getMonth() - 1;
          weatherFullList.push(newWeather);
        }
        for (let weather of thisMonthWeather) {
          let newWeather = Object.assign({}, weather);
          newWeather.month = todayDate.getMonth();
          weatherFullList.push(newWeather);
        }
        for (let weather of nextMonthWeather) {
          let newWeather = Object.assign({}, weather);
          newWeather.month = todayDate.getMonth() + 1;
          weatherFullList.push(newWeather);
        }
        console.log("weather processed");
        await this.dataModel.updateWeatherInfo(key, weatherFullList);
      }

      //Get weather info from OpenWeather API and it into three lists: lastMonthWeather, thisMonthWeather, nextMonthWeather

      for (let event of userInfo.userPlans) {
        if (event.end) {
          if (parseInt(event.end.slice(5, 7)) === todayDate.getMonth() + 1) {
            for (let weather of thisMonthWeather) {
              if (parseInt(event.end.slice(8, 10)) === weather.date) {
                // console.log("weather", weather);
                event.weather = weather.text;
                event.temp = weather.temp;
              }
            }
          } else if (parseInt(event.end.slice(5, 7)) === todayDate.getMonth()) {
            for (let weather of lastMonthWeather) {
              if (parseInt(event.end.slice(8, 10)) === weather.date) {
                // console.log("weather", weather);
                event.weather = weather.text;
                event.temp = weather.temp;
              }
            }
          }
        }
      }

      // console.log("userActivityList[0].activityList",userActivityList[0].activityList);

      await this.setState({ isLoaderVis: false });
      this.props.navigation.navigate(navToScreen, {
        userEmail: emailAddress,
        userInfo: userInfo,
        userStrategies: userStrategies,
        eventsLastMonth: previousMonthList,
        eventsThisMonth: thisMonthList,
        eventsNextMonth: nextMonthList,
        fullEventList: fullEventList,
        lastMonthWeather: lastMonthWeather,
        thisMonthWeather: thisMonthWeather,
        nextMonthWeather: nextMonthWeather,
        userActivityList: userActivityList[0].activityList,
        isFromPlanSetUp: false
      });
      this.setState({ isLoaderVis: false });
      console.log("weather updated");

      // this.props.navigation.navigate("PlanOnCalendar");
      // console.log("calendarEventListJSON",calendarEventListJSON);
    }
  };
  // Get users' calendar events from Google Calendar
  getUsersCalendarEvents = async (
    accessToken,
    calendarsID,
    timeMin,
    timeMax
  ) => {
    // console.log("calendarsID", calendarsID);
    let calendarsEventList;
    calendarsEventList = await fetch(
      "https://www.googleapis.com/calendar/v3/calendars/" +
        calendarsID +
        "/events?" +
        "singleEvents=true&" +
        timeMax +
        "&" +
        timeMin,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return calendarsEventList;
  };
  // Get the date range for requesting Google Calendar events: default: last month, this month, next month
  processDate = () => {
    let currDate = new Date();
    let month = currDate.getMonth();
    let year = currDate.getFullYear();
    let monthMin = month;
    let monthMax = month + 2;
    if (monthMin < 10) {
      monthMin = "0" + monthMin;
    }
    if (monthMax < 10) {
      monthMax = "0" + monthMax;
    }
    let dateMin = "timeMin=" + year + "-" + monthMin + "-01T10%3A00%3A00Z";
    let monthDays = moment(year + "-" + monthMax, "YYYY-MM").daysInMonth();
    let dateMax =
      "timeMax=" + year + "-" + monthMax + "-" + monthDays + "T23%3A00%3A00Z";
    // console.log("dateMin, dateMax", dateMin, dateMax);
    return [dateMin, dateMax];
  };
  // Process the calendar events into three lists: last month, this month, next month
  processCalEvent = (eventList) => {
    let currMonth = moment().format("YYYY-MM");
    let nextMonth = moment().add(1, "months").format("YYYY-MM");

    let lastMonth = moment().subtract(1, "months").format("YYYY-MM");
    //console.log(nextMonth,lastMonth);
    let previousMonthList = [];
    let thisMonthList = [];
    let nextMonthList = [];

    let fullEventList = [];

    for (let dayEvent of eventList) {
      //console.log("dayEvent.start ",dayEvent.start);
      let timeStamp;
      if (dayEvent.start) {
        //console.log("dayEvent", dayEvent);
        if (dayEvent.start.dateTime) {
          timeStamp = dayEvent.start.dateTime.slice(0, 7);
        } else {
          timeStamp = dayEvent.start.date.slice(0, 7);
        }

        //console.log("typeof(dayEvent.start.dateTime)",typeof(dayEvent.start.dateTime));
        let simplifiedEvent = {
          start: dayEvent.start.dateTime,
          end: dayEvent.end.dateTime,
        };
        fullEventList.push(simplifiedEvent);
        if (timeStamp === currMonth) {
          thisMonthList.push(simplifiedEvent);
        } else if (timeStamp === nextMonth) {
          //console.log(timeStamp, "next month added");
          nextMonthList.push(simplifiedEvent);
        } else if (timeStamp === lastMonth) {
          //console.log(timeStamp, "last month added");
          previousMonthList.push(simplifiedEvent);
        }
      }
    }
    return [previousMonthList, thisMonthList, nextMonthList, fullEventList];
    //console.log(currMonth);
  };
  //fetch weather info
  fetchWeatherInfo = async (userPlans) => {
    this.setState({ dataType: "location" });
    let location = await this.getLocation();
    let latitude = location.coords.latitude;
    let longitude = location.coords.longitude;
    console.log("latitude", latitude);
    console.log("longitude", longitude);
    let today = new Date();
    //console.log("userPlans",userPlans);
    let backDate = new Date();
    let historyDateList = [];

    let thisMonthWeather = [];
    let nextMonthWeather = [];
    let lastMonthWeather = [];

    let fullHistoryWeatherList = [];

    for (let i = 28; i > 0; i--) {
      let yesterday = new Date(backDate);
      yesterday.setDate(yesterday.getDate() - 1);
      backDate = yesterday;
      historyDateList.push(yesterday);
    }
    for (let date of historyDateList) {
      date.setHours(date.getHours() - 5);
      let ifPlanExist = false;
      for (let event of userPlans) {
        if (event.start) {
          let planDate = new Date(event.start);
          if (
            date.getMonth() === planDate.getMonth() &&
            date.getDate() === planDate.getDate()
          ) {
            ifPlanExist = true;
            planDate.setHours(planDate.getHours() - 5);
            date = planDate;
          }
        }
      }
      let isoPlanDate = moment(date).unix();
      let weatherHistoryURL = `http://history.openweathermap.org/data/2.5/history/city?lat=${latitude}&lon=${longitude}&type=hour&start=${isoPlanDate}&cnt=1&appid=${WEATHER_API_KEY}`;
      this.setState({ dataType: "historical weather" });
      let weatherHistoryResponse = await fetch(weatherHistoryURL);
      let weatherHistoryJSON = await weatherHistoryResponse.json();
      // console.log("WEATHER_API_KEY",WEATHER_API_KEY);
      // console.log("weatherHistoryJSON",weatherHistoryJSON);
      let historicalWeatherItem = Object.assign(
        {},
        weatherHistoryJSON.list[0].weather[0]
      );
      historicalWeatherItem.date = new Date(
        weatherHistoryJSON.list[0].dt * 1000
      );
      historicalWeatherItem.temp = parseInt(
        parseInt(weatherHistoryJSON.list[0].main.temp - 273) * (9 / 5) + 32
      );
      fullHistoryWeatherList.push(historicalWeatherItem);
    }
    //console.log(fullHistoryWeatherList);

    for (let weather of fullHistoryWeatherList) {
      let weatherImgList = {
        date: weather.date.getDate(),
        img: weather.icon,
        temp: weather.temp,
        text: weather.main,
      };
      if (weather.date.getMonth() === today.getMonth()) {
        if (weather.date.getDate() != today.getDate()) {
          thisMonthWeather.push(weatherImgList);
        }
      } else {
        lastMonthWeather.push(weatherImgList);
      }
    }
    this.setState({ dataType: "current weather" });
    let weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${WEATHER_API_KEY}`;
    let currWeatherResponse = await fetch(weatherURL);
    let weatherJson = await currWeatherResponse.json();
    let weatherNow = {
      date: today.getDate(),
      img: weatherJson.weather[0].icon,
      temp: weatherJson.main.feels_like,
      text: weatherJson.weather[0].main,
    };
    thisMonthWeather.push(weatherNow);

    // let imageURI =
    //   "http://openweathermap.org/img/w/" + weatherJson.weather[0].icon + ".png";
    // this.setState({ imageURI: imageURI });

    let weatherForecastList = [];
    let weatherForecastURL = `http://api.openweathermap.org/data/2.5/forecast/daily?lat=${latitude}&lon=${longitude}&cnt=${16}&units=imperial&appid=${WEATHER_API_KEY}`;
    this.setState({ dataType: "future weather" });

    let weatherForecastResponse = await fetch(weatherForecastURL);
    let weatherForecastJSON = await weatherForecastResponse.json();
    // console.log("weatherForecastJSON",weatherForecastJSON);
    for (let weather of weatherForecastJSON.list) {
      let newWeatherForecast = Object.assign({}, weather.weather[0]);
      newWeatherForecast.date = new Date(weather.dt * 1000);
      newWeatherForecast.temp = weather.feels_like.day;
      weatherForecastList.push(newWeatherForecast);
    }
    // console.log("weatherForecastList",weatherForecastList);

    for (let weather of weatherForecastList) {
      let weatherImgList = {
        date: weather.date.getDate(),
        img: weather.icon,
        temp: weather.temp,
        text: weather.main,
      };
      if (weather.date.getMonth() === today.getMonth()) {
        if (weather.date.getDate() != today.getDate()) {
          thisMonthWeather.push(weatherImgList);
        }
      } else {
        nextMonthWeather.push(weatherImgList);
      }
    }
    // console.log("lastMonthWeather", lastMonthWeather);
    // console.log("thisMonthWeather", thisMonthWeather);
    // console.log("nextMonthWeather", nextMonthWeather);
    return [lastMonthWeather, thisMonthWeather, nextMonthWeather];
  };
  //Get user's location to fetch weather info
  getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.log("Permission Denied");
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    return location;
  };

  render() {
    return (
      <View style={{ width: "100%", height: "100%" }}>
        <AnimatedLoader
          visible={this.state.isLoaderVis}
          overlayColor="rgba(255,255,255,0.75)"
          source={require("./assets/loader.json")}
          animationStyle={{ width: 100, height: 100 }}
          speed={1}
        >
          <Text style={{ fontWeight: "bold", textAlign: "center" }}>
            fetching {this.state.dataType} data...
          </Text>
        </AnimatedLoader>
      </View>
    );
  }
}
