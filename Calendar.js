import React, { useState } from "react";

import {
  TextInput,
  Text,
  View,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  Modal,
  LayoutAnimation,
  Button,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { generalStyles } from "./styles/GeneralStyling";

import moment, { min } from "moment";
const RED = "#EE442F";
const GREEN = "#1AB700";
const YELLOW = "#FFB800";
const BLACK = "#393939";
const BACKGROUND_COLOR = "white";
const HIGHLIGHT_COLOR = "white";
const BLUE = "#579AFF";
const LIGHTBLUE = "#1AB700";

export class MonthCalendar extends React.Component {
  constructor(props) {
    // console.log("change detected");
    super(props);
    this.months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    this.weekDays = ["S", "M", "T", "W", "T", "F", "S"];
    this.nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    //this.thisMonthEvents = this.props.thisMonthEvents;
    // this.lastMonthEvents = this.props.lastMonthEvents;
    // this.nextMonthEvents = this.props.nextMonthEvents;

    this.dayEventsList;
    this.todayDate = new Date();
    let targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);

    this.state = {
      activeDate: this.props.monthCalCurrDate,

      //thisMonthEvents: this.thisMonthEvents,
      dayEventsList: [],
      targetDate: targetDate.getDay(),
    };
    this.processEvents();
    this.rowIndex = 0;
  }

  onPress = async (item) => {
    console.log("item pressed", item);
    await this.props.onPress(
      item,
      this.props.monthCalCurrDate.getMonth(),
      this.months[this.props.monthCalCurrDate.getMonth()]
    );
    let todayDate = new Date();
    let targetDate = new Date(
      todayDate.getFullYear(),
      this.props.monthCalCurrDate.getMonth(),
      item
    ).getDay();
    console.log("targetDate", targetDate);
    this.setState({ targetDate: targetDate });
    this.processEvents();

    // EventRegister.emit("calendarPressed","pressed"+item);
  };
  getRowIndex = () => {
    console.log("getRowIndex rowIndex", this.rowIndex);
    return this.rowIndex;
  };
  processEvents = () => {
    //console.log("ProcessEvents", this.state.thisMonthEvents);
    // console.log("ProcessEvents");
    // console.log("monthCalCurrDate", this.state.activeDate);
    // console.log("this.props.thisMonthEvents",this.props.thisMonthEvents);
    let eventListDates = [];
    for (let event of this.props.thisMonthEvents) {
      let dateNum = String(event.start).slice(8, 10);
      if (!eventListDates.includes(dateNum)) {
        eventListDates.push(dateNum);
      }
    }
    let dayEventsList = [];
    for (let dateNum of eventListDates) {
      let dayEventObj = {
        dateNum: parseInt(dateNum),
        morningEvents: [],
        afternoonEvents: [],
      };
      dayEventsList.push(dayEventObj);
    }
    for (let date of dayEventsList) {
      for (let event of this.props.thisMonthEvents) {
        let dateNum = parseInt(String(event.start).slice(8, 10));
        if (dateNum === date.dateNum) {
          let newEvent = Object.assign({}, event);
          newEvent.id = event.end + event.start;
          newEvent.identifier = "default";
          let eventDate = new Date(newEvent.start);
          if (eventDate.getHours() < 12) {
            date.morningEvents.push(newEvent);
          } else {
            date.afternoonEvents.push(newEvent);
          }
        }
      }
      date.morningEvents.sort((a, b) => {
        return new Date(a.start) - new Date(b.start);
      });
      date.afternoonEvents.sort((a, b) => {
        return new Date(a.start) - new Date(b.start);
      });
    }
    //console.log("this.dayEventsList", dayEventsList);
    this.dayEventsList = dayEventsList;
    this.setState({ dayEventsList: dayEventsList });
  };

  generateMatrix = () => {
    var matrix = [];
    // Create header
    // matrix[0] = this.weekDays;
    var year = this.props.monthCalCurrDate.getFullYear();
    var month = this.props.monthCalCurrDate.getMonth();
    var firstDay = new Date(year, month, 1).getDay();

    var maxDays = this.nDays[month];
    if (month == 1) {
      if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        maxDays += 1;
      }
    }
    var counter = 1;
    for (var row = 1; row < 6; row++) {
      matrix[row] = [];
      for (var col = 0; col < 7; col++) {
        matrix[row][col] = -1;
        if (row == 1 && col >= firstDay) {
          // Fill in rows only after the first day of the month
          matrix[row][col] = counter++;
        } else if (row > 1 && counter <= maxDays) {
          // Fill in rows only if the counter's not greater than
          // the number of days in the month
          matrix[row][col] = counter++;
        }
      }
    }

    return matrix;
  };

  render() {
    var matrix = this.generateMatrix();
    var rows = [];
    rows = matrix.map((row, rowIndex) => {
      var rowItems = row.map((item, colIndex) => {
        let strategyStartDate = new Date(this.props.monthCalStrategyStartDate);
        // console.log("strategyStartDate",strategyStartDate);
        let strategyEndDate = new Date(this.props.monthCalStrategyStartDate);
        strategyEndDate.setDate(strategyEndDate.getDate() + 7);
        // console.log("strategyStartDate",strategyStartDate);
        let todayDate = new Date();
        let selectedDate = new Date(
          todayDate.getFullYear(),
          this.props.monthCalCurrDate.getMonth(),
          item
        );
        let isWithinStrategy;
        if (
          selectedDate >= strategyStartDate &&
          selectedDate <= strategyEndDate
        ) {
          isWithinStrategy = true;
          // console.log("isWithinStrategy",isWithinStrategy);
        } else {
          // console.log("not within");
        }
        //Render first row
        if (rowIndex === 0) {
          return (
            <View
              style={{
                flex: 1,
                textAlign: "center",
                height: rowIndex == 0 ? 20 : 18,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "space-between",
                //backgroundColor: rowIndex == 0 ? "" : "#fff",
                width: "100%",
                borderRadius: rowIndex == 0 ? 15 : 0,
                // borderColor:RED,
                // borderWidth:2,
                margin: rowIndex == 0 ? 17 : 0,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  textAlign: "center",
                  height: rowIndex == 0 ? 25 : 18,
                  // Highlight header

                  // Highlight Sundays
                  color: colIndex == 0 ? "#a00" : "#000",
                  // Highlight current date
                  fontWeight:
                    item == this.props.monthCalCurrDate.getDate() ||
                    rowIndex == 0
                      ? "bold"
                      : "300",
                }}
              >
                {item != -1 ? item : ""}
              </Text>
            </View>
          );
        } else {
          let flatEventListMorning = [];
          let flatEventListAfternoon = [];
          let dayEventsList;
          if (this.state.dayEventsList.length === 0) {
            dayEventsList = this.dayEventsList;
          } else {
            dayEventsList = this.state.dayEventsList;
          }
          //console.log("else starting")
          for (let dayEvent of dayEventsList) {
            //console.log("dayEvent", dayEvent);
            //console.log("item",item);

            if (item == dayEvent.dateNum) {
              flatEventListMorning = dayEvent.morningEvents;
              flatEventListAfternoon = dayEvent.afternoonEvents;

              //console.log("flatEventList created");
            }
          }

          // let iconNum = "";

          // let findWeather = false;
          // for (let dayWeather of this.props.weatherThisMonth) {
          //   console.log("dayWeather", dayWeather);

          //   if (item == dayWeather.date) {
          //     findWeather = true;
          //     iconNum = dayWeather.img;
          //   }
          //   if (!findWeather) {
          //     iconNum = "unknown";
          //   }
          // }
          let iconNum = "";
          let iconEmoji = "";

          if (item == this.props.monthCalCurrDate.getDate()) {
            this.rowIndex = rowIndex;
          }

          let findWeather = false;
          for (let dayWeather of this.props.weatherThisMonth) {
            //console.log("dayWeather", dayWeather);

            if (item == dayWeather.date) {
              findWeather = true;
              iconNum = dayWeather.img;
            }
            if (!findWeather) {
              iconNum = "unknown";
            }
          }

          switch (iconNum) {
            case "01d":
              iconEmoji = "☀️";
              break;
            case "01n":
              iconEmoji = "🌙";
              break;
            case "02d":
              iconEmoji = "🌥";
              break;
            case "02n":
              iconEmoji = "🌥";
              break;
            case "03d":
              iconEmoji = "⛅️";
              break;
            case "03n":
              iconEmoji = "⛅️";
              break;
            case "04d":
              iconEmoji = "☁️";
              break;
            case "04n":
              iconEmoji = "☁️";
              break;
            case "09d":
              iconEmoji = "🌧";
              break;
            case "09n":
              iconEmoji = "🌧";
              break;
            case "10d":
              iconEmoji = "🌧";
              break;
            case "10n":
              iconEmoji = "🌧";
              break;
            case "11d":
              iconEmoji = "⛈";
              break;
            case "11n":
              iconEmoji = "⛈";
              break;
            case "13d":
              iconEmoji = "❄️";
              break;
            case "13n":
              iconEmoji = "❄️";
              break;
            case "50d":
              iconEmoji = "💨";
              break;
            case "50n":
              iconEmoji = "💨";
              break;
            case "arrow":
              iconEmoji = "";
              break;
            case "unknown":
              iconEmoji = "";
              break;
          }
          let backColor;
          if (
            this.props.monthCalCurrDate.getMonth() === this.todayDate.getMonth()
          ) {
            backColor = "white";
          } else {
            backColor = BACKGROUND_COLOR;
          }

          return (
            <View
              style={{
                flex: 1,
                textAlign: "center",
                width: 50,
                height: "70%",
                //backgroundColor: "blue",
                flexDirection: "column",
                alignContent: "space-between",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={[
                  {
                    flex: 0.2,
                    height: 18,
                    width: "95%",
                    flexDirection: "row",
                    backgroundColor: item != -1 ? "white" : "rgba(0,0,0,0)",
                    borderColor:
                      item != -1
                        ? isWithinStrategy
                          ? LIGHTBLUE
                          : "#D8D8D8"
                        : "rgba(0,0,0,0)",
                    borderWidth: isWithinStrategy ? 2 : 1,
                    borderRadius: 15,
                    marginTop: 2,
                    justifyContent: "center",
                    alignItems: "center",
                  },
                ]}
                disabled={item === -1 ? true : false}
                activeOpacity={0.1}
                onPress={() => this.onPress(item)}
              >
                <View
                  style={{
                    flex: 1,
                    height: "100%",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      alignSelf: "center",
                      justifyContent: "center",
                      alignContent: "center",
                      fontSize: 11.5,

                      // marginTop: "9%",

                      //backgroundColor: rowIndex == 0 ? "#ddd" : "",
                      // Highlight Sundays
                      color: colIndex == 0 ? "#000" : "#000",
                      // Highlight current date
                      fontWeight:
                        item == this.props.monthCalCurrDate.getDate()
                          ? "bold"
                          : "300",
                    }}
                  >
                    {item != -1 ? item + " " + iconEmoji : null}
                  </Text>
                </View>

                {/* <Image
                  source={{
                    uri: "http://openweathermap.org/img/wn/" + iconNum + ".png",
                  }}
                  style={{ width: 20, height: 20 }}
                ></Image> */}
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "flex-start",
                }}
              >
                <View
                  style={{
                    backgroundColor:
                      new Date(
                        this.todayDate.getFullYear(),
                        this.props.monthCalCurrDate.getMonth(),
                        item
                      ).getDay() === this.state.targetDate && item != -1
                        ? HIGHLIGHT_COLOR
                        : backColor,

                    flex: 1,
                    height: "100%",
                    width: "100%",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    borderBottomWidth: 1,
                    borderBottomColor: "#D8D8D8",
                  }}
                >
                  {/* <View
                    style={{
                      flex: 0.5,
                      width: "100%",
                      height:"100%",
                      marginHorizontal: 5,
                      backgroundColor: GREEN,
                    }}
                  > */}
                  {/* Morning events  */}
                  {flatEventListMorning.map((item) => {
                    //console.log("render flat",item);
                    let feelingEmoji = "";
                    if (item.feeling) {
                      if (item.feeling === "Positive") {
                        // feelingEmoji = "🙂";
                        feelingEmoji = "";
                      } else if (item.feeling === "Negative") {
                        // feelingEmoji = "😕";
                        feelingEmoji = "";
                      } else {
                        // feelingEmoji = "😑";
                        feelingEmoji = "";
                      }
                    }
                    if (item.isPlanned) {
                      if (item.isReported) {
                        if (item.isActivityCompleted) {
                          return (
                            //Completed planned events
                            <View
                              style={{
                                width: "100%",
                                height: 15,
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: GREEN,
                                borderRadius: 5,
                                // flex: 1,
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  fontSize: 8,
                                  fontWeight: "bold",
                                  color: "white",
                                }}
                              >
                                {item.title
                                  ? item.title + feelingEmoji
                                  : "event"}
                              </Text>
                            </View>
                          );
                        } else {
                          //partially completed activity
                          if ("isOtherActivity" in item) {
                            return (
                              //Partially completed events
                              <View
                                style={{
                                  width: "100%",
                                  backgroundColor: YELLOW,
                                  opacity: item.isOtherActivity ? 1 : 0.5,
                                  borderRadius: 5,
                                  // flex: 1,
                                  height: 15,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    fontSize: 8,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {/* {item.start} */}

                                  {item.title
                                    ? item.title + feelingEmoji
                                    : "event"}
                                </Text>
                              </View>
                            );
                          } else if (item.isPlanned === "added-activity") {
                            return (
                              <View
                                style={{
                                  width: "100%",
                                  backgroundColor: BLUE,
                                  borderRadius: 5,
                                  // flex: 1,
                                  height: 15,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    fontSize: 8,
                                    fontWeight: "bold",
                                    color: "white",
                                  }}
                                >
                                  {/* {item.start} */}
                                  {item.title
                                    ? item.title + feelingEmoji
                                    : "event"}
                                </Text>
                              </View>
                            );
                          } else {
                            return (
                              //Uncompleted events
                              <View
                                style={{
                                  width: "100%",
                                  backgroundColor: BLACK,
                                  borderRadius: 5,
                                  // flex: 1,
                                  height: 15,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    fontSize: 8,
                                    fontWeight: "bold",
                                    color: "white",
                                  }}
                                >
                                  {/* {item.start} */}
                                  {item.title
                                    ? item.title + feelingEmoji
                                    : "event"}
                                </Text>
                              </View>
                            );
                          }
                        }
                      } else {
                        //User-added unplanned events
                        //Unreported events
                        return (
                          <View
                            style={{
                              width: "100%",
                              height: 15,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white",
                              borderWidth: 1,
                              borderColor: "black",
                              borderRadius: 5,
                              // flex: 1,
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontSize: 8,
                                fontWeight: "bold",
                              }}
                            >
                              {/* {item.start} */}
                              {item.title ? item.title + feelingEmoji : "event"}
                            </Text>
                          </View>
                        );
                      }
                    } else {
                      //Other Calendar events
                      if (!("title" in item)) {
                        return (
                          <View
                            style={{
                              width: "100%",
                              height: 10,
                              backgroundColor: "grey",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 5,
                            }}
                          >
                            <Text style={{ textAlign: "center", fontSize: 5 }}>
                              {/* {item.start} */}
                              {item.title ? item.title + feelingEmoji : ""}
                            </Text>
                          </View>
                        );
                      }
                    }
                  })}
                  {/* <FlatList
                    // style={{ marginTop: 1, height: "100%", width: "100%" }}
                    data={flatEventListMorning}
                    renderItem={({ item }) => {
                      
                    }}
                  /> */}
                  {/* </View> */}
                </View>
                <View
                  style={{
                    backgroundColor:
                      new Date(
                        this.todayDate.getFullYear(),
                        this.props.monthCalCurrDate.getMonth(),
                        item
                      ).getDay() === this.state.targetDate && item != -1
                        ? HIGHLIGHT_COLOR
                        : backColor,
                    flex: 1,
                    height: "100%",
                    alignItems: "flex-end",
                    justifyContent: "flex-start",
                  }}
                >
                  {/* Afternoon Events */}
                  {flatEventListAfternoon.map((item) => {
                    //console.log("render flat",item);
                    let feelingEmoji = "";
                    if (item.feeling) {
                      if (item.feeling === "Positive") {
                        // feelingEmoji = "🙂";
                        feelingEmoji = "";
                      } else if (item.feeling === "Negative") {
                        // feelingEmoji = "😕";
                        feelingEmoji = "";
                      } else {
                        // feelingEmoji = "😑";
                        feelingEmoji = "";
                      }
                    }

                    if (item.isPlanned) {
                      if (item.isReported) {
                        if (item.isActivityCompleted) {
                          return (
                            //Completed planned events
                            <View
                              style={{
                                width: "100%",
                                backgroundColor: GREEN,
                                borderRadius: 5,
                                // flex: 1,
                                height: 15,
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Text
                                style={{
                                  textAlign: "center",
                                  fontSize: 8,
                                  fontWeight: "bold",
                                  color: "white",
                                }}
                              >
                                {/* {item.start} */}
                                {item.title
                                  ? item.title + feelingEmoji
                                  : "event"}
                              </Text>
                            </View>
                          );
                        } else {
                          if ("isOtherActivity" in item) {
                            return (
                              //Partially completed events
                              <View
                                style={{
                                  width: "100%",
                                  backgroundColor: YELLOW,
                                  height: 15,
                                  opacity: item.isOtherActivity ? 1 : 0.5,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: 5,
                                  // flex: 1,
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    fontSize: 8,
                                    fontWeight: "bold",
                                  }}
                                >
                                  {/* {item.start} */}
                                  {item.title
                                    ? item.title + feelingEmoji
                                    : "event"}
                                </Text>
                              </View>
                            );
                          } else if (item.isPlanned === "added-activity") {
                            return (
                              //User-added planned events
                              <View
                                style={{
                                  width: "100%",
                                  backgroundColor: BLUE,
                                  borderRadius: 5,
                                  // flex: 1,
                                  height: 15,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    fontSize: 8,
                                    fontWeight: "bold",
                                    color: "white",
                                  }}
                                >
                                  {/* {item.start} */}
                                  {item.title
                                    ? item.title + feelingEmoji
                                    : "event"}
                                </Text>
                              </View>
                            );
                          } else {
                            return (
                              //uncompleted events
                              <View
                                style={{
                                  width: "100%",
                                  backgroundColor: BLACK,
                                  borderRadius: 5,
                                  height: 15,
                                  alignItems: "center",
                                  justifyContent: "center",
                                  // flex: 1,
                                }}
                              >
                                <Text
                                  style={{
                                    textAlign: "center",
                                    fontSize: 8,
                                    fontWeight: "bold",
                                    color: "white",
                                  }}
                                >
                                  {/* {item.start} */}
                                  {item.title
                                    ? item.title + feelingEmoji
                                    : "event"}
                                </Text>
                              </View>
                            );
                          }
                        }
                      } else {
                        return (
                          //Unreported events
                          <View
                            style={{
                              width: "100%",
                              height: 15,
                              alignItems: "center",
                              justifyContent: "center",
                              backgroundColor: "white",
                              borderWidth: 1,
                              borderColor: "black",
                              borderRadius: 5,
                              // flex: 1,
                            }}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                fontSize: 8,
                                fontWeight: "bold",
                              }}
                            >
                              {/* {item.start} */}
                              {item.title ? item.title + feelingEmoji : "event"}
                            </Text>
                          </View>
                        );
                      }
                    } else {
                      if (!("title" in item)) {
                        return (
                          //Other calendar events
                          <View
                            style={{
                              width: "100%",
                              // height:5,
                              backgroundColor: "grey",
                              borderRadius: 5,
                              alignItems: "center",
                              justifyContent: "center",
                              height: 10,
                              // flex: 1,
                            }}
                          >
                            <Text style={{ textAlign: "center", fontSize: 5 }}>
                              {/* {item.start} */}
                              {item.title ? item.title + feelingEmoji : ""}
                            </Text>
                          </View>
                        );
                      }
                    }
                  })}
                  {/* <FlatList
                    style={{ marginTop: 1, height: "100%", width: "100%" }}
                    data={flatEventListAfternoon}
                    renderItem={({ item }) => {
                    }}
                  /> */}
                </View>
              </View>
            </View>
          );
        }
      });
      if (rowIndex === 0) {
        return (
          <View
            style={{
              flex: 0.1,
              flexDirection: "column",
              //backgroundColor: RED,
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>{rowItems}</View>
            {/* <View style={{ flexDirection: "row" }}>{additionalView}</View> */}
          </View>
        );
      } else {
        return (
          <View
            style={{
              flex: 1,
              flexDirection: "column",

              paddingTop: 0,
              marginTop: 0,
              //backgroundColor: "blue",

              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row" }}>{rowItems}</View>
            {/* <View style={{ flexDirection: "row" }}>{additionalView}</View> */}
          </View>
        );
      }
    });
    return (
      <View style={{ height: 720 }}>
        {/* <Text
          style={{
            //backgroundColor: "blue",
            fontWeight: "bold",
            fontSize: 30,
            margin: 20,
            textAlign: "left",
          }}
        >
          {this.months[this.props.monthCalCurrDate.getMonth()] + " "}
          {this.props.monthCalCurrDate.getFullYear()}
        </Text> */}
        {rows}
      </View>
    );
  }
}
