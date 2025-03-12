import React, { useState } from "react";
import {
	TextInput,
	View,
	Text,
	TouchableOpacity,
	Button,
	AppRegistry,
	ScrollView,
	KeyboardAvoidingView,
	TouchableWithoutFeedback,
	Keyboard,
	FlatList,
	Image,
	Alert,
	Platform,
} from "react-native";
import { Modal as RNModal } from "react-native";

import * as Font from "expo-font";

//Load svg files
import PlanActivities from "./assets/svg/planActivities.svg";
import SlidingUpPanelTxt from "./assets/svg/slideUpPanelTxt.svg";
import SlidingUpPanelTxt2 from "./assets/svg/slideUpPanelTxt2.svg";
import AddActivityBtn from "./assets/svg/addActivityBtn.svg";
import SummarizePlanningStrategy from "./assets/svg/Summarize.svg";
import CalendarHeader from "./assets/svg/calendarHeader.svg";
import Indicator from "./assets/svg/indicator.svg";
import Guide from "./assets/svg/Guide.svg";
import TipCalendar1 from "./assets/svg/tipCalendar1.svg";
import TipCalendar2 from "./assets/svg/tipCalendar2.svg";
import TipCalendar3 from "./assets/svg/tipCalendar3.svg";
import TipCalendar4 from "./assets/svg/tipCalendar4.svg";
import TipCalendar5 from "./assets/svg/tipCalendar5.svg";

//Load icon source
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//Load interactive component libraries
import SlidingUpPanel from "rn-sliding-up-panel";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import Popover from "react-native-popover-view";
import Modal from "react-native-modal";
import FlashMessage from "react-native-flash-message";
import {
	showMessage,
	hideMessage,
	FlashMessageManager,
} from "react-native-flash-message";
import { Calendar } from "react-native-big-calendar";

//Load layout component libraries
// import ChipsList from "react-native-expandable-chips-list";
import SelectableChips from "react-native-chip/SelectableChips";
import RemovableChips from "react-native-chip/RemovableChips";
import Onboarding from "react-native-onboarding-swiper";
import Swiper from "react-native-swiper";

//Load functional libraries
import moment, { min } from "moment";
import * as SecureStore from "expo-secure-store";

//Load from other local components
import { MonthCalendar } from "./Calendar";
import { getDataModel } from "./DataModel";
import { generalStyles } from "./styles/GeneralStyling";

// import Swiper from "react-native-swiper";

// let TEST_DATA = [
// 	"Light Exercise",
// 	"Moderate Exercise",
// 	"Intensive Exercise",
// 	"Morning",
// 	"Afternoon",
// 	"Home Workout",
// 	"Outdoor",
// 	"Gym",
// ];
let SAMPLE_KEYWORDS_DATA = [
	{ title: "Light Exercise", isSelected: false, isSample: true },
	{ title: "Moderate Exercise", isSelected: false, isSample: true },
	{ title: "Intensive Exercise", isSelected: false, isSample: true },
	{ title: "Morning", isSelected: false, isSample: true },
	{ title: "Afternoon", isSelected: false, isSample: true },
	{ title: "Home Workout", isSelected: false, isSample: true },
	{ title: "Outdoor", isSelected: false, isSample: true },
	{ title: "Gym", isSelected: false, isSample: true },
];

let TEST_DATA2 = [
	{ title: "Light Exercise", id: 1 },
	{ title: "Moderate Exercise", id: 2 },
	{ title: "Intensive Exercise", id: 3 },
	{ title: "Morning", id: 4 },
	{ title: "Afternoon", id: 5 },
	{ title: "Home Workout", id: 6 },
	{ title: "Outdoor", id: 7 },
	{ title: "Gym", id: 8 },
];

let TEST_DATA3 = [
	{ title: "Walking", date: "MON 9:30AM-9:50AM", duration: "20 MIN", id: 1 },
	{ title: "Walking", date: "MON 9:30AM-9:50AM", duration: "20 MIN", id: 2 },
	{ title: "Walking", date: "MON 9:30AM-9:50AM", duration: "20 MIN", id: 3 },
	{ title: "Walking", date: "MON 9:30AM-9:50AM", duration: "20 MIN", id: 4 },
	{ title: "Walking", date: "MON 9:30AM-9:50AM", duration: "20 MIN", id: 5 },
	{ title: "Walking", date: "MON 9:30AM-9:50AM", duration: "20 MIN", id: 6 },
];
const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ICONS = {
	"01d": "☀️",
	"01n": "🌙",
	"02d": "🌥",
	"02n": "🌥",
	"03d": "⛅️",
	"03n": "⛅️",
	"04d": "☁️",
	"04n": "☁️",
	"09d": "🌧",
	"09n": "🌧",
	"10d": "🌧",
	"10n": "🌧",
	"11d": "⛈",
	"11n": "⛈",
	"13d": "❄️",
	"13n": "❄️",
	"50d": "💨",
	"50n": "💨",
	arrow: "",
	unknown: "",
};
const GREEN = "#1AB700";
const BLACK = "#393939";
const YELLOW = "#FFB800";

export class PlanOnCalendar extends React.Component {
	constructor(props) {
		super(props);
		//Load users' basic info from BeforeLoginScreen.js
		this.userEmail = this.props.route.params.userEmail;
		this.userInfo = this.props.route.params.userInfo;
		this.userKey = this.props.route.params.userInfo.key;
		this.userPlans = this.props.route.params.userInfo.userPlans;
		this.isGuideVis = false;
		this.userStrategies = this.props.route.params.userStrategies;
		if (this.props.route.params.isGuideVis) {
			this.isGuideVis = this.props.route.params.isGuideVis;
		}
		this.currentStrategy = [];

		//Check if receive data from tracking screen
		// this.plansBuddle = [];
		this.keywordsBuddle = [];
		this.planStrategyName = "";
		this.isDataFromTracking = false;
		if (this.props.route.params.keywords) {
			this.currentStrategy = this.props.route.params.currentStrategy;
			let keywords = this.processKeywords(this.props.route.params.keywords);
			let plans = this.processEventsFromTracking(this.props.route.params.plans);
			console.log("plans====", plans);
			let title = this.props.route.params.title;

			this.isDataFromTracking = true;
			this.plansBuddle = plans;
			this.keywordsBuddle = keywords;
			this.planStrategyName = title + " ↩︎ ";
		}

		//Get data model
		this.dataModel = getDataModel();

		this.mainContentSwiperRef = React.createRef();
		this.monthCalRef = React.createRef();
		this.panelSwiperRef = React.createRef();
		this.weeklyCalendarScrollViewRef = React.createRef();
		this.tipModalSwiperRef = React.createRef();

		this.activityData = [];
		this.index;
		//Get today's date
		this.today = new Date();
		this.startTime = this.today.setHours(8, 0, 0);
		this.endTime = this.today.setHours(8, 30, 0);

		//Get event lists
		this.eventsLastMonth = this.props.route.params.eventsLastMonth;
		this.eventsThisMonth = this.props.route.params.eventsThisMonth;
		this.eventsNextMonth = this.props.route.params.eventsNextMonth;
		this.fullEventList = this.props.route.params.fullEventList;

		this.combinedEventListThis = this.eventsThisMonth;
		this.combinedEventListLast = this.eventsLastMonth;
		this.combinedEventListNext = this.eventsNextMonth;
		this.combineEventListFull = this.fullEventList;

		//Process event lists and user defined activities
		this.processUserEvents();
		this.processUserDefinedActivities();

		this.lastMonthWeather = this.props.route.params.lastMonthWeather;
		this.thisMonthWeather = this.props.route.params.thisMonthWeather;
		this.nextMonthWeather = this.props.route.params.nextMonthWeather;

		//For detailed view
		this.selectedWeatherIcon;
		this.selectedWeatherTxt;
		this.selectedTemp;
		this.selectedEventDate;
		this.detailViewCalendar = [];

		this.onReportActivity = { title: "", start: "", end: "", duration: "" };
		//initiate page index for onboarding view
		this.pageIndex = 0;
		//Assign different timestap to auto-added events
		this.timeStampCnt = 0;
		this.state = {
			date: new Date(),

			title: <PlanActivities height={28} width={150} />,
			displayTitle: "flex",

			panelHeight: 450,
			isStrategyDetailModalVis: false,
			isMonthCalendarModalVis: false,
			//Calendar event lists
			eventsLastMonth: this.combinedEventListLast,
			eventsThisMonth: this.combinedEventListThis,
			eventsNextMonth: this.combinedEventListNext,
			fullEventList: this.combineEventListFull,
			//Calendar Month states
			currentMonthEvents: this.combinedEventListThis,
			currentWeatherLists: this.thisMonthWeather,
			currentMonthDate: new Date(),
			currentMonth: "THIS_MONTH",
			pastMonthBtnDisabled: false,
			nextMonthBtnDisabled: false,
			//display the calendar view
			displayCalView: "flex",
			//Month name on calendar
			currentMonthName: moment(new Date()).format("MMMM"),
			//Data for the activity types popup window
			activityData: this.activityData,
			//check if the activity type is selected when the user hit the plan btn
			isActivityTypeSelected: false,
			//Selected activity
			selectedActivity: "",
			//Check if user selected the date
			isDateSelected: true,
			//Selected Date
			selectedDate: new Date(moment(new Date()).subtract(1, "d")),
			selectedDateRaw: new Date(),
			//Check if user selected the start time
			isStartTimeSelected: false,
			//Check if user selected the start time
			isEndTimeSelected: false,
			//The date on the date picker
			dateTimePickerDate: new Date(),
			//The date on "From"
			startTime: new Date(this.startTime),
			//The date on "To"
			endTime: new Date(this.endTime),
			//Check if user selected start time is valid
			isStartTimeValid: true,
			//Check if user selected end time is valid
			isEndTimeValid: true,
			//All the plans under this set up
			plansBuddle: [],
			//Visibility of content swiper under calendar view
			mainContentSwiperDisplay: "flex",
			//Visibility of the confirmation page
			conformationPageDisplay: "none",
			//Accumulate planning minutes,
			accumulatedMinutes: 0,
			//Keywords added from examples
			keywordsListFromExample: [],
			//Keywords added from user inout
			keywordsListFromInput: [],
			//User defined keywords:
			keywordsBuddle: this.keywordsBuddle,
			//User defined plan strategy name
			planStrategyName: this.planStrategyName,
			//Confirm page icon:
			confirmPageIcon: (
				<FontAwesome5 name="angle-double-right" size={32} color="black" />
			),
			//Confirm page title
			confirmPageTitle: "You are almost there",
			//Confirm Page confirm btn display
			confirmBtnDisplay: "flex",
			//Confirm page confirm txt display
			confirmTxtDisplay: "none",
			//Panel display
			swipeAblePanelDisplay: "flex",
			//Plan created view visibility
			thirdSlidePanelPageUpdatedDisplay: "none",
			//Event detail modal visibility
			isPlanDetailModalVis: false,
			//visibility of changing plan popup
			isChangePlanModalVis: false,
			//Fields of the activity to change,
			reportTitle: this.onReportActivity.title,
			reportStart: this.onReportActivity.start,
			reportEnd: this.onReportActivity.end,
			reportDuration: this.onReportActivity.duration,
			//Display "No activity" on the detail popup  when there is no planned activity
			isNoActivitySignVis: "none",
			//Text on report btn
			reportBtnColor: "Report",
			//Visibility of Guide btn
			isGuideVis: this.isGuideVis,
			currentGuideStep: 1,
			//Text in the bottom add btn
			bottomAddTxt: "Add Activity",
			//If bottom bar visible
			bottomBarVis: "flex",
			//If add activity modal visible
			isAddingActivityModalVis: false,
			//If add keywords modal visible
			isAddingKeywordsModalVis: false,
			//sample keywords list
			keywordsListInPanel: SAMPLE_KEYWORDS_DATA,
			//is example keywords visible
			isExampleVis: false
		};
		if (this.isDataFromTracking) {
			for (let event of this.plansBuddle) {
				let newEvent = Object.assign({}, event)
				if (!newEvent.isDeleted) {
					this.onPlanBtnPressed(newEvent);
				}
			}
		}

		// console.log("this.state.activityData", this.state.activityData);
	}
	componentDidMount() {
		this.scrollToThisWeek();
		FlashMessageManager.setDisabled(false);
		this.setState({ reportTitle: "1" });
		this.focusUnsubscribe = this.props.navigation.addListener(
			"focus",
			this.onFocus
		);
		// console.log("componentDidMount");
	}
	onFocus = async () => {
		this.scrollToThisWeek();
		this.setState({ reportTitle: "0" });
		this.setState({ reportTitle: "1" });
	};
	//Click the "Current Week" and scroll to the current week
	scrollToThisWeek = () => {
		setTimeout(() => {
			let currentRow = this.monthCalRef.current.getRowIndex();
			this.weeklyCalendarScrollViewRef.current.scrollTo({
				x: 0,
				y: (currentRow - 1) * 144,
				animated: true,
			}),
				1000;
		});
	};
	processEventsFromTracking = (prePlans) => {
		let plans = prePlans;
		for (let event of plans) {
			event.isReported = false;
			console.log("event.duration", event.duration);
		}
		let todayDate = new Date();
		for (let i = 0; i < 7; i++) {
			let datesAhead = todayDate.setDate(todayDate.getDate() + 1);
			let weekDayAhead = moment(datesAhead).day();

			for (let event of plans) {
				if (moment(event.start).day() === weekDayAhead) {
					let newStart =
						moment(datesAhead).format().slice(0, 10) + event.start.slice(10);
					let newEnd =
						moment(datesAhead).format().slice(0, 10) + event.end.slice(10);
					event.start = newStart;
					event.end = newEnd;
				}
			}
		}
		plans.sort(function (a, b) {
			return new Date(b.startDate) - new Date(a.startDate);
		});
		return plans;
	};
	processKeywords(keywords) {
		let newKeywordsList = keywords;
		for (let keyword of newKeywordsList) {
			keyword.color = "UNDEFINED";
		}
		return newKeywordsList;
	}
	processUserEvents = () => {
		for (let event of this.userPlans) {
			if (event.title && !event.isDeleted) {
				if (
					!this.combineEventListFull.includes(event) &&
					!this.combineEventListFull.some(
						(e) => e.timeStamp === event.timeStamp
					)
				) {
					this.combineEventListFull.push(event);
				}

				let monthNum = parseInt(event.end.slice(5, 7));
				let currMonth = new Date();
				if (monthNum === currMonth.getMonth() + 1) {
					if (
						!this.combinedEventListThis.includes(event) &&
						!this.combinedEventListThis.some(
							(e) => e.timeStamp === event.timeStamp
						)
					) {
						this.combinedEventListThis.push(event);
					}
				} else if (monthNum === currMonth.getMonth()) {
					if (
						!this.combinedEventListLast.includes(event) &&
						!this.combinedEventListLast.some(
							(e) => e.timeStamp === event.timeStamp
						)
					) {
						this.combinedEventListLast.push(event);
					}
				} else if (monthNum === currMonth.getMonth() + 2) {
					if (
						!this.combinedEventListNext.includes(event) &&
						!this.combinedEventListNext.some(
							(e) => e.timeStamp === event.timeStamp
						)
					) {
						this.combinedEventListNext.push(event);
					}
				}
				//let plannedEvent = Object.assign({}, event);
			}
		}
	};
	//Process user defined activities
	processUserDefinedActivities = () => {
		this.activityData = [
			{ key: 1, section: true, label: "Physical Activities" },
		];
		let activityList = this.props.route.params.userActivityList;
		//console.log("activityList", activityList);
		this.index = 1;
		for (let activity of activityList) {
			this.index++;
			let activityObj = {
				key: this.index,
				label: activity,
			};
			this.activityData.push(activityObj);
		}
	};
	//Change calendar when past month btn pressed
	pastMonthBtnPressed = async () => {
		if (this.state.currentMonth === "THIS_MONTH") {
			// console.log("past month pressed");
			await this.setState({ currentMonth: "PAST_MONTH" });
			await this.setState({
				currentMonthEvents: this.combinedEventListLast,
			});
			await this.setState({
				currentWeatherLists: this.lastMonthWeather,
			});
			// await this.setState({ pastMonthBtnDisabled: true });
			await this.setState({
				currentMonthDate: new Date(
					this.state.date.getFullYear(),
					this.state.date.getMonth() - 1,
					15
				),
			});
			await this.setState({ pastMonthBtnDisabled: true });
			await this.setState({ nextMonthBtnDisabled: false });
			await this.setState({
				currentMonthName: moment().subtract(1, "month").format("MMMM"),
			});
			this.monthCalRef.current.processEvents();
		} else if (this.state.currentMonth === "NEXT_MONTH") {
			this.resetCalendarToCurrentMonth();
		}
	};
	//Change calendar when next month btn pressed
	nextMonthBtnPressed = async () => {
		if (this.state.currentMonth === "THIS_MONTH") {
			console.log("nxt month pressed");
			await this.setState({ currentMonth: "NEXT_MONTH" });
			await this.setState({
				currentMonthEvents: this.combinedEventListNext,
			});
			await this.setState({
				currentWeatherLists: this.nextMonthWeather,
			});
			// await this.setState({ pastMonthBtnDisabled: true });
			await this.setState({
				currentMonthDate: new Date(
					this.state.date.getFullYear(),
					this.state.date.getMonth() + 1,
					15
				),
			});
			await this.setState({ nextMonthBtnDisabled: true });
			await this.setState({ pastMonthBtnDisabled: false });
			await this.setState({
				currentMonthName: moment().add(1, "month").format("MMMM"),
			});

			this.monthCalRef.current.processEvents();
		} else if (this.state.currentMonth === "PAST_MONTH") {
			this.resetCalendarToCurrentMonth();
		}
	};
	nextMonthEventPlanned = async (date) => {
		this.monthCalRef.current.processEvents();
		if (this.state.currentMonth === "THIS_MONTH") {
			console.log("nxt month pressed");
			await this.setState({ currentMonth: "NEXT_MONTH" });
			await this.setState({
				currentMonthEvents: this.combinedEventListNext,
			});
			await this.setState({
				currentWeatherLists: this.nextMonthWeather,
			});
			// await this.setState({ pastMonthBtnDisabled: true });
			if (date) {
				await this.setState({
					currentMonthDate: date,
				});
			} else {
				await this.setState({
					currentMonthDate: new Date(
						this.state.date.getFullYear(),
						this.state.date.getMonth() + 1,
						15
					),
				});
			}

			await this.setState({ nextMonthBtnDisabled: true });
			await this.setState({ pastMonthBtnDisabled: false });
			await this.setState({
				currentMonthName: moment().add(1, "month").format("MMMM"),
			});

			this.monthCalRef.current.processEvents();
		} else if (this.state.currentMonth === "PAST_MONTH") {
			this.resetCalendarToCurrentMonth();
		}
	};
	//Add new activity to user's activity list
	addNewActivityBtnPressed = async () => {
		let activityList = this.state.activityData;
		if (this.state.userDefinedActivityText) {
		}
		if (
			this.state.userDefinedActivityText === "" ||
			typeof this.state.userDefinedActivityText === "undefined"
		) {
			showMessage({
				message: "Invalid Name",
				description: "Activity name can't be empty",
				type: "warning",
				icon: "warning",
			});
			return;
		}
		this.index++;
		let newActivity = {
			key: this.index,
			label: this.state.userDefinedActivityText,
		};
		for (let activity of activityList) {
			let activityToLowerCase = activity.label.toLowerCase();
			let newActivityToLowerCase =
				this.state.userDefinedActivityText.toLowerCase();
			if (activityToLowerCase === newActivityToLowerCase) {
				showMessage({
					message: "Activity already existed",
					description: "Please add another activity instead",
					type: "warning",
					icon: "warning",
				});
				this.setState({ userDefinedActivityText: "" });
				this.textInput.clear();
				return;
			}
		}
		activityList.push(newActivity);

		await this.dataModel.updateUserActivities(
			this.userKey,
			this.state.userDefinedActivityText
		);

		showMessage({
			message: "Activity Added",
			description:
				"The new activity " +
				this.state.userDefinedActivityText +
				" has been added to the list",
			type: "success",
			icon: "success",
		});
		await this.setState({ userDefinedActivityText: "" });
		this.textInput.clear();
	};
	//reset calendar to current month
	resetCalendarToCurrentMonth = async () => {
		await this.setState({ currentMonth: "THIS_MONTH" });
		await this.setState({
			currentMonthEvents: this.combinedEventListThis,
		});
		await this.setState({
			currentWeatherLists: this.thisMonthWeather,
		});
		await this.setState({
			currentMonthDate: new Date(),
		});
		await this.setState({ nextMonthBtnDisabled: false });
		await this.setState({ pastMonthBtnDisabled: false });
		await this.setState({ currentMonthName: moment().format("MMMM") });

		this.monthCalRef.current.processEvents();
	};
	//Validate the date user selected
	pickTheDate = async (date) => {
		let selectedDay = new Date(moment(date).format("YYYY-MM-DD"));

		let today = new Date(moment(new Date()).format("YYYY-MM-DD"));

		let endDay = new Date(moment(today).add(7, "days"));

		let startDate = moment(new Date()).format().slice(0, 10);
		let endDate = moment(new Date()).add(7, "days").format().slice(0, 10);
		console.log("startDate", startDate);
		console.log("endDate", endDate);
		// let formattedThisMonth = parseInt(moment(new Date()).format().slice(5,7));
		// let formattedSelectedMonth = parseInt(moment(this.state.selectedDateRaw).format().slice(5,7));
		// // console.log("selected Date", date);
		// // console.log("formattedThisMonth", formattedThisMonth);
		// // console.log("formattedSelectedMonth", formattedSelectedMonth);

		if (selectedDay >= today && selectedDay < endDay) {
			await this.setState({ selectedDateRaw: date });
			await this.setState({ selectedDate: selectedDay });
			await this.setState({ isDateSelected: true });
			showMessage({
				message: "Date Selected",
				description:
					"The activity will be planned on " +
					moment(date).format("YYYY-MM-DD"),
				type: "success",
				icon: "success",
			});
		} else {
			showMessage({
				message: "Invalid Date",
				description: "Please select a date in the next 7 days",
				type: "warning",
				icon: "warning",
			});
			Alert.alert("Invalid Date", "Please reselect a valid date", [
				{ text: "OK", onPress: () => console.log("OK Pressed") },
			]);
			return;
		}
	};
	//Validate the start time user selected
	pickStartTime = async (date) => {
		this.setState({ isStartTimeSelected: true });
		await this.setState({ endTime: date });

		// await this.dateTimeFilter(date);
		console.log("date", date);
		if (date < this.state.endTime) {
			await this.setState({ startTime: date });

			let formattedStart = moment(this.state.startTime).format();
			await this.setState({ reportStart: formattedStart });

			await this.setState({ isStartTimeValid: true });
			await this.setState({ isEndTimeValid: true });
			showMessage({
				message: "Start Time Confirmed",
				description:
					"The activity will start from " +
					moment(this.state.startTime).format("HH:mm"),
				type: "success",
				icon: "success",
			});
		} else {
			await this.setState({ startTime: date });
			let formattedStart = moment(this.state.startTime).format();
			await this.setState({ reportStart: formattedStart });
			await this.setState({ isStartTimeValid: false });
			showMessage({
				message: "Invalid Time",
				description: "The start time must come before the end time",
				type: "warning",
				icon: "warning",
			});
		}
		console.log("this.state.endTime", this.state.endTime);
	};
	//Validate the end time user selected
	pickEndTime = async (date) => {
		// this.setState({ isTimeSelected: true });
		// await this.dateTimeFilter(date);
		// await this.setState({startTime:date});
		// console.log("end time", date);
		this.setState({ isEndTimeSelected: true });
		if (date > this.state.startTime) {
			await this.setState({ endTime: date });
			await this.setState({ isStartTimeValid: true });
			await this.setState({ isEndTimeValid: true });

			let formattedEnd = moment(this.state.endTime).format();
			await this.setState({ reportEnd: formattedEnd });

			showMessage({
				message: "End Time Confirmed",
				description:
					"The activity will end at " +
					moment(this.state.endTime).format("HH:mm"),
				type: "success",
				icon: "success",
			});
		} else {
			await this.setState({ endTime: date });
			let formattedEnd = moment(this.state.endTime).format();
			await this.setState({ reportEnd: formattedEnd });
			await this.setState({ isEndTimeValid: false });
			showMessage({
				message: "Invalid Time",
				description: "The end time must come after the start time",
				type: "warning",
				icon: "warning",
			});
		}
		// console.log("this.state.startTime",this.state.startTime);
	};
	//Plan the activity and show it on the calendar and the list view, update the new activity on Firebase
	onPlanBtnPressed = async (preEvent) => {
		// if (!(this.state.isStartTimeSelected && this.state.isEndTimeSelected)) {
		//   showMessage({
		//     message: "Please specify the time",
		//     description: "You didn't pick the start or the end time",
		//     type: "warning",
		//     icon: "warning",
		//   });
		//   return;
		// }
		if (!this.isDataFromTracking) {
			if (!this.state.isDateSelected) {
				showMessage({
					message: "Please specify the date",
					description: "The date field is empty",
					type: "warning",
					icon: "warning",
				});
				return;
			}
			if (!this.state.isActivityTypeSelected) {
				showMessage({
					message: "Please specify the activity first",
					description: "The activity type field is empty",
					type: "warning",
					icon: "warning",
				});
				return;
			}
			if (!(this.state.isEndTimeValid && this.state.isStartTimeValid)) {
				showMessage({
					message: "Time range is not valid",
					description: "Please reset the time range",
					type: "warning",
					icon: "warning",
				});
				return;
			}
			this.setState({ isAddingActivityModalVis: false });
		}

		let selectedDate = this.state.selectedDate;
		// console.log("selectedDate on pressed",selectedDate);
		// let isPlanDuplicated = false;
		// for (let event of this.userPlans) {
		//   if (event.title && event.isDeleted === false) {
		//     let eventDate = new Date(event.start);
		//     if (
		//       eventDate.getMonth() === selectedDate.getMonth() &&
		//       eventDate.getDate() === selectedDate.getDate() + 1
		//     ) {
		//       console.log(
		//         "eventDate.getDate(), selectedDate.getDate()",
		//         eventDate.getDate(),
		//         selectedDate.getDate()
		//       );
		//       console.log("isPlanDuplicated: event.title", event);
		//       isPlanDuplicated = true;
		//     }
		//   }
		// }
		// if (isPlanDuplicated) {
		//   showMessage({
		//     message: "Please pick another day",
		//     description: "Can't plan two activities on the same day",
		//     type: "warning",
		//     icon: "warning",
		//   });
		//   return;
		// }
		let startTimeMinutes = moment(this.state.startTime).format("HH:mm:ss");
		let endTimeMinutes = moment(this.state.endTime).format("HH:mm:ss");
		console.log("selectedDate on pressed", selectedDate);
		let formattedDate = moment(selectedDate)
			.add(1, "days")
			.format()
			.slice(0, 11);
		console.log("formattedDate on pressed", formattedDate);
		let formattedStartTime = formattedDate + startTimeMinutes;
		let formattedEndTime = formattedDate + endTimeMinutes;
		let activityName = this.state.selectedActivity;

		let newEvent = {
			start: formattedStartTime,
			end: formattedEndTime,
			id: formattedStartTime + formattedEndTime,
			isPlanned: "planned",
			isReported: false,
			isCompleted: false,
			isDeleted: false,
			color: "white",
			title: activityName,
		};
		// console.log("preEvent", preEvent);
		if (preEvent) {
			newEvent = preEvent;
		}

		let timeStamp = moment(new Date()).format();
		newEvent.timeStamp = timeStamp + this.timeStampCnt;
		this.timeStampCnt++;
		if (preEvent) {
			newEvent.key = timeStamp + preEvent.key;
		} else {
			newEvent.key = timeStamp;
		}

		// console.log("newEvent", newEvent);
		let weatherList = [];
		// console.log("moment.getMonth(selectedDate)",moment(selectedDate).month());
		// console.log("moment.getMonth(new Date())",moment(new Date()).month());
		if (moment(selectedDate).month() === moment(new Date()).month()) {
			weatherList = this.thisMonthWeather;
		} else {
			weatherList = this.nextMonthWeather;
		}
		// console.log("Date num", moment(selectedDate).date());
		for (let weather of weatherList) {
			// console.log("weather",weather);
			if (weather.date === moment(selectedDate).date()) {
				newEvent.weather = weather.text;
				newEvent.temp = weather.temp;
			}
		}
		// console.log("new event", newEvent);

		let duration = moment.duration(
			moment(formattedEndTime).diff(moment(formattedStartTime))
		);
		// console.log("duration", duration);
		let durationMinutes;
		if (preEvent) {
			newEvent.duration = preEvent.duration;
			durationMinutes = preEvent.duration;
		} else {
			durationMinutes = parseInt(duration.asMinutes());
			console.log("durationMinutes",durationMinutes);
			newEvent.duration = durationMinutes;
		}
		try {
			newEvent.activityReminderKey = await this.dataModel.scheduleNotification(
				newEvent
			);
		} catch (e) {
			Alert.alert("Invalid Time", "Please reselect a valid time", [
				{ text: "OK", onPress: () => console.log("OK Pressed") },
			]);
			return;
		}

		newEvent.reportReminderKey =
			await this.dataModel.scheduleReportNotification(newEvent);
		// console.log("moment(selectedDate).month()", moment(selectedDate).month());
		// console.log("moment(new Date()).month()",moment(new Date()).month());

		let formattedThisMonth = parseInt(moment(new Date()).format().slice(5, 7));
		let formattedSelectedMonth = parseInt(
			moment(newEvent.start).format().slice(5, 7)
		);
		if (formattedSelectedMonth === formattedThisMonth) {
			this.combinedEventListThis.push(newEvent);
			await this.resetCalendarToCurrentMonth();
			await this.setState({
				currentMonthDate: this.state.selectedDateRaw,
			});
			this.scrollToThisWeek();
		} else {
			this.combinedEventListNext.push(newEvent);
			await this.nextMonthEventPlanned(this.state.selectedDateRaw);
			this.scrollToThisWeek();
		}

		let updatedPlanBundle = this.state.plansBuddle;
		updatedPlanBundle.push(newEvent);

		let currentMinutes = this.state.accumulatedMinutes;
		let updatedMinutes = currentMinutes + durationMinutes;
		this.setState({ accumulatedMinutes: updatedMinutes });

		await this.setState({ plansBuddle: updatedPlanBundle });
		// console.log(this.state.plansBuddle);

		showMessage({
			message: "Activity Planned!",
			description: activityName + " planned on " + formattedDate.slice(0, 10),
			type: "success",
			icon: "success",
		});

		// await this.dataModel.createNewPlan(this.userKey, newEvent);
		// await this.dataModel.loadUserPlans(this.userKey);
		// this.userPlans = this.dataModel.getUserPlans();

		// console.log("date",date);
	};
	//Delete the selected activity and update it on Firebase
	deleteActivity = async (selectedActivity) => {
		// console.log("this.state.plansBuddle on delete",this.state.plansBuddle);
		// let deleteIndexInPlansBuddle;
		for (let event of this.state.plansBuddle) {
			if (event.key === selectedActivity.key) {
				// deleteIndexInPlansBuddle = this.state.plansBuddle.indexOf(event);
				event.isDeleted = true;
			}
		}
		// console.log("deleteIndexInPlansBuddle",deleteIndexInPlansBuddle);
		// let currentPlansBuddle = this.state.plansBuddle;
		let updatedPlansBuddle = this.state.plansBuddle;
		// updatedPlansBuddle.splice(deleteIndexInPlansBuddle, 1);
		// updatedPlansBuddle.splice(deleteIndexInPlansBuddle,1);
		// console.log("updatedPlansBuddle",updatedPlansBuddle);
		await this.setState({ plansBuddle: updatedPlansBuddle });
		// console.log("this.state.plansBuddle",this.state.plansBuddle);

		let currentMinutes = this.state.accumulatedMinutes;
		let updatedMinutes = currentMinutes - selectedActivity.duration;
		this.setState({ accumulatedMinutes: updatedMinutes });

		selectedActivity.isDeleted = true;

		for (let event of this.userPlans) {
			if (event.key === selectedActivity.key) {
				selectedActivity.key = event.key;
				event.isDeleted = true;
			}
		}
		// console.log("this.userPlans after delete 1",this.userPlans);
		// await this.dataModel.updatePlan(this.userKey, selectedActivity);
		await this.dataModel.deleteReminders(selectedActivity);
		let monthNum = parseInt(selectedActivity.start.slice(5, 7));

		if (monthNum === this.state.date.getMonth() + 1) {
			let deleteIndex;
			//let deleteItem;
			for (let event of this.combinedEventListThis) {
				if (event.key === selectedActivity.key) {
					deleteIndex = this.combinedEventListThis.indexOf(event);
				}
			}
			this.combinedEventListThis.splice(deleteIndex, 1);
			await this.setState({ eventsThisMonth: this.combinedEventListThis });
		} else if (monthNum === this.state.date.getMonth() + 2) {
			let deleteIndex;
			for (let event of this.combinedEventListNext) {
				if (event.key === selectedActivity.key) {
					deleteIndex = this.combinedEventListNext.indexOf(event);
				}
			}
			this.combinedEventListNext.splice(deleteIndex, 1);
			await this.setState({ eventsNextMonth: this.combinedEventListNext });
		}
		let formattedThisMonth = parseInt(moment(new Date()).format().slice(5, 7));
		let formattedSelectedMonth = parseInt(
			moment(this.state.selectedDateRaw).format().slice(5, 7)
		);
		if (formattedThisMonth === formattedSelectedMonth) {
			this.resetCalendarToCurrentMonth();
		} else {
			await this.nextMonthEventPlanned();
		}
		await this.dataModel.loadUserPlans(this.userKey);
		this.userPlans = this.dataModel.getUserPlans();
		showMessage({
			message: "Activity Deleted!",
			description: selectedActivity.title + " has been deleted",
			type: "success",
			icon: "success",
		});
		// console.log("this.userPlans after delete 2",this.userPlans);
	};


	//Add user defined keywords to the list
	addKeywords = () => {
		let newKeywordsRow = this.state.userDefinedKeywords;
		if (newKeywordsRow) {
			if (newKeywordsRow.trim() === "") {
				showMessage({
					message: "Invalid Name",
					description: "keywords name can't be empty",
					type: "warning",
					icon: "warning",
				});
				return;
			}
			let newKeywords = { title: newKeywordsRow, isSelected: true };
			this.KeyWordTextInput.clear();
			this.setState({ userDefinedKeywords: "" });
			let updatedKeywordsListFromInput = this.state.keywordsListInPanel;
			for (let keywords of updatedKeywordsListFromInput) {
				if (keywords.title.toLowerCase() === newKeywords.title.toLowerCase()) {
					showMessage({
						message: "Invalid Name",
						description: "keywords already exists",
						type: "warning",
						icon: "warning",
					});
					return;
				}
			}

			updatedKeywordsListFromInput.push(newKeywords);
			this.setState({ keywordsListInPanel: updatedKeywordsListFromInput });

			// let updatedKeywordsBuddle = [];
			// for (let keywords of this.state.keywordsListFromExample) {
			// 	updatedKeywordsBuddle.push(keywords);
			// }
			// for (let keywords of updatedKeywordsListFromInput) {
			// 	updatedKeywordsBuddle.push(keywords);
			// }
			// this.setState({ keywordsBuddle: updatedKeywordsBuddle });
			showMessage({
				message: "Added keywords",
				description: newKeywords.title + " added to keywords",
				type: "success",
				icon: "success",
			});
		} else {
			showMessage({
				message: "Invalid Name",
				description: "keywords name can't be empty",
				type: "warning",
				icon: "warning",
			});
			return;
		}
	};
	// addKeywords = () => {
	// 	let newKeywordsRow = this.state.userDefinedKeywords;
	// 	if (newKeywordsRow) {
	// 		if (newKeywordsRow.trim() === "") {
	// 			showMessage({
	// 				message: "Invalid Name",
	// 				description: "keywords name can't be empty",
	// 				type: "warning",
	// 				icon: "warning",
	// 			});
	// 			return;
	// 		}
	// 		let newKeywords = { title: newKeywordsRow, type: "USER_DEFINED" };
	// 		this.KeyWordTextInput.clear();
	// 		this.setState({ userDefinedKeywords: "" });
	// 		let updatedKeywordsListFromInput = this.state.keywordsListFromInput;
	// 		for (let keywords of updatedKeywordsListFromInput) {
	// 			if (keywords.title.toLowerCase() === newKeywords.title.toLowerCase()) {
	// 				showMessage({
	// 					message: "Invalid Name",
	// 					description: "keywords already exists",
	// 					type: "warning",
	// 					icon: "warning",
	// 				});
	// 				return;
	// 			}
	// 		}
	// 		setTimeout(() => {
	// 			this.setState({ isAddingKeywordsModalVis: false });
	// 		});
	// 		updatedKeywordsListFromInput.push(newKeywords);
	// 		this.setState({ keywordsListFromInput: updatedKeywordsListFromInput });

	// 		let updatedKeywordsBuddle = [];
	// 		for (let keywords of this.state.keywordsListFromExample) {
	// 			updatedKeywordsBuddle.push(keywords);
	// 		}
	// 		for (let keywords of updatedKeywordsListFromInput) {
	// 			updatedKeywordsBuddle.push(keywords);
	// 		}
	// 		this.setState({ keywordsBuddle: updatedKeywordsBuddle });
	// 		showMessage({
	// 			message: "Added keywords",
	// 			description: newKeywords.title + " added to keywords",
	// 			type: "success",
	// 			icon: "success",
	// 		});
	// 	} else {
	// 		showMessage({
	// 			message: "Invalid Name",
	// 			description: "keywords name can't be empty",
	// 			type: "warning",
	// 			icon: "warning",
	// 		});
	// 		return;
	// 	}
	// };
	//Delete user defined keywords
	deleteKeywords = (item) => {
		console.log("delete",item);
		let updatedKeywordsListInPanel = this.state.keywordsListInPanel;
		for (let keyword of updatedKeywordsListInPanel) {
			if (item.title === keyword.title) {
				keyword.isSelected = false
			}
		}
		this.setState({ keywordsListInPanel: updatedKeywordsListInPanel});
		let updatedKeywordsBuddle = this.state.keywordsBuddle;
		let deleteIndex;
		for (let keyword of updatedKeywordsBuddle) {
			if (item.title === keyword.title) {
				deleteIndex = updatedKeywordsBuddle.indexOf(keyword);
			}
		}
		updatedKeywordsBuddle.splice(deleteIndex, 1);
		this.setState({ keywordsBuddle: updatedKeywordsBuddle});

	};
	// deleteKeywords = (item) => {
	// 	let deleteIndex;
	// 	for (let keywords of this.state.keywordsListFromInput) {
	// 		if (keywords.title === item.title) {
	// 			deleteIndex = this.state.keywordsListFromInput.indexOf(keywords);
	// 		}
	// 	}
	// 	let updatedKeywordsListFromInput = this.state.keywordsListFromInput;
	// 	updatedKeywordsListFromInput.splice(deleteIndex, 1);
	// 	this.setState({
	// 		keywordsListFromInput: updatedKeywordsListFromInput,
	// 	});

	// 	let updatedKeywordsBuddle = [];
	// 	for (let keywords of this.state.keywordsListFromInput) {
	// 		updatedKeywordsBuddle.push(keywords);
	// 	}
	// 	for (let keywords of this.state.keywordsListFromExample) {
	// 		updatedKeywordsBuddle.push(keywords);
	// 	}
	// 	this.setState({
	// 		keywordsBuddle: updatedKeywordsBuddle,
	// 	});
	// };
	//Modify keywords selected from examples
	onChangeChips = (chips) => {
		console.log("chips", chips);
		let updatedKeywordsListFromExample = [];
		let updatedKeywordsBuddle = [];
		for (let keywords of this.state.keywordsListFromInput) {
			updatedKeywordsBuddle.push(keywords);
		}
		for (let keywords of chips) {
			let keywordsObj = { title: keywords, type: "EXAMPLE" };
			updatedKeywordsBuddle.push(keywordsObj);
			updatedKeywordsListFromExample.push(keywordsObj);
		}
		this.setState({ keywordsBuddle: updatedKeywordsBuddle });
		this.setState({
			keywordsListFromExample: updatedKeywordsListFromExample,
		});
	};
	//Fired when user presses the back btn on the last page
	onBackBtnPressed = () => {
		// this.setState({
		//   confirmPageIcon: (
		//     <FontAwesome5
		//       name="angle-double-right"
		//       size={32}
		//       color="black"
		//     />
		//   ),
		// });
		// this.setState({ confirmPageTitle: "You are almost there!" });
		// this.setState({ confirmBtnDisplay: "flex" });
		// this.setState({ confirmTxtDisplay: "none" });
		// this.setState({ swipeAblePanelDisplay: "flex" });
		// this.setState({ thirdSlidePanelPageUpdatedDisplay: "none" });

		this.setState({ mainContentSwiperDisplay: "flex" });
		this.setState({ conformationPageDisplay: "none" });
		this.mainContentSwiperRef.current.goToPage(1, true);
		this.setState({ panelHeight: 450 });
		// this._panel.hide();
		this.setState({ displayCalView: "flex" });
		this.setState({ displayTitle: "flex" });
		this.setState({
			title: <SummarizePlanningStrategy height={28} width={119} />,
		});
		this.setState({ bottomBarVis: "flex" });
		// this.panelSwiperRef.current.goToPage(1, true);
	};
	//Fired when user presses the confirm btn on the last page
	onConfirmBtnPressed = async () => {
		if (this.state.planStrategyName === "") {
			showMessage({
				message: "Invalid Name",
				description: "plan strategy name can't be empty",
				type: "warning",
				icon: "warning",
			});
			return;
		}

		this.setState({
			confirmPageIcon: <Feather name="check-circle" size={32} color="black" />,
		});
		this.setState({ confirmPageTitle: "You are all set!" });
		this.setState({ confirmBtnDisplay: "none" });
		this.setState({ confirmTxtDisplay: "flex" });
		this.setState({ swipeAblePanelDisplay: "none" });
		this.setState({ thirdSlidePanelPageUpdatedDisplay: "flex" });

		let duration =
			moment(new Date()).format("MMM Do YY") +
			" " +
			moment(new Date()).add(7, "days").format("MMM Do YY");

		let startDate = moment(new Date()).format().slice(0, 10);
		let endDate = moment(new Date()).add(7, "days").format().slice(0, 10);

		let timeStamp = moment(new Date()).format();

		let newStrategy = {
			title: this.state.planStrategyName,
			duration: duration,
			startDate: startDate,
			endDate: moment(new Date()).add(6, "days").format().slice(0, 10),
			keywords: this.state.keywordsBuddle,
			plans: this.state.plansBuddle,
			timeStamp: timeStamp,
			isReported: false,
		};

		for (let event of this.state.plansBuddle) {
			await this.dataModel.createNewPlan(this.userKey, event);
		}
		await this.dataModel.loadUserPlans(this.userKey);
		this.userPlans = this.dataModel.getUserPlans();

		await this.dataModel.addToUserDefinedPlanStrategyList(
			this.userKey,
			newStrategy
		);

		this.dataModel.createDailyNotifications();

		SecureStore.setItemAsync("START_DATE", startDate);
		// console.log("save START_DATE");
		SecureStore.setItemAsync("END_DATE", endDate);
		// console.log("save END_DATE");
		SecureStore.setItemAsync("TIME_STAMP", timeStamp);
		// console.log("save TIME_STAMP");
		SecureStore.setItemAsync(
			"thisMonthWeather",
			JSON.stringify(this.thisMonthWeather)
		);
		// console.log("save thisMonthWeather");
		SecureStore.setItemAsync(
			"lastMonthWeather",
			JSON.stringify(this.lastMonthWeather)
		);
		// console.log("save lastMonthWeather");
		SecureStore.setItemAsync(
			"nextMonthWeather",
			JSON.stringify(this.nextMonthWeather)
		);
		await this.dataModel.createReviewReminderNotification(
			this.state.planStrategyName
		);
		// console.log("save nextMonthWeather");
		// SecureStore.setItemAsync("END_DATE", endDate);
	};
	onStartPressed = async () => {
		await this.dataModel.loadUserStrategies(this.userKey);
		this.userStrategies = this.dataModel.getUserStrategies();

		await this.dataModel.loadUserPlans(this.userKey);
		this.userInfo.userPlans = this.dataModel.getUserPlans();
		// for (let event of this.userInfo.userPlans) {
		//   if (event.start.slice(0,10) === "2022-08-22") {
		//     console.log("found planned event");
		//   }
		// }

		// console.log("this.userStrategies",this.userStrategies);
		this.props.navigation.navigate("BeforeLoginScreen", {
			userEmail: this.userEmail,
			userInfo: this.userInfo,
			userStrategies: this.userStrategies,
			eventsLastMonth: this.eventsLastMonth,
			eventsThisMonth: this.eventsThisMonth,
			eventsNextMonth: this.eventsNextMonth,
			fullEventList: this.fullEventList,
			lastMonthWeather: this.lastMonthWeather,
			thisMonthWeather: this.thisMonthWeather,
			nextMonthWeather: this.nextMonthWeather,
			userActivityList: this.props.route.params.userActivityList,
			isFromPlanSetUp: true,
			isGuideVis: this.isGuideVis,
			isEvaluationDate: false,
			isFromLogin: false,
		});
		// this.props.navigation.navigate("BeforeLoginScreen", {
		//   // userEmail: this.userEmail,
		// });
	};
	onPress = (item, monthNum, month) => {
		if (this.monthCalRef?.current) {
			this.monthCalRef.current.onPress(item, monthNum, month);
		}
		this.isReportFromPopup = true;
		this.setState({ isDetailViewActivityInfoListVis: "flex" });
		this.setState({ isNoActivitySignVis: "none" });
		console.log("item, monthNum, month", item, monthNum, month);
		let today = new Date();
		let weatherList = [];
		let detailViewCalendar = [];
		let selectedEventDate = new Date(this.today.getFullYear(), monthNum, item);
		if (selectedEventDate > today) {
			this.setState({ reportBtnColor: "grey" });
		} else {
			this.setState({ reportBtnColor: "black" });
		}
		this.selectedEventDate = selectedEventDate;
		let formattedSelectedEventDate = moment(selectedEventDate)
			.format()
			.slice(0, 10);

		if (monthNum === today.getMonth()) {
			weatherList = this.thisMonthWeather;
			// console.log("this.combinedEventListThis",this.combinedEventListThis);
			for (let event of this.combinedEventListThis) {
				if (
					event.start &&
					event.timeStamp &&
					event.start.slice(0, 10) === formattedSelectedEventDate
				) {
					detailViewCalendar.push(event);
				}
			}
		} else if (monthNum < today.getMonth()) {
			weatherList = this.lastMonthWeather;
			for (let event of this.combinedEventListLast) {
				if (
					event.start &&
					event.timeStamp &&
					event.start.slice(0, 10) === formattedSelectedEventDate
				) {
					detailViewCalendar.push(event);
				}
			}
		} else {
			weatherList = this.nextMonthWeather;
			for (let event of this.combinedEventListNext) {
				if (
					event.start &&
					event.timeStamp &&
					event.start.slice(0, 10) === formattedSelectedEventDate
				) {
					detailViewCalendar.push(event);
				}
			}
		}
		for (let weather of weatherList) {
			if (weather.date === item) {
				this.selectedWeatherIcon = weather.img;
				this.selectedTemp = weather.temp;
				this.selectedWeatherTxt = weather.text;
			}
		}

		// console.log(formattedSelectedEventDate);

		this.detailViewCalendar = detailViewCalendar;
		this.setState({ isPlanDetailModalVis: true });
		let cnt = 0;
		for (let event of this.detailViewCalendar) {
			if (event.title && event.isPlanned != "added-activity") {
				cnt++;
			}
		}
		if (cnt === 0) {
			this.setState({ isDetailViewActivityInfoListVis: "none" });
			this.setState({ isNoActivitySignVis: "flex" });
		}
		console.log("detailViewCalendar", detailViewCalendar);
	};
	//Styling for records
	itemCompletedBlockStyle = (item, timing) => {
		return (
			<View
				style={[
					{
						width: "100%",
						height: 60,
						borderRadius: 15,
						borderColor: "#F0F0F0",
						borderWidth: 0,
						paddingHorizontal: 18,
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "space-between",
						marginTop: this.state.isPlanDetailModalVis ? 20 : 15,
						backgroundColor: GREEN,
						paddingVertical: 0,
					},
				]}>
				<View
					style={{
						position: "absolute",
						left: 5,
						height: 50,
						marginVertical: 5,
						width: 24,
						backgroundColor: "white",
						borderRadius: 24,
						paddingVertical: 6,
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<Text style={{ color: GREEN, textAlign: "center", fontSize: 14 }}>
						♥︎
					</Text>
					<Text style={{ fontFamily: "RobotoBoldBold", color: GREEN }}>
						{item.satisfactionScore}
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginTop: 10,
						justifyContent: "flex-start",
						width: "100%",
					}}>
					<Text
						ellipsizeMode="tail"
						numberOfLines={1}
						style={{
							fontFamily: "RobotoBoldBold",
							fontSize: 14,
							paddingLeft: 18,
							color: "white",
							width: "100%",
						}}>
						{item.title}
					</Text>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: "white",
						}}></Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						marginBottom: 10,
					}}>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: "white",
							paddingLeft: 18,
							width: "100%",
						}}>
						{moment(item.start).format().slice(5, 10)} {"| "}
						{timing}
					</Text>
				</View>
			</View>
		);
	};
	itemUnCompletedBlockStyle = (item, timing) => {
		return (
			<View
				style={[
					{
						width: "100%",
						height: 60,
						borderRadius: 15,
						borderColor: "#F0F0F0",
						borderWidth: 0,
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "space-between",
						marginTop: 15,
						backgroundColor: BLACK,
						// paddingVertical: 10,
					},
				]}>
				<View
					style={{
						// marginTop:10,
						flexDirection: "row",
						width: "100%",
						height: 32,
						// paddingHorizontal: 25,
						// backgroundColor:"red",
						justifyContent: "center",
						alignItems: "center",
					}}>
					{/* <View style={{ position: "absolute", left: 5, height:24, width:24, backgroundColor:"white", borderRadius:24, justifyContent:"center", alignItems:"center" }}>
				<Text style={{fontFamily:"RobotoBoldBold"}}>{item.satisfactionScore}</Text>
			  </View> */}
					<Text
						ellipsizeMode="tail"
						numberOfLines={1}
						style={{
							fontFamily: "RobotoBoldBold",
							fontSize: 14,
							paddingLeft: 25,
							color: "white",
							width: 100,
						}}>
						{item.title}
					</Text>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: "white",
						}}>
						{moment(item.start).format().slice(5, 10)} {"| "}
					</Text>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: "white",
						}}>
						{timing}
					</Text>
				</View>
				<View
					style={{
						justifyContent: "flex-start",
						flexDirection: "row",
						backgroundColor: "white",
						borderColor: BLACK,
						alignItems: "center",
						flex: 1,
						borderBottomLeftRadius: 15,
						borderBottomRightRadius: 15,
						borderWidth: 2,
					}}>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							textAlignVertical: "center",
							color: "white",
							flex: 1,
							marginLeft: 35,
							color: BLACK,
						}}>
						{item.reason}
					</Text>
				</View>
			</View>
		);
	};
	itemUnreportedBlockStyle = (item, timing) => {
		let itemUnreportedBlockStyle = (
			<View
				style={[
					{
						width: "100%",
						height: 60,
						borderRadius: 15,
						borderColor: "black",
						borderWidth: 2,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						marginTop: 15,
						backgroundColor: "white",
						// flexDirection: "column",
					},
				]}>
				<View
					style={{
						flexDirection: "column",
						justifyContent: "space-between",
						width: "80%",
						paddingVertical: 0,
						paddingHorizontal: 6,
						height: "70%",
					}}>
					<Text
						style={{
							fontFamily: "RobotoBoldBold",
							fontSize: 14,
							paddingLeft: 8,
							color: "black",
						}}>
						{item.title}
						{" | "}
						<Text
							style={{
								fontFamily: "RobotoRegular",
								fontSize: 14,
							}}>
							{moment(item.start).format().slice(5, 10)}
						</Text>
					</Text>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							width: "100%",
							paddingLeft: 8,
						}}>
						{timing}
					</Text>
				</View>
				<TouchableOpacity
					style={{
						borderBottomRightRadius: 12,
						borderTopRightRadius: 12,
						borderWidth: 3,
						height: "100%",
						backgroundColor: "grey",
						borderColor: this.state.reportBtnColor,
						justifyContent: "center",
						alignItems: "center",
					}}
					disabled={true}
					onPress={() => {
						// item.isReported = true;
						// console.log(
						//   "this.state.plansBuddle",
						//   this.state.plansBuddle
						// );

						setTimeout(() => {
							this.onMyActivityReportPressed(item), 1000;
						});
						this.setState({ isPlanDetailModalVis: false });
					}}>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: "white",
							paddingHorizontal: 10,
							alignSelf: "center",
							backgroundColor: this.state.reportBtnColor,
						}}>
						Report
					</Text>
				</TouchableOpacity>
			</View>
		);
		return itemUnreportedBlockStyle;
	};
	itemPartialCompleteStyle_TIME = (item, timing, newTiming) => {
		let itemPartialCompleteStyle_TIME = (
			<View
				style={[
					{
						width: "100%",
						height: 85,
						borderRadius: 15,
						borderColor: "#F0F0F0",
						borderWidth: 0,
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "space-between",
						marginTop: this.state.isPlanDetailModalVis ? 7 : 15,
						backgroundColor: YELLOW,
						paddingVertical: 0,
					},
				]}>
				<View
					style={{
						position: "absolute",
						left: 5,
						top: 0,
						height: 45,
						marginVertical: 5,
						width: 24,
						backgroundColor: "white",
						borderRadius: 24,
						paddingVertical: 6,
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<Text style={{ color: YELLOW, textAlign: "center", fontSize: 14 }}>
						♥︎
					</Text>
					<Text style={{ fontFamily: "RobotoBoldBold", color: YELLOW }}>
						{item.satisfactionScore}
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						paddingHorizontal: 20,
						justifyContent: "flex-start",
						alignItems: "center",
						marginTop: 10,
					}}>
					{/* <View
				style={{
				  position: "absolute",
				  left: 5,
				  height: 24,
				  width: 24,
				  backgroundColor: "white",
				  borderRadius: 24,
				  justifyContent: "center",
				  alignItems: "center",
				}}
			  >
				<Text style={{ fontFamily: "RobotoBoldBold" }}>
				  {item.satisfactionScore}
				</Text>
			  </View> */}
					<Text
						ellipsizeMode="tail"
						numberOfLines={1}
						style={{
							fontFamily: "RobotoBoldBold",
							fontSize: 14,
							paddingLeft: 18,
							color: "white",
							marginRight: 10,
							// width: 100,
						}}>
						{item.title}
					</Text>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: "white",
						}}>
						{moment(item.start).format().slice(5, 10)} {"|"}{" "}
						{moment(item.start).format("ddd").toUpperCase()}
					</Text>
				</View>
				<View
					style={{
						justifyContent: "flex-start",
						flexDirection: "row",
						// backgroundColor:"white",
						borderRadius: 20,
						marginTop: 2,
						marginRight: 5,
						marginLeft: 28,
						// borderColor: "white",
						alignItems: "center",
						flex: 1,
					}}>
					<Text
						style={{
							fontFamily: "RobotoBoldBold",
							fontSize: 12,
							flex: 1,
							color: "black",
							marginLeft: 10,
						}}>
						{timing.slice(4)} → {newTiming}
					</Text>
				</View>
				<View
					style={{
						justifyContent: "flex-start",
						flexDirection: "row",
						// borderTopWidth: 1,
						borderColor: "white",
						alignItems: "center",
						backgroundColor: "white",
						flex: 1,
						borderBottomLeftRadius: 15,
						borderBottomRightRadius: 15,
						borderWidth: 2,
						borderColor: YELLOW,
					}}>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: YELLOW,
							marginLeft: 35,
							flex: 1,
						}}>
						{item.reason}
					</Text>
				</View>
			</View>
		);
		return itemPartialCompleteStyle_TIME;
	};
	itemPartialCompleteStyle_ACTIVITY = (item, timing) => {
		let itemPartialCompleteStyle_ACTIVITY = (
			<View
				style={[
					{
						width: "100%",
						height: 85,
						borderRadius: 15,
						borderColor: "#F0F0F0",
						borderWidth: 0,
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "space-between",
						marginTop: this.state.isPlanDetailModalVis ? 7 : 15,
						backgroundColor: YELLOW,
						paddingVertical: 0,
					},
				]}>
				<View
					style={{
						position: "absolute",
						left: 5,
						top: 0,
						height: 45,
						marginVertical: 5,
						width: 24,
						backgroundColor: "white",
						borderRadius: 24,
						paddingVertical: 6,
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<Text style={{ color: YELLOW, textAlign: "center", fontSize: 14 }}>
						♥︎
					</Text>
					<Text style={{ fontFamily: "RobotoBoldBold", color: YELLOW }}>
						{item.satisfactionScore}
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						paddingHorizontal: 20,
						justifyContent: "flex-start",
						alignItems: "center",
						marginTop: 10,
					}}>
					{/* <View
				style={{
				  position: "absolute",
				  left: 5,
				  height: 24,
				  width: 24,
				  backgroundColor: "white",
				  borderRadius: 24,
				  justifyContent: "center",
				  alignItems: "center",
				}}
			  >
				<Text style={{ fontFamily: "RobotoBoldBold" }}>
				  {item.satisfactionScore}
				</Text>
			  </View> */}

					<View style={{ borderRadius: 20, width: "100%" }}>
						<Text
							ellipsizeMode="tail"
							numberOfLines={1}
							style={{
								fontFamily: "RobotoBoldBold",
								fontSize: 14,
								paddingLeft: 18,
								width: "100%",
								color: "black",
							}}>
							{item.oldTitle} → {item.title}{" "}
							<Text style={{ fontFamily: "RobotoRegular", color: "white" }}>
								{item.start.slice(5, 10)} | {timing.slice(0, 3)}
							</Text>
						</Text>
					</View>
				</View>
				<View
					style={{
						justifyContent: "flex-start",
						flexDirection: "row",
						// borderTopWidth: 1,
						borderColor: "white",
						alignItems: "center",
						flex: 1,
					}}>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							flex: 1,
							color: "white",
							marginLeft: 38,
						}}>
						{timing.slice(4)}
					</Text>
				</View>
				<View
					style={{
						justifyContent: "flex-start",
						flexDirection: "row",
						borderColor: YELLOW,
						alignItems: "center",
						backgroundColor: "white",
						flex: 1,
						width: "100%",
						borderWidth: 2,
						borderBottomLeftRadius: 15,
						borderBottomRightRadius: 15,
					}}>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: YELLOW,
							marginLeft: 35,
							flex: 1,
						}}>
						{item.reason}
					</Text>
				</View>
			</View>
		);
		return itemPartialCompleteStyle_ACTIVITY;
	};
	itemPartialCompleteStyle_TIME_ACTIVITY = (item, timing, newTiming) => {
		let itemPartialCompleteStyle_TIME = (
			<View
				style={[
					{
						width: "100%",
						height: 85,
						borderRadius: 15,
						borderColor: "#F0F0F0",
						borderWidth: 0,
						flexDirection: "column",
						alignItems: "flex-start",
						justifyContent: "space-between",
						marginTop: this.state.isPlanDetailModalVis ? 7 : 15,
						backgroundColor: YELLOW,
						paddingVertical: 0,
					},
				]}>
				<View
					style={{
						position: "absolute",
						left: 5,
						top: 0,
						height: 45,
						marginVertical: 5,
						width: 24,
						backgroundColor: "white",
						borderRadius: 24,
						paddingVertical: 6,
						flexDirection: "column",
						justifyContent: "space-between",
						alignItems: "center",
					}}>
					<Text style={{ color: YELLOW, textAlign: "center", fontSize: 14 }}>
						♥︎
					</Text>
					<Text style={{ fontFamily: "RobotoBoldBold", color: YELLOW }}>
						{item.satisfactionScore}
					</Text>
				</View>
				<View
					style={{
						flexDirection: "row",
						width: "100%",
						paddingHorizontal: 20,
						justifyContent: "flex-start",
						alignItems: "center",
						marginTop: 10,
					}}>
					{/* <View
				style={{
				  position: "absolute",
				  left: 5,
				  height: 24,
				  width: 24,
				  backgroundColor: "white",
				  borderRadius: 24,
				  justifyContent: "center",
				  alignItems: "center",
				}}
			  >
				<Text style={{ fontFamily: "RobotoBoldBold" }}>
				  {item.satisfactionScore}
				</Text>
			  </View> */}
					<Text
						ellipsizeMode="tail"
						numberOfLines={1}
						style={{
							fontFamily: "RobotoBoldBold",
							fontSize: 14,
							paddingLeft: 18,
							color: "black",
							marginRight: 10,
							// width: 100,
						}}>
						{item.oldTitle} → {item.title}
					</Text>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: "white",
						}}>
						{moment(item.start).format().slice(5, 10)} {"|"}{" "}
						{moment(item.start).format("ddd").toUpperCase()}
					</Text>
				</View>
				<View
					style={{
						justifyContent: "flex-start",
						flexDirection: "row",
						// backgroundColor:"white",
						borderRadius: 20,
						marginTop: 2,
						marginRight: 5,
						marginLeft: 28,
						// borderColor: "white",
						alignItems: "center",
						flex: 1,
					}}>
					<Text
						style={{
							fontFamily: "RobotoBoldBold",
							fontSize: 12,
							flex: 1,
							color: "black",
							marginLeft: 10,
						}}>
						{timing.slice(4)} → {newTiming}
					</Text>
				</View>
				<View
					style={{
						justifyContent: "flex-start",
						flexDirection: "row",
						// borderTopWidth: 1,
						borderColor: "white",
						alignItems: "center",
						backgroundColor: "white",
						flex: 1,
						borderBottomLeftRadius: 15,
						borderBottomRightRadius: 15,
						borderWidth: 2,
						borderColor: YELLOW,
					}}>
					<Text
						style={{
							fontFamily: "RobotoRegular",
							fontSize: 14,
							color: YELLOW,
							marginLeft: 35,
							flex: 1,
						}}>
						{item.reason}
					</Text>
				</View>
			</View>
		);
		return itemPartialCompleteStyle_TIME;
	};

	render() {
		let firstSlidePanelPage = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "space-between",
					height: 450,
					paddingBottom: 20,
					// backgroundColor:"red"
				}}>
				<SlidingUpPanelTxt height={108} width={335} marginTop={15} />
				{/* First Row of Activity Selection */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						paddingHorizontal: "5%",
						paddingVertical: "2%",
						height: "20%",
						width: "90%",
						borderColor: "#DADADA",
						borderWidth: 2,
						borderRadius: 20,
						marginTop: "5%",
					}}>
					<View
						style={{
							justifyContent: "space-between",
							alignItems: "center",
							height: "100%",
							width: "50%",
							paddingVertical: "2%",
							paddingHorizontal: "2%",
						}}>
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 14 }}>
							Activity
						</Text>
						<View
							style={{
								backgroundColor: "black",
								borderRadius: 40,
								height: "60%",
								width: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}>
							<RNPickerSelect
								style={{
									inputIOS: {
									  textAlign: "center",
									  color: "white",
									  fontWeight: "bold",
									  fontSize: 12,
									  backgroundColor: "black",
									  borderRadius: 20,
									},
									inputAndroid: {
									  textAlign: "center",
									  color: "white",
									  fontWeight: "bold",
									  fontSize: 12,
									  backgroundColor: "black",
									  borderRadius: 20,
									},
								  }}
								placeholder={{ label: "Select Here", value: null }}
								onValueChange={async (item) => {
									this.setState({ isActivityTypeSelected: true });
									this.setState({ selectedActivity: item.label });
									// await this.activityFilter(item);
								}}
							/>
						</View>
					</View>
					<View
						style={{
							justifyContent: "space-between",
							alignItems: "center",
							height: "100%",
							width: "50%",
							paddingVertical: "2%",
							paddingHorizontal: "2%",
						}}>
						<Text
							style={{
								fontFamily: "RobotoBoldBold",
								fontSize: 11,
								textAlign: "center",
							}}>
							Add Self-Defined Activity
						</Text>
						{/* Add New Activity Text Field */}
						<View
							style={{
								backgroundColor: "white",
								height: "60%",
								borderRadius: 20,
								borderWidth: 2,
								borderColor: "black",
								marginRight: 0,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}>
							<TextInput
								style={{
									fontSize: 16,
									marginLeft: 5,
									width: "100%",
									textAlign: "center",
									fontFamily: "RobotoBoldItalic",
								}}
								maxLength={12}
								ref={(input) => {
									this.textInput = input;
								}}
								placeholder="new activity"
								value={this.state.userDefinedActivityText}
								onChangeText={(text) =>
									this.setState({ userDefinedActivityText: text })
								}></TextInput>
							<View
								style={{
									margin: 1,
									justifyContent: "center",
									position: "absolute",
									marginRight: 1,
								}}>
								<TouchableOpacity
									style={{ alignItems: "center", justifyContent: "center" }}
									onPress={this.addNewActivityBtnPressed}>
									<Ionicons
										name="ios-add-circle"
										size={25}
										color={"black"}
										// style={{flex:0.1}}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				{/* * TEXT: "Only plan for the upcoming week:  */}
				<Text
					style={{
						marginTop: "2%",
						fontFamily: "RobotoBoldItalic",
						color: "#676767",
					}}>
					* Only plan for the upcoming week
				</Text>
				{/* Second Row of Date & Time Selection */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						// paddingHorizontal: "5%",

						height: "20%",
						width: "90%",
						borderColor: "#DADADA",
						backgroundColor: "#F0F0F0",
						borderWidth: 2,
						borderRadius: 20,
						marginTop: "2%",
					}}>
					<View
						style={{
							flex: 1,
							height: "100%",
							alignItems: "center",
							justifyContent: "space-between",
							borderColor: "#F0F0F0",
							backgroundColor: "#DADADA",
							paddingVertical: "4%",
							borderBottomLeftRadius: 15,
							borderTopLeftRadius: 15,
						}}>
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 14 }}>
							Date
						</Text>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								height: 40,
								width: "100%",
								backgroundColor: "#DADADA",
								borderRadius: 5,
							}}>
							<DateTimePicker
								value={this.state.dateTimePickerDate}
								mode="date"
								is24Hour={true}
								display="default"
								onChange={async (e, date) => {
									this.pickTheDate(date);
									this.setState({ dateTimePickerDate: date });
								}}
								style={{
									width: 80,
									height: 40,
									flex: 1,
								}}
							/>
						</View>
					</View>
					<View
						style={{
							flex: 1,
							height: "100%",
							alignItems: "center",
							justifyContent: "space-between",
							paddingVertical: "4%",
						}}>
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 14 }}>
							From
						</Text>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								height: 40,
								width: "100%",
								backgroundColor: "#F0F0F0",
								borderTopLeftRadius: 5,
								borderBottomLeftRadius: 5,
							}}>
							<DateTimePicker
								value={this.state.startTime}
								mode="spinner"
								minuteInterval={10}
								is24Hour={true}
								display="default"
								onChange={async (e, date) => this.pickStartTime(date)}
								style={{
									width: 90,
									height: 40,
									flex: 1,
								}}
							/>
						</View>
					</View>
					<View
						style={{
							flex: 1,
							height: "100%",
							alignItems: "center",
							justifyContent: "space-between",
							paddingVertical: "4%",
						}}>
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 14 }}>
							To
						</Text>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								height: 40,
								width: "100%",
								backgroundColor: "#F0F0F0",
								borderTopRightRadius: 5,
								borderBottomRightRadius: 5,
							}}>
							<DateTimePicker
								value={this.state.endTime}
								mode="spinner"
								minuteInterval={10}
								is24Hour={true}
								display="default"
								onChange={async (e, date) => this.pickEndTime(date)}
								style={{
									width: 90,
									height: 40,
									flex: 1,
								}}
							/>
						</View>
					</View>
				</View>
				<TouchableOpacity
					onPress={() => {
						this.onPlanBtnPressed();
					}}>
					<AddActivityBtn height={32} width={202} marginTop={10} />
				</TouchableOpacity>
			</View>
		);
		let secondSlidePanelPage = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "space-between",
					height: 450,
					paddingBottom: 20,
				}}>
				<SlidingUpPanelTxt2 height={188} width={335} marginTop={15} />
				<ScrollView style={{ width: 335, marginTop: "0%" }}>
					{/* <SelectableChips
						initialChips={TEST_DATA}
						chipStyle={{
							backgroundColor: "black",
							borderColor: "black",
							alignItems: "center",
							paddingHorizontal: 15,
							height: 26,
							marginTop: 5,
						}}
						valueStyle={{
							fontSize: 11,
							fontFamily: "RobotoBoldBlack",
							color: "white",
						}}
						chipStyleSelected={{
							backgroundColor: "#1AB700",
							borderColor: "#1AB700",
						}}
						onChangeChips={(chips) => {
							this.onChangeChips(chips);
							// this.setState({ isAddingKeywordsModalVis: false})
						}}
						alertRequired={false}
					/> */}
					<TouchableOpacity style={{flexDirection:"row", alignItems:"center", marginTop:5}} onPress = {() => {
						let isExampleVis = !this.state.isExampleVis;
						this.setState({isExampleVis:isExampleVis})
					}}>
						{this.state.isExampleVis ? 
						<AntDesign name="upcircle" size={20} color="black" /> : <AntDesign name="downcircle" size={20} color="black" />}
						<Text style={{fontWeight:"bold", marginLeft:10}}>Show Examples</Text>
					</TouchableOpacity>
					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
							alignItems: "center",
							marginTop: "5%",
							// display: this.state.isExampleVis ? 'flex' : "none"
						}}>
						{this.state.keywordsListInPanel.map((item, index) => {
							let isVis = true;
							if (item.isSample && !this.state.isExampleVis) {
								isVis = false;
							}
							if (isVis) {
								return (
									<TouchableOpacity key = {item.id !== undefined ? item.id : `index-${index}`}
										style={{
											height: 25,
											borderRadius: 20,
											backgroundColor: item.isSelected ? "#1AB700" : "black",
											justifyContent: "space-between",
											alignItems: "center",
											alignSelf: "center",
											marginBottom: 5,
											marginRight: 5,
											paddingHorizontal: 2,
											flexDirection: "row",
										}}
										onPress={() => {
											let updateList = this.state.keywordsListInPanel;
											for (let keyword of updateList) {
												if (keyword.title === item.title) {
													keyword.isSelected = !keyword.isSelected;
												}
											}
											this.setState({ keywordsListInPanel: updateList });
										}}>
										<Text
											style={{
												fontFamily: "RobotoBoldBlack",
												color: "white",
												paddingHorizontal: 20,
												fontSize: 12,
											}}>
											{item.title}
										</Text>
									</TouchableOpacity>
								);
							}

						})}
					</View>
				</ScrollView>
				<View
					style={{
						height: 32,
						width: "90%",
						flexDirection: "row",
						justifyContent: "flex-start",
						alignItems: "center",
						// backgroundColor:"red"
					}}>
					<View
						style={{
							backgroundColor: "white",
							height: 32,
							width: 180,
							borderRadius: 20,
							borderWidth: 2,
							borderColor: "black",
							marginRight: 20,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "space-between",
						}}>
						<TextInput
							style={{
								fontSize: 14,
								width: "100%",
								textAlign: "center",
								fontFamily: "RobotoBoldItalic",
							}}
							maxLength={12}
							placeholder="Add Keywords"
							ref={(input) => {
								this.KeyWordTextInput = input;
							}}
							value={this.state.userDefinedKeywords}
							onChangeText={(text) => {
								this.setState({ userDefinedKeywords: text });
							}}
						/>
						<View
							style={{ margin: 1, width: 25, position: "absolute", right: 1 }}>
							<TouchableOpacity
								style={{
									alignItems: "flex-end",
									justifyContent: "flex-end",
									flex: 1,
								}}
								onPress={() => {
									this.addKeywords();
								}}>
								<Ionicons name="ios-add-circle" size={25} color={"black"} />
							</TouchableOpacity>
						</View>
					</View>
					<TouchableOpacity
					onPress={() => {
						setTimeout(() => {
							this.setState({ isAddingKeywordsModalVis: false });
						});

						let updatedKeywordsBuddle = [];
						for (let keywords of this.state.keywordsListInPanel) {
							if (keywords.isSelected) {
								updatedKeywordsBuddle.push(keywords);
							}
						}
						this.setState({ keywordsBuddle: updatedKeywordsBuddle });
					}}
						style={{
							height: 32,
							backgroundColor: "black",
							borderColor:"black",
							borderWidth:2,
							borderRadius: 20,
							justifyContent: "center",
							alignItems: "center",
							paddingHorizontal:10
						}}>
						<Text style={{ fontFamily: "RobotoBoldBlack", color: "white" }}>
							Update Keywords
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
		let thirdSlidePanelPage = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: "100%",
					display: this.state.swipeAblePanelDisplay
				}}>
				<View
					style={{
						alignItems: "center",
						justifyContent: "flex-start",
						width: "80%",
					}}>
					<View
						style={{
							marginTop: "5%",
							width: "80%",
						}}>
						<Text
							style={{
								fontFamily: "RobotoBoldItalic",
								fontSize: 18,
								textAlign: "center",
							}}>
							Your planning strategy will appear here:
						</Text>
					</View>
					<View
						style={[
							// generalStyles.shadowStyle,
							{
								height: 81,
								width: 335,
								borderColor: "black",
								// borderWidth: 2,
								borderRadius: 20,
								marginTop: "5%",
								flexDirection: "row",
								backgroundColor: "white",
							},
						]}>
						<View
							style={{
								height: "100%",
								width: "100%",
								// borderTopLeftRadius: 20,
								// borderBottomLeftRadius: 20,
								// borderRightColor: "black",
								// borderRightWidth: 2,
								// paddingLeft: 20,
								paddingVertical: 10,
								justifyContent: "center",
								backgroundColor: "white",
							}}>
							<Image
								source={require("./assets/loader.gif")}
								style={{ width: "100%", height: "100%" }}
							/>
						</View>
					</View>
				</View>
			</View>
		);
		let thirdSlidePanelPageUpdated = (
			<View
				style={[
					generalStyles.shadowStyle,
					{
						alignItems: "center",
						justifyContent: "flex-start",
						height: "100%",
						display: this.state.thirdSlidePanelPageUpdatedDisplay
						// width:"100%",
						// borderRadius:20,
						// backgroundColor:"white"
					},
				]}>
				<View
					style={{
						alignItems: "center",
						justifyContent: "flex-start",
						width: "80%",
					}}>
					<View
						style={{
							marginTop: "5%",
							width: "80%",
						}}>
						<Text
							style={{
								fontFamily: "RobotoBoldItalic",
								fontSize: 18,
								textAlign: "center",
							}}>
							Your planning strategy will appear here:
						</Text>
					</View>
					<View
						style={[
							// generalStyles.shadowStyle,
							{
								height: 81,
								width: 335,
								borderColor: "black",
								borderWidth: 2,
								borderRadius: 20,
								marginTop: "5%",
								flexDirection: "row",
								backgroundColor: "white",
							},
						]}>
						<TouchableOpacity
							style={{
								height: "100%",
								width: "80%",
								borderTopLeftRadius: 20,
								borderBottomLeftRadius: 20,
								borderRightColor: "black",
								borderRightWidth: 2,
								paddingLeft: 20,
								paddingVertical: 10,
								justifyContent: "center",
								backgroundColor: "white",
							}}
							onPress={() => this.setState({ isStrategyDetailModalVis: true })}>
							<View>
								<View style={{ flexDirection: "row" }}>
									<Text
										style={{
											fontFamily: "RobotoBoldBlack",
											fontSize: 18,
											marginBottom: 5,
											marginRight: 10,
											alignItems: "center",
											justifyContent: "center",
										}}>
										{this.state.planStrategyName}
									</Text>
									<Ionicons
										name="information-circle-outline"
										size={24}
										color="black"
									/>
								</View>

								{/* <FlatList
                  horizontal={true}
                  data={TEST_DATA2}
                  renderItem={({ item }) => {
                    return (
                      <View
                        style={{
                          borderRadius: 20,
                          backgroundColor: "#E7E7E7",
                          marginRight: 2,
                          padding: 5,
                        }}
                      >
                        <Text
                          style={{
                            color: "black",
                            fontWeight: "bold",
                            color: "#1AB700",
                            fontSize: 8,
                          }}
                        >
                          # {item.title}
                        </Text>
                      </View>
                    );
                  }}
                /> */}
								<Text
									style={{
										fontSize: 12,
										fontFamily: "RobotoBoldBold",
										marginTop: 0,
									}}>
									{moment(new Date()).format("MMM Do YY")} -{" "}
									{moment(new Date()).add(7, "days").format("MMM Do YY")}
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							style={{
								height: "100%",
								width: "20%",
								borderBottomRightRadius: 15,
								borderTopRightRadius: 15,
								backgroundColor: "black",
								justifyContent: "center",
								alignSelf: "center",
							}}
							onPress={async () => {
								this.onStartPressed();
							}}>
							<Text
								style={{
									fontFamily: "RobotoBoldItalic",
									fontSize: 18,
									color: "white",
									textAlign: "center",
								}}>
								Start
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
		let planSetUpPage = (
			<View
				style={{
					width: "100%",
					height: "100%",
					justifyContent: "flex-start",
					alignItems: "center",
					// backgroundColor:"red"
				}}>
				{/* Body */}
				<View
					style={[
						// generalStyles.shadowStyle,
						{
							width: "98%",
							height: "100%",
							backgroundColor: "white",
							marginTop: 4,
							paddingTop: 20,
							borderRadius: 20,
							borderColor: "grey",
							borderRadius: 2,
							alignItems: "center",
						},
					]}>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							margin: 0,
							paddingTop: 15,
							paddingHorizontal: 15,
						}}>
						<View
							style={{
								// width: "100%",
								flexDirection: "row",
								justifyContent: "flex-start",
								alignItems: "center",
								// margin: 0,
								// paddingTop: 15,
								// paddingHorizontal: 15
							}}>
							<MaterialIcons name="event-note" size={15} color="black" />

							<Text
								style={{
									fontFamily: "RobotoBoldItalic",
									fontSize: 18,
									marginLeft: 5,
								}}>
								Planned Activities
							</Text>
						</View>
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 13 }}>
							{this.state.accumulatedMinutes}/150 minutes
						</Text>
					</View>
					<View style={{ width: "100%", paddingLeft: 15, marginBottom: 15 }}>
						<Text
							style={{
								fontFamily: "RobotoBoldItalic",
								fontSize: 14,
								marginTop: 2,
								color: "#676767",
								textAlign: "left",
							}}>
							Your planned activities will appear here
						</Text>
					</View>
					<View style={{ width: "100%", height: 400, paddingHorizontal: 15 }}>
						<FlatList
							data={this.state.plansBuddle}
							renderItem={({ item }) => {
								if (!item.isDeleted) {
									let timing =
										moment(item.start).format("ddd").toUpperCase() +
										" " +
										item.start.slice(11, 16) +
										" - " +
										item.end.slice(11, 16) +
										" | " +
										item.duration +
										" MIN";

									return (
										<TouchableOpacity
											style={[
												{
													width: "100%",
													height: 39,
													borderRadius: 20,
													borderColor: "#F0F0F0",
													borderWidth: 1,
													paddingHorizontal: 6,
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "space-between",
													marginTop: 5,
												},
											]}
											onPress={() => {
												console.log("pressed on activity list", item);
												this.setState({ isChangePlanModalVis: true });
												this.onReportActivity = item;

												this.setState({ reportTitle: item.title });
												this.setState({ reportStart: item.start });
												this.setState({ reportEnd: item.end });
												this.setState({ reportDuration: item.duration });
												let selectedDay = new Date(
													moment(item.start).add(1, "d").format("YYYY-MM-DD")
												);
												this.setState({ selectedDate: selectedDay });
												this.setState({ dateTimePickerDate: selectedDay });
											}}>
											<MaterialCommunityIcons
												name="dots-vertical-circle"
												size={24}
												color="black"
											/>
											<Text
												style={{
													fontFamily: "RobotoBoldBold",
													fontSize: 14,
													paddingLeft: 8,
												}}>
												{item.title}
											</Text>
											<Text
												style={{ fontFamily: "RobotoRegular", fontSize: 14 }}>
												{timing}
											</Text>
											<Text
												style={{ fontFamily: "RobotoRegular", fontSize: 14 }}>
												{/* {item.duration} */}
											</Text>
											<TouchableOpacity
												onPress={() => this.deleteActivity(item)}>
												<Ionicons
													name="md-close-circle"
													size={24}
													color="black"
												/>
											</TouchableOpacity>
										</TouchableOpacity>
									);
								}
								// console.log("items in plansBuddle", item);
							}}
						/>
					</View>
				</View>
			</View>
		);
		let summaryPage = (
			<View
				style={{
					backgroundColor: "white",
					width: "100%",
					height: "100%",
					justifyContent: "flex-start",
					alignItems: "center",
				}}>
				{/* Body */}
				<View
					style={[
						// generalStyles.shadowStyle,
						{
							width: "98%",
							height: "90%",
							backgroundColor: "white",
							marginTop: 4,
							paddingTop: 20,
							borderRadius: 20,
						},
					]}>
					<View
						style={{
							width: "100%",
							flexDirection: "column",
							justifyContent: "flex-start",
							padding: 15,
						}}>
						<View
							style={{
								width: "100%",
								flexDirection: "row",
								justifyContent: "flex-start",
								alignItems: "center",
							}}>
							<FontAwesome name="asterisk" size={15} color="black" />
							<Text
								style={{
									fontFamily: "RobotoBoldItalic",
									fontSize: 18,
									marginLeft: 5,
								}}>
								Key Words of My Plans
							</Text>
						</View>
						<Text
							style={{
								fontFamily: "RobotoBoldItalic",
								fontSize: 14,
								marginTop: 5,
								color: "#676767",
							}}>
							Add Keywords in the slide up panel
						</Text>
						{/* <FlatList
            data={TEST_DATA2}
            renderItem={({item}) => {
              return(
                <View style={{height:32, borderRadius:20, backgroundColor:"black", justifyContent:"center", alignSelf:"center", marginBottom:5,paddingHorizontal:10}}>
                  <Text style={{fontFamily:"RobotoBoldBold", color:"white"}}>{item.title}</Text>
                </View>
              )
            }}
            /> */}
						<View
							style={{
								flexDirection: "row",
								flexWrap: "wrap",
								alignItems: "center",
								marginTop: "5%",
							}}>
							{this.state.keywordsBuddle.map((item, index) => {
								console.log("generalStyles.shadowStyle:", generalStyles.shadowStyle);
								return (
									<View key = {item.id !== undefined ? item.id : `index-${index}`}
										style={{
											height: 25,
											borderRadius: 20,
											backgroundColor: "black",
											justifyContent: "space-between",
											alignItems: "center",
											alignSelf: "center",
											marginBottom: 5,
											marginRight: 5,
											paddingHorizontal: 2,
											flexDirection: "row",
										}}>
										<Text
											style={{
												fontFamily: "RobotoBoldBlack",
												color: "white",
												paddingHorizontal: 20,
												fontSize: 12,
											}}>
											{item.title}
										</Text>
										<View
											style={{
												display: item.type === "EXAMPLE" ? "none" : "flex",
											}}>
											<TouchableOpacity
												onPress={() => this.deleteKeywords(item)}>
												<Ionicons
													name="md-close-circle"
													size={20}
													color="white"
												/>
											</TouchableOpacity>
										</View>
									</View>
								);
							})}
						</View>
					</View>
				</View>
			</View>
		);
		let finalConfirmationPage = (
			<View
				style={{
					backgroundColor: "white",
					width: "100%",
					height: "100%",
					justifyContent: "flex-start",
					alignItems: "center",
				}}>
				{/* Body */}
				<View
					style={[
						generalStyles.shadowStyle,
						{
							width: "100%",
							height: "100%",
							backgroundColor: "white",
							marginTop: 0,
							borderRadius: 0,
							justifyContent: "center",
							alignItems: "center",
						},
					]}>
					<View style={{ position: "absolute", bottom: 10 }}>
						{thirdSlidePanelPage}
						{thirdSlidePanelPageUpdated}
					</View>
					{this.state.confirmPageIcon}
					<Text
						style={{
							fontFamily: "RobotoBoldItalic",
							fontSize: 24,
							marginTop: "5%",
						}}>
						{this.state.confirmPageTitle}
					</Text>
					<View
						style={{
							flexDirection: "column",
							alignItems: "center",
							display: this.state.confirmBtnDisplay,
						}}>
						<Text
							style={{
								fontFamily: "RobotoRegular",
								fontSize: 14,
								marginTop: "5%",
								width: "80%",
								textAlign: "center",
							}}>
							Give a name to your plan:
						</Text>
						<Text
							style={{
								fontFamily: "RobotoRegular",
								fontSize: 12,
								marginTop: "2%",
								width: "80%",
								textAlign: "center",
							}}>
							(21 characters maximum)
						</Text>
						<View
							style={{
								backgroundColor: "white",
								height: 32,
								width: 200,
								borderRadius: 20,
								borderWidth: 2,
								marginTop: 20,
								borderColor: "black",
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}>
							<TextInput
								style={{
									fontSize: 14,
									width: "100%",
									textAlign: "center",
									fontFamily: "RobotoBoldItalic",
								}}
								placeholder="e.g. Morning Exercise Plan"
								maxLength={25}
								ref={(input) => {
									this.planStrategyInputRef = input;
								}}
								value={this.state.planStrategyName}
								onChangeText={(text) => {
									this.setState({ planStrategyName: text });
								}}
							/>
						</View>
						{/* Confirm btns */}
						<View
							style={{
								flexDirection: "row",
								marginTop: 20,
								width: 205,
								justifyContent: "space-between",
							}}>
							<TouchableOpacity
								style={{
									backgroundColor: "black",
									height: 30,
									width: 100,
									borderRadius: 20,
									borderWidth: 2,
									borderColor: "black",
									marginRight: 0,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "flex-start",
								}}
								onPress={async () => this.onBackBtnPressed()}>
								<View
									style={{
										margin: 0,
										width: 25,
										position: "absolute",
										left: 1,
									}}>
									<View
										style={{
											alignItems: "flex-start",
											justifyContent: "flex-start",
											flex: 1,
										}}>
										<Ionicons
											name="chevron-back-circle-sharp"
											size={25}
											color={"white"}
										/>
									</View>
								</View>
								<View
									style={{
										margin: 0,
										width: 73,
										position: "absolute",
										right: 1,
									}}>
									<View
										style={{
											alignItems: "flex-end",
											justifyContent: "flex-end",
											flex: 1,
										}}>
										<Text
											style={{
												fontSize: 14,
												width: "100%",
												textAlign: "center",
												fontFamily: "RobotoBoldItalic",
												color: "white",
											}}>
											Back
										</Text>
									</View>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									backgroundColor: "black",
									height: 30,
									width: 100,
									borderRadius: 20,
									borderWidth: 2,
									borderColor: "black",
									marginRight: 0,
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "flex-start",
								}}
								// OnConfirm
								onPress={() => this.onConfirmBtnPressed()}>
								<View
									style={{
										margin: 0,
										width: 73,
										position: "absolute",
										left: 1,
									}}>
									<View
										style={{
											alignItems: "flex-start",
											justifyContent: "flex-start",
											flex: 1,
										}}>
										<Text
											style={{
												fontSize: 14,
												width: "100%",
												textAlign: "center",
												fontFamily: "RobotoBoldItalic",
												color: "white",
											}}>
											Confirm
										</Text>
									</View>
								</View>
								<View
									style={{
										margin: 0,
										width: 25,
										position: "absolute",
										right: 1,
									}}>
									<View
										style={{
											alignItems: "flex-end",
											justifyContent: "flex-end",
											flex: 1,
										}}>
										<Ionicons
											name="checkmark-circle-outline"
											size={25}
											color={"white"}
										/>
									</View>
								</View>
							</TouchableOpacity>
						</View>
					</View>

					<View style={{ width: "60%", display: this.state.confirmTxtDisplay }}>
						<Text
							style={{
								fontFamily: "RobotoRegular",
								fontSize: 14,
								marginTop: "5%",

								textAlign: "center",
							}}>
							Click the{" "}
							<Text style={{ fontFamily: "RobotoBoldItalic" }}>Start</Text>{" "}
							below to start your first week of tracking
						</Text>
					</View>
				</View>
			</View>
		);
		let reportScreen_FIVE = (
			<View
				style={{ height: "100%", width: "100%", padding: 15, marginTop: 20 }}>
				<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 16 }}>
					Modify the activity as below:
				</Text>
				<View
					style={{
						width: "100%",
						height: 5,
						backgroundColor: "black",
						borderRadius: 10,
						marginTop: 10,
						marginBottom: 30,
					}}></View>
				{/* First Row of Activity Selection */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						paddingHorizontal: "5%",
						paddingVertical: "2%",
						height: 90,
						width: "100%",
						borderColor: "#DADADA",
						borderWidth: 2,
						borderRadius: 20,
						marginTop: "2%",
					}}>
					<View
						style={{
							justifyContent: "space-between",
							alignItems: "center",
							height: "100%",
							width: "50%",
							paddingVertical: "2%",
							paddingHorizontal: "2%",
						}}>
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 12 }}>
							Activity
						</Text>
						<View
							style={{
								backgroundColor: "black",
								borderRadius: 40,
								height: "50%",
								width: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}>
							<ModalSelector
								style={{ borderWidth: 0, borderRadius: 20 }}
								// touchableStyle={{ color: "white" }}
								optionContainerStyle={{
									...generalStyles.shadowStyle,
									borderWidth: 0,
									backgroundColor: "white",
									borderColor: "grey",
									// borderWidth: 2,
									borderRadius: 15,
								}}
								selectStyle={{ borderWidth: 0 }}
								selectTextStyle={{
									textAlign: "center",
									color: "white",
									fontWeight: "bold",
									borderRadius: 20,
									fontSize: 12,
								}}
								initValueTextStyle={{
									textAlign: "center",
									color: "white",
									fontWeight: "bold",
									backgroundColor: "black",
									borderRadius: 20,
									fontSize: 12,
								}}
								backdropPressToClose={true}
								overlayStyle={{
									flex: 1,
									padding: "5%",
									justifyContent: "center",
									backgroundColor: "rgba(0,0,0,0)",
									borderRadius: 20,
								}}
								optionTextStyle={{
									fontWeight: "bold",
									fontFamily: "RobotoBoldBlack",
								}}
								sectionTextStyle={{
									fontWeight: "bold",
									fontFamily: "RobotoBoldItalic",
								}}
								cancelStyle={{
									backgroundColor: "black",
									borderRadius: 15,
								}}
								cancelTextStyle={{ fontWeight: "bold", color: "white" }}
								data={this.state.activityData}
								initValue={this.onReportActivity.title}
								onChange={async (item) => {
									this.setState({ isActivityTypeSelected: true });
									this.setState({ selectedActivity: item.label });
									this.setState({ reportTitle: item.label });
									// await this.activityFilter(item);
								}}
							/>
						</View>
					</View>
					<View
						style={{
							justifyContent: "space-between",
							alignItems: "center",
							height: "100%",
							width: "50%",
							paddingVertical: "2%",
							paddingHorizontal: "2%",
						}}>
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 12 }}>
							Self-Defined Activity
						</Text>
						{/* Add New Activity Text Field */}
						<View
							style={{
								backgroundColor: "white",
								height: "50%",
								borderRadius: 20,
								borderWidth: 2,
								borderColor: "black",
								marginRight: 0,
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "space-between",
							}}>
							<TextInput
								style={{
									fontSize: 16,
									marginLeft: 5,
									width: "100%",
									textAlign: "center",
									fontFamily: "RobotoBoldItalic",
								}}
								maxLength={12}
								ref={(input) => {
									this.textInput = input;
								}}
								placeholder="new activity"
								value={this.state.userDefinedActivityText}
								onChangeText={(text) =>
									this.setState({ userDefinedActivityText: text })
								}></TextInput>
							<View
								style={{
									margin: 1,
									justifyContent: "center",
									position: "absolute",
									marginRight: 1,
								}}>
								<TouchableOpacity
									style={{ alignItems: "center", justifyContent: "center" }}
									onPress={this.addNewActivityBtnPressed}>
									<Ionicons
										name="ios-add-circle"
										size={25}
										color={"black"}
										// style={{flex:0.1}}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
				{/* Time Picker */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						// paddingHorizontal: "5%",

						height: 80,
						width: "100%",
						borderColor: "#DADADA",
						backgroundColor: "#F0F0F0",
						borderWidth: 2,
						borderRadius: 20,
						marginTop: "2%",
					}}>
					<View
						style={{
							flex: 1,
							height: "100%",
							alignItems: "center",
							justifyContent: "space-between",
							paddingVertical: "4%",
						}}>
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 14 }}>
							From
						</Text>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								height: 40,
								width: "100%",
								backgroundColor: "#F0F0F0",
								borderTopLeftRadius: 5,
								borderBottomLeftRadius: 5,
							}}>
							<DateTimePicker
								value={this.state.startTime}
								mode="spinner"
								minuteInterval={10}
								is24Hour={true}
								display="default"
								onChange={async (e, date) => this.pickStartTime(date)}
								style={{
									width: 90,
									height: 40,
									flex: 1,
								}}
							/>
						</View>
					</View>
					<View
						style={{
							flex: 1,
							height: "100%",
							alignItems: "center",
							justifyContent: "space-between",
							paddingVertical: "4%",
						}}>
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 14 }}>
							To
						</Text>
						<View
							style={{
								justifyContent: "center",
								alignItems: "center",
								height: 40,
								width: "100%",
								backgroundColor: "#F0F0F0",
								borderTopRightRadius: 5,
								borderBottomRightRadius: 5,
							}}>
							<DateTimePicker
								value={this.state.endTime}
								mode="spinner"
								minuteInterval={10}
								is24Hour={true}
								display="default"
								onChange={async (e, date) => this.pickEndTime(date)}
								style={{
									width: 90,
									height: 40,
									flex: 1,
								}}
							/>
						</View>
					</View>
				</View>
				<View
					style={{
						width: "100%",
						justifyContent: "flex-end",
						flexDirection: "row",
						height: 20,
						borderTopWidth: 2,
						marginTop: "5%",
					}}>
					<TouchableOpacity
						style={{
							height: 30,
							width: 70,
							borderRadius: 20,
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={async () => {
							let activityToUpdate = Object.assign({}, this.onReportActivity);
							activityToUpdate.title = this.state.reportTitle;
							activityToUpdate.start =
								this.onReportActivity.start.slice(0, 10) +
								moment(this.state.startTime).format().slice(10, 19);
							activityToUpdate.end =
								this.onReportActivity.end.slice(0, 10) +
								moment(this.state.endTime).format().slice(10, 19);
							let timeStamp = moment(new Date()).format();
							activityToUpdate.key = this.onReportActivity.key + timeStamp;
							await this.deleteActivity(this.onReportActivity);
							await this.onPlanBtnPressed(activityToUpdate);
							this.setState({ isChangePlanModalVis: false });

							let planBuddleToUpdate = this.state.plansBuddle;
							planBuddleToUpdate.sort(function (a, b) {
								return new Date(a.start) - new Date(b.start);
							});
							await this.setState({ plansBuddle: planBuddleToUpdate });
							console.log("this.state.plansBuddle", this.state.plansBuddle);

							// console.log("activityToUpdate", activityToUpdate);
							// console.log("moment(this.state.startTime).format()",);
						}}>
						<Text
							style={{ fontWeight: "bold", textAlign: "right", fontSize: 15 }}>
							SAVE
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
		let slideUpPanel = (
			// <KeyboardAvoidingView
			//   behavior={Platform.OS === "ios" ? "padding" : "height"}
			//   style={{height:"100%", width:"100%"}}
			// >
			<SlidingUpPanel
				draggableRange={{ top: this.state.panelHeight, bottom: 160 }}
				showBackdrop={false}
				ref={(c) => (this._panel = c)}>
				<View
					style={[
						generalStyles.shadowStyle,
						{
							height: 500,
							justifyContent: "flex-start",
							flexDirection: "column",
							alignItems: "center",
							borderRadius: 20,
							backgroundColor: "white",
						},
					]}>
					{/* Top Sliding Up Indication Bar */}
					<View
						style={{
							width: "30%",
							backgroundColor: "#BDBDBD",
							height: 7,
							borderRadius: 10,
							marginTop: 10,
						}}></View>
					<View
						style={{
							height: 470,
							width: "100%",
							display: this.state.thirdSlidePanelPageUpdatedDisplay,
						}}>
						{thirdSlidePanelPageUpdated}
					</View>

					{/* Swipable Body Content */}
					<View
						style={{
							height: 430,
							width: "100%",
							display: this.state.swipeAblePanelDisplay,
						}}>
						{/* Swiper Control */}
						{/* <Swiper
              ref={this.panelSwiperRef}
              onIndexChanged={(index) => {
                // console.log("index changed", index);

                if (index === 2) {
                  // this.setState({ panelDisplay: "none" });
                  this.setState({ panelHeight: 200 });
                  this.setState({ displayCalView: "none" });
                  this.setState({ displayTitle: "none" });
                  this.setState({ mainContentSwiperDisplay: "none" });
                  this.setState({ conformationPageDisplay: "flex" });
                  this._panel.show();
                } else {
                  this.setState({ mainContentSwiperDisplay: "flex" });
                  this.setState({ conformationPageDisplay: "none" });
                  this.mainContentSwiperRef.current.goToPage(index, true);
                  this.setState({ panelHeight: 500 });
                  this._panel.hide();
                  this.setState({ displayCalView: "flex" });
                  this.setState({ displayTitle: "flex" });
                  if (index === 1) {
                    this.setState({
                      title: (
                        <SummarizePlanningStrategy height={28} width={300} />
                      ),
                    });
                  } else if (index === 0) {
                    this.setState({
                      title: <PlanActivities height={28} width={150} />,
                    });
                  }
                }
              }}
            >
              {firstSlidePanelPage}
              {secondSlidePanelPage}
              {thirdSlidePanelPage}
            </Swiper> */}
						<Onboarding
							// bottomBarHighlight={false}
							// ref={this.mainContentSwiperRef}
							containerStyles={{ justifyContent: "flex-start" }}
							ref={this.panelSwiperRef}
							imageContainerStyles={{ height: this.state.panelHeight }}
							bottomBarHeight={30}
							showSkip={false}
							showNext={false}
							// NextButtonComponent={() => (
							// 	<TouchableOpacity
							// 		style={{ width: "100%", padding: "5%" }}
							// 		onPress={() => {
							// 			this.panelSwiperRef.current.goNext();
							// 		}}>
							// 		<Text
							// 			style={{
							// 				fontFamily: "RobotoBoldBlack",
							// 				textAlign: "right",
							// 				marginRight: 10,
							// 			}}>
							// 			NEXT
							// 		</Text>
							// 	</TouchableOpacity>
							// )}
							bottomBarColor="white"
							showDone={false}
							// pageIndexCallback={(index) => {
							// 	if (index === 2) {
							// 		// this.setState({ panelDisplay: "none" });
							// 		this.setState({ panelHeight: 200 });
							// 		this.setState({ displayCalView: "none" });
							// 		this.setState({ displayTitle: "none" });
							// 		this.setState({ mainContentSwiperDisplay: "none" });
							// 		this.setState({ conformationPageDisplay: "flex" });
							// 		this._panel.show();
							// 	} else {
							// 		this.setState({ mainContentSwiperDisplay: "flex" });
							// 		this.setState({ conformationPageDisplay: "none" });
							// 		this.mainContentSwiperRef.current.goToPage(index, true);
							// 		this.setState({ panelHeight: 450 });
							// 		this._panel.hide();
							// 		this.setState({ displayCalView: "flex" });
							// 		this.setState({ displayTitle: "flex" });
							// 		if (index === 1) {
							// 			this.setState({
							// 				title: (
							// 					<SummarizePlanningStrategy height={28} width={119} />
							// 				),
							// 			});
							// 		} else if (index === 0) {
							// 			this.setState({
							// 				title: <PlanActivities height={28} width={150} />,
							// 			});
							// 		}
							// 	}
							// }}
							pages={[
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: firstSlidePanelPage,
								},
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: secondSlidePanelPage,
								},
								// {
								// 	title: "",
								// 	subtitle: "",
								// 	backgroundColor: "white",
								// 	image: thirdSlidePanelPage,
								// },
							]}
						/>
					</View>
					{/* {firstSlidePanelPage} */}
					{/* {secondSlidePanelPage} */}
					{/* {thirdSlidePanelPage} */}
				</View>
			</SlidingUpPanel>
			// </KeyboardAvoidingView>
		);
		let tip_ONE = (
			<View style={{ height: "100%", width: "100%" }}>
				<View
					style={{
						height: "100%",
						width: "100%",
						justifyContent: "flex-start",
						alignItems: "center",
						flexDirection: "column",
					}}>
					<TipCalendar1 height={"100%"} width={"100%"} />
				</View>
			</View>
		);
		let tip_TWO = (
			<View style={{ height: "100%", width: "100%" }}>
				<View
					style={{
						height: "100%",
						width: "100%",
						justifyContent: "flex-start",
						alignItems: "center",
						flexDirection: "column",
					}}>
					<TipCalendar2 height={"100%"} width={"100%"} />
				</View>
			</View>
		);
		let tip_THREE = (
			<View style={{ height: "100%", width: "100%" }}>
				<View
					style={{
						height: "100%",
						width: "100%",
						justifyContent: "flex-start",
						alignItems: "center",
						flexDirection: "column",
					}}>
					<TipCalendar3 height={"100%"} width={"100%"} />
				</View>
			</View>
		);
		let tip_FOUR = (
			<View style={{ height: "100%", width: "100%" }}>
				<View
					style={{
						height: "100%",
						width: "100%",
						justifyContent: "flex-start",
						alignItems: "center",
						flexDirection: "column",
					}}>
					<TipCalendar4 height={"100%"} width={"100%"} />
				</View>
			</View>
		);
		let tip_FIVE = (
			<View style={{ height: "100%", width: "100%" }}>
				<View
					style={{
						height: "100%",
						width: "100%",
						justifyContent: "flex-start",
						alignItems: "center",
						flexDirection: "column",
					}}>
					<TipCalendar5 height={"100%"} width={"100%"} />
				</View>
			</View>
		);

		return (
			// <KeyboardAvoidingView
			//   behavior={Platform.OS === "ios" ? "padding" : "height"}
			// >
			//   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : "height"}>
				<View
					style={{
						backgroundColor: "white",
						width: "100%",
						height: "100%",
						justifyContent: "flex-start",
						alignItems: "center",
					}}>
					<FlashMessage position="top" />

					{/* Guide Btn */}
					<TouchableOpacity
						style={{
							position: "absolute",
							left: 0,
							top: "5%",
							height: 28,
							width: 85,
							flexDirection: "row",
							justifyContent: "space-between",
							paddingHorizontal: 5,
							alignItems: "center",
							backgroundColor: "black",
							borderBottomRightRadius: 20,
							borderTopRightRadius: 20,
						}}
						onPress={() => this.setState({ isGuideVis: true })}>
						<Text
							style={{
								fontFamily: "RobotoBoldItalic",
								color: "white",
								textAlign: "center",
								fontSize: 18,
							}}>
							Guide
						</Text>
						<AntDesign name="questioncircle" size={18} color="white" />
					</TouchableOpacity>
					{/* Popover Tips */}
					<View
						style={{
							position: "absolute",
							right: 15,
							top: "5%",
							height: 22,
							width: 43,
							justifyContent: "center",
							alignItems: "center",
						}}>
						<Popover
							popoverStyle={{ borderRadius: 20 }}
							from={
								<TouchableOpacity style={{ marginLeft: "0%" }}>
									<AntDesign name="infocirlce" size={22} color="black" />
								</TouchableOpacity>
							}>
							<View
								style={{
									height: 30,
									width: 350,
									alignItems: "center",
									justifyContent: "center",
									borderRadius: 20,
									transform: [{ scale: 0.8 }],
								}}>
								<Indicator height={22} width={330} />
							</View>
						</Popover>
					</View>
					{/* Title */}
					<View
						style={{
							height: 28,
							width: "50%",
							marginTop: "10%",
							alignItems: "center",
							justifyContent: "center",
							display: this.state.displayTitle,
							flexDirection: "row",
						}}>
						{this.state.title}
					</View>
					{/* Plan Strategy Detail Modal */}
					<Modal
						propagateSwipe={true}
						isVisible={this.state.isStrategyDetailModalVis}
						style={{
							justifyContent: "flex-start",
							alignItems: "center",
							marginTop: "50%",
						}}
						hasBackdrop={true}
						backdropOpacity={0}
						onBackdropPress={() =>
							this.setState({ isStrategyDetailModalVis: false })
						}
						onSwipeComplete={() =>
							this.setState({ isStrategyDetailModalVis: false })
						}
						swipeDirection="down">
						<View
							style={[
								generalStyles.shadowStyle,
								{
									width: "98%",
									height: "50%",
									borderRadius: 20,
									backgroundColor: "white",
								},
							]}>
							<Text
								style={{
									fontSize: 20,
									fontFamily: "RobotoBoldItalic",
									marginTop: "10%",
									marginLeft: "10%",
								}}>
								{this.state.planStrategyName}
							</Text>
							<Text
								style={{
									fontSize: 12,
									fontFamily: "RobotoBoldBold",
									marginTop: 0,
									marginLeft: "10%",
								}}>
								{moment(new Date()).format("MMM Do YY")} -{" "}
								{moment(new Date()).add(7, "days").format("MMM Do YY")}
							</Text>
							<View
								style={{
									height: 5,
									width: "80%",
									backgroundColor: "black",
									marginHorizontal: "10%",
									marginTop: "2%",
								}}></View>
							<ScrollView style={{ marginHorizontal: "10%", marginTop: "2%" }}>
								<View
									style={{
										flexDirection: "row",
										flexWrap: "wrap",
										alignItems: "center",
										marginTop: "5%",
									}}>
									{this.state.keywordsBuddle.map((item, index) => {
										return (
											<View key = {item.id !== undefined ? item.id : `index-${index}`}
												style={{
													height: 25,
													borderRadius: 20,
													backgroundColor: "black",
													justifyContent: "space-between",
													alignItems: "center",
													alignSelf: "center",
													marginBottom: 5,
													marginRight: 5,
													paddingHorizontal: 2,
													flexDirection: "row",
												}}>
												<Text
													style={{
														fontFamily: "RobotoBoldBlack",
														color: "white",
														paddingHorizontal: 20,
														fontSize: 12,
													}}>
													{item.title}
												</Text>
											</View>
										);
									})}
								</View>
							</ScrollView>
						</View>
					</Modal>
					{/* Add Activity Modal */}
					<RNModal
						presentationStyle="overFullScreen"
						transparent={true}
						visible={this.state.isAddingActivityModalVis}
						style={{
							justifyContent: "flex-start",
							alignItems: "center",
							marginTop: "50%",
						}}
						animationType="slide">
						<View
							style={[
								generalStyles.shadowStyle,
								{
									backgroundColor: "white",
									height: 450,
									width: "100%",
									position: "absolute",
									bottom: 0,
									borderRadius: 20,
									alignItems: "center",
									justifyContent: "center",
								},
							]}>
							{firstSlidePanelPage}
							<TouchableOpacity
								style={{
									position: "absolute",
									top: 2,
									flexDirection: "row",
									width: "100%",
									justifyContent: "flex-end",
									paddingHorizontal: 2,
								}}
								onPress={() =>
									this.setState({ isAddingActivityModalVis: false })
								}>
								<AntDesign name="closecircle" size={24} color="black" />
							</TouchableOpacity>
						</View>
					</RNModal>
					{/* Add Keywords Modal */}
					<RNModal
						presentationStyle="overFullScreen"
						transparent={true}
						visible={this.state.isAddingKeywordsModalVis}
						style={{
							justifyContent: "flex-start",
							alignItems: "center",
							marginTop: "50%",
						}}
						animationType="slide">
						<View
							style={[
								generalStyles.shadowStyle,
								{
									backgroundColor: "white",
									height: 450,
									width: "100%",
									position: "absolute",
									bottom: 0,
									borderRadius: 20,
									alignItems: "center",
									justifyContent: "center",
								},
							]}>
							{secondSlidePanelPage}
							<TouchableOpacity
								style={{
									position: "absolute",
									top: 2,
									flexDirection: "row",
									width: "100%",
									justifyContent: "flex-end",
									paddingHorizontal: 2,
								}}
								onPress={() =>
									this.setState({ isAddingKeywordsModalVis: false })
								}>
								<AntDesign name="closecircle" size={24} color="black" />
							</TouchableOpacity>
						</View>
					</RNModal>
					{/* Change plan popup modal */}
					<RNModal
						animationType="slide"
						// propagateSwipe={true}
						visible={this.state.isChangePlanModalVis}
						style={{
							justifyContent: "flex-start",
							alignItems: "center",
							marginTop: "75%",
						}}
						presentationStyle="overFullScreen"
						transparent={true}>
						<View
							style={{
								width: "100%",
								height: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}>
							<View
								style={[
									generalStyles.shadowStyle,
									{
										width: "90%",
										height: "55%",
										borderRadius: 20,
										backgroundColor: "white",
										justifyContent: "flex-start",
										alignItems: "center",
										flexDirection: "column",
									},
								]}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										marginTop: 10,
										width: "95%",
										// marginBottom: 10,
									}}>
									<Text
										style={{
											fontFamily: "RobotoBoldItalic",
											fontSize: 20,
											marginLeft: 10,
										}}>
										Modify Activity
									</Text>
									<TouchableOpacity
										onPress={() => {
											// this.onDailyReportClose();
											this.setState({ isChangePlanModalVis: false });
											// this.reportModalSwiperRef.current.scrollBy(2, true);
										}}>
										<AntDesign name="closecircle" size={24} color="black" />
									</TouchableOpacity>
								</View>
								<View
									style={[
										generalStyles.shadowStyle,
										{
											width: "90%",
											height: 60,
											borderRadius: 20,
											borderColor: "black",
											borderWidth: 1,
											paddingHorizontal: 6,
											flexDirection: "row",
											alignItems: "center",
											justifyContent: "space-between",
											marginTop: 15,
											backgroundColor: "white",
											flexDirection: "column",
											paddingVertical: 6,
											display: this.state.reportDetailInfoVis,
										},
									]}>
									<View
										style={{
											flexDirection: "row",
											justifyContent: "space-between",
											width: "100%",
										}}>
										<Text
											style={{
												fontFamily: "RobotoBoldBold",
												fontSize: 18,
												paddingLeft: 8,
												color: "black",
											}}>
											{this.state.reportTitle}
											{" | "}
											<Text
												style={{
													fontFamily: "RobotoRegular",
													fontSize: 16,
												}}>
												{moment(this.onReportActivity.start)
													.format()
													.slice(5, 10)}
											</Text>
										</Text>
									</View>
									<Text
										style={{
											fontFamily: "RobotoRegular",
											fontSize: 14,
											width: "100%",
											paddingLeft: 8,
										}}>
										{
											moment(this.onReportActivity.start)
												.format("ddd")
												.toUpperCase() +
												" " +
												this.state.reportStart.slice(11, 16) +
												" - " +
												this.state.reportEnd.slice(11, 16)
											// +
											// " | " +
											// this.state.reportDuration +
											// " MIN"
										}
									</Text>
								</View>
								{reportScreen_FIVE}
								{/* <View style={{width:"90%", height:"50%"}}> */}
							</View>
						</View>
					</RNModal>
					{/* Plan Detail View */}
					<RNModal
						animationType="slide"
						visible={this.state.isPlanDetailModalVis}
						// propagateSwipe={true}
						// isVisible={this.state.isPlanDetailModalVis}
						style={{
							justifyContent: "center",
							alignItems: "center",

							// marginBottom: 100,
						}}
						presentationStyle="overFullScreen"
						transparent={true}
						// hasBackdrop={true}
						// backdropOpacity={0}
						// onBackdropPress={() => this.setState({ isPlanDetailModalVis: false })}
						// onSwipeComplete={() => this.setState({ isPlanDetailModalVis: false })}
						// swipeDirection="down"
					>
						<View
							style={{
								alignItems: "center",
								justifyContent: "center",
								width: "100%",
								height: "100%",
							}}>
							<View
								style={[
									generalStyles.shadowStyle,
									{
										height: "90%",
										width: "90%",
										backgroundColor: "white",
										// borderWidth: 2,
										// borderColor: "black",
										// flexDirection: "column",
										justifyContent: "flex-start",
										alignItems: "center",
										borderRadius: 15,
									},
								]}>
								{/* <View
                style={{
                  flex: 0.06,
                  width: "100%",
                  flexDirection: "row",
                  // backgroundColor:RED,

                  justifyContent: "flex-end",
                  alignItems: "flex-start",
                }}
              >
                <View>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({ isPlanDetailModalVis: false })
                    }
                  >
                    <AntDesign name="closecircle" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View> */}
								<View style={{ height: "100%", width: "100%" }}>
									<TouchableOpacity
										style={{
											position: "absolute",
											top: 3,
											right: 3,
											zIndex: 1,
										}}
										onPress={() => {
											this.setState({ isPlanDetailModalVis: false });

											// this.reportModalSwiperRef.current.scrollBy(2, true);
										}}>
										<AntDesign name="closecircle" size={24} color="black" />
									</TouchableOpacity>

									<View
										style={[
											generalStyles.shadowStyle,
											{
												height: "25%",
												width: "100%",
												backgroundColor: "white",
												// borderWidth: 2,
												borderColor: "black",
												borderRadius: 15,
												flexDirection: "column",
												justifyContent: "center",
												alignItems: "center",
											},
										]}>
										<View
											style={[
												generalStyles.shadowStyle,
												{
													flex: 1,
													width: "100%",
													marginTop: 0,
													marginLeft: 0,
													justifyContent: "space-between",
													alignItems: "center",
													flexDirection: "row",
													borderColor: "grey",
													backgroundColor: "white",
													borderRadius: 15,
												},
											]}>
											<View
												style={{
													borderRightWidth: 2,
													width: 100,
													borderColor: "grey",
													height: "50%",
													alignItems: "center",
													justifyContent: "center",
												}}>
												<Text
													style={{
														fontSize: 18,
														fontFamily: "RobotoBoldBlack",
														textAlignVertical: "center",
													}}>
													{WEEKDAY[new Date(this.selectedEventDate).getDay()]}
												</Text>
											</View>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "center",
													height: "100%",
													// backgroundColor: "red",
												}}>
												<Text
													style={{ fontSize: 32, textAlignVertical: "center" }}>
													{ICONS[this.selectedWeatherIcon]}{" "}
												</Text>
												<Text
													style={{
														fontSize: 18,
														fontFamily: "RobotoBoldBlack",
														textAlignVertical: "center",
													}}>
													{this.selectedWeatherTxt}
												</Text>
											</View>
											<View
												style={{
													borderLeftWidth: 2,
													width: 100,
													height: "50%",
													alignItems: "center",
													justifyContent: "center",
													flexDirection: "row",
													borderColor: "grey",
												}}>
												<Text
													style={{
														fontSize: 18,
														fontFamily: "RobotoBoldBlack",
													}}>
													{this.selectedTemp ? `${Math.round(parseFloat(this.selectedTemp))}` : '--'}°F
												</Text>
											</View>
										</View>
										<View
											style={{
												height: "50%",
												paddingHorizontal: 15,
												marginBottom: 10,
												display: this.state.isNoActivitySignVis,
												justifyContent: "center",
												alignItems: "center",
											}}>
											<Text
												style={{
													fontFamily: "RobotoBoldBlack",
													fontSize: 22,
													color: "grey",
													textAlign: "center",
												}}>
												No Activity Planned for This Day
											</Text>
										</View>
										<View
											style={{
												height: "55%",
												paddingHorizontal: 5,
												paddingBottom: 5,
												marginBottom: 5,
												display: this.state.isDetailViewActivityInfoListVis,
												width: "100%",
											}}>
											<FlatList
												data={this.detailViewCalendar}
												contentContainerStyle={{
													alignItems: "center",
													justifyContent: "flex-start",
													paddingHorizontal: 5,
													width: "100%",
													// backgroundColor:"red"
												}}
												renderItem={({ item }) => {
													if (item.title) {
														if (!item.isDeleted) {
															let newTiming = "";
															let timing;
															if (item.newStart2) {
																timing =
																	moment(item.newStart2)
																		.format("ddd")
																		.toUpperCase() +
																	" " +
																	item.newStart2.slice(11, 16) +
																	" - " +
																	item.newEnd2.slice(11, 16) +
																	" | " +
																	item.duration +
																	" MIN";
															} else {
																timing =
																	moment(item.start)
																		.format("ddd")
																		.toUpperCase() +
																	" " +
																	item.start.slice(11, 16) +
																	" - " +
																	item.end.slice(11, 16) +
																	" | " +
																	item.duration +
																	" MIN";
															}
															let itemBlockStyle;
															if (item.newStart) {
																newTiming =
																	item.newStart.slice(11, 16) +
																	" - " +
																	item.newEnd.slice(11, 16) +
																	" | " +
																	item.newDuration +
																	" MIN";
															}

															if (
																!item.isReported &&
																item.isPlanned != "added-activity"
															) {
																itemBlockStyle = this.itemUnreportedBlockStyle(
																	item,
																	timing
																);
															} else {
																if (item.isActivityCompleted) {
																	itemBlockStyle = this.itemCompletedBlockStyle(
																		item,
																		timing
																	);
																} else {
																	if (item.partialStatus) {
																		if (item.partialStatus === "TIME") {
																			itemBlockStyle =
																				this.itemPartialCompleteStyle_TIME(
																					item,
																					timing,
																					newTiming
																				);
																		} else if (
																			item.partialStatus === "ACTIVITY"
																		) {
																			itemBlockStyle =
																				this.itemPartialCompleteStyle_ACTIVITY(
																					item,
																					timing
																				);
																		} else if (item.partialStatus === "NONE") {
																			itemBlockStyle =
																				this.itemUnCompletedBlockStyle(
																					item,
																					timing
																				);
																		} else {
																			itemBlockStyle =
																				this.itemPartialCompleteStyle_TIME_ACTIVITY(
																					item,
																					timing,
																					newTiming
																				);
																		}
																	}
																}
															}

															return itemBlockStyle;
														}
													}

													// console.log("items in plansBuddle", item);
												}}
											/>
										</View>
									</View>
									{/* Calendar View */}
									<View
										style={[
											generalStyles.shadowStyle,
											{
												height: "75%",
												backgroundColor: "white",
												borderRadius: 20,
												marginTop: 15,
												marginBottom: 15,
												paddingVertical: 5,
											},
										]}>
										<Calendar
											events={this.detailViewCalendar}
											date={new Date(this.selectedEventDate)}
											dayHeaderStyle={{ display: "none" }}
											headerContentStyle={{ display: "none" }}
											scrollOffsetMinutes={
												this.detailViewCalendar[0]
													? (parseInt(
															this.detailViewCalendar[0].start.slice(11, 13)
													  ) -
															5) *
													  60
													: 0
											}
											swipeEnabled={false}
											height={90}
											mode="day"
										/>
									</View>
								</View>
							</View>
						</View>
					</RNModal>

					{/* Calendar View & Buttons */}
					<View
						style={{
							width: "100%",
							alignItems: "center",
							display: this.state.displayCalView,
							marginTop: 10,
							backgroundColor: "white",
							marginBottom: 0,
						}}>
						<CalendarHeader height={15} width={450} />
						<View
							style={{
								height: 145,
								width: "100%",
								padding: 4,
								backgroundColor: "white",
								borderRadius: 0,
								borderColor: "#F0F0F0",
								borderTopWidth: 1,
								borderBottomWidth: 1,
								marginBottom: 5,
							}}>
							<ScrollView
								style={{ width: "100%", height: "20%" }}
								ref={this.weeklyCalendarScrollViewRef}>
								<MonthCalendar
									ref={this.monthCalRef}
									thisMonthEvents={this.state.currentMonthEvents}
									monthCalCurrDate={this.state.currentMonthDate}
									weatherThisMonth={this.state.currentWeatherLists}
									onPress={(item, monthNum, month) =>
										this.onPress(item, monthNum, month)
									}
								/>
							</ScrollView>
							<View
								style={{
									position: "absolute",
									right: 5,
									bottom: "5%",
									height: 20,
									width: 20,
									justifyContent: "center",
									alignItems: "center",
									// backgroundColor: "black",
									width: 60,
									height: 20,
									borderRadius: 5,
									flexDirection: "row",
									opacity: 0.5,
								}}>
								<Text
									style={{
										color: "black",
										fontFamily: "RobotoBoldBlack",
										fontSize: 18,
									}}>
									{this.state.currentMonthName}
								</Text>
								<View
									style={{
										width: 2,
										height: "100%",
										backgroundColor: "black",
									}}></View>
							</View>
						</View>

						<View
							style={{
								width: "100%",
								padding: 15,
								flexDirection: "row",
								justifyContent: "space-between",
							}}>
							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "flex-start",
									alignItems: "center",
								}}
								disabled={this.state.pastMonthBtnDisabled}
								onPress={this.pastMonthBtnPressed}>
								<AntDesign name="leftcircle" size={18} color="black" />

								<Text
									style={{
										color: "black",
										fontWeight: "bold",
										fontSize: 12,
										marginLeft: 5,
									}}>
									Past Month
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									borderColor: "black",
									paddingHorizontal: 15,
									borderWidth: 2,
									borderRadius: 20,
									padding: 5,
								}}
								onPress={() => {
									this.scrollToThisWeek();
									this.resetCalendarToCurrentMonth();
								}}>
								<Text
									style={{ color: "black", fontWeight: "bold", fontSize: 12 }}>
									Current Week
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								style={{
									flexDirection: "row",
									justifyContent: "flex-end",
									alignItems: "center",
								}}
								disabled={this.state.nextMonthBtnDisabled}
								onPress={this.nextMonthBtnPressed}>
								<Text
									style={{
										color: "black",
										fontWeight: "bold",
										fontSize: 12,
										marginRight: 5,
									}}>
									Next Month
								</Text>
								<AntDesign name="rightcircle" size={18} color="black" />
							</TouchableOpacity>
						</View>
					</View>
					{/* Guide Tip Modal */}
					<RNModal
						animationType="slide"
						visible={this.state.isGuideVis}
						// propagateSwipe={true}
						// isVisible={this.state.isPlanDetailModalVis}
						style={{
							justifyContent: "center",
							alignItems: "center",

							// marginBottom: 100,
						}}
						presentationStyle="overFullScreen"
						transparent={true}
						// hasBackdrop={true}
						// backdropOpacity={0}
						// onBackdropPress={() => this.setState({ isPlanDetailModalVis: false })}
						// onSwipeComplete={() => this.setState({ isPlanDetailModalVis: false })}
						// swipeDirection="down"
					>
						<View
							style={{
								width: "100%",
								height: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}>
							<View
								style={[
									generalStyles.shadowStyle,
									{
										width: "100%",
										height: "100%",
										// borderRadius: 20,
										backgroundColor: "white",
										justifyContent: "center",
										alignItems: "center",
									},
								]}>
								<TouchableOpacity
									style={{
										position: "absolute",
										top: "5%",
										right: 10,
										zIndex: 1,
									}}
									onPress={() => {
										this.setState({ isGuideVis: false });

										// this.reportModalSwiperRef.current.scrollBy(2, true);
									}}>
									{/* <AntDesign name="closecircle" size={24} color="black" /> */}
									<Text
										style={{
											fontWeight: "bold",
											color: "white",
											fontSize: 18,
										}}>
										SKIP
									</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={{
										position: "absolute",
										bottom: "3%",
										right: 10,
										zIndex: 1,
										display:
											this.state.currentGuideStep === 6 ? "flex" : "none",
									}}
									onPress={() => {
										this.setState({ isGuideVis: false });
										this.setState({ currentGuideStep: 1 });

										// this.reportModalSwiperRef.current.scrollBy(2, true);
									}}>
									{/* <AntDesign name="closecircle" size={24} color="black" /> */}
									<Text
										style={{
											fontWeight: "bold",
											color: "white",
											fontSize: 18,
										}}>
										DONE
									</Text>
								</TouchableOpacity>
								<Swiper
									activeDotColor="white"
									// index={this.state.currentSwipeIndex}
									showsButtons={true}
									autoplay={false}
									loop={false}
									keyboardShouldPersistTaps="handled"
									scrollEnabled={false}
									ref={this.tipModalSwiperRef}
									nextButton={
										<TouchableOpacity
											onPress={() => {
												this.tipModalSwiperRef.current.scrollBy(1, false);
												let currentGuideStep = this.state.currentGuideStep;
												currentGuideStep++;
												this.setState({ currentGuideStep: currentGuideStep });
												console.log(
													"this.state.currentGuideStep",
													this.state.currentGuideStep
												);
											}}>
											<Text
												style={{
													fontWeight: "bold",
													color: "white",
													fontSize: 18,
												}}>
												NEXT
											</Text>
										</TouchableOpacity>
									}
									prevButton={
										<TouchableOpacity
										onPress={() => {
											this.tipModalSwiperRef.current.scrollBy(-1, false);
											let currentGuideStep = this.state.currentGuideStep;
											currentGuideStep--;
											this.setState({ currentGuideStep: currentGuideStep });
											console.log(
												"this.state.currentGuideStep",
												this.state.currentGuideStep
											);
										}}>
											<Text
												style={{
													fontWeight: "bold",
													color: "white",
													fontSize: 18,
												}}>
												PREV
											</Text>
										</TouchableOpacity>
									}
									showsPagination={true}
									buttonWrapperStyle={{
										backgroundColor: "transparent",
										flexDirection: "row",
										position: "absolute",
										// height:20,
										// bottom: 30,
										// left: 0,
										flex: 1,
										paddingBottom: 20,
										paddingHorizontal: 20,
										// paddingVertical: 10,
										justifyContent: "space-between",
										alignItems: "flex-end",
									}}>
									{tip_ONE}
									{tip_TWO}
									{tip_THREE}
									{tip_FOUR}
									{tip_FIVE}
									{tip_FIVE}
								</Swiper>
							</View>
						</View>
					</RNModal>
					{/* Confirmation Page */}
					<View
						style={{
							height: "100%",
							width: "100%",
							backgroundColor: "white",
							display: this.state.conformationPageDisplay,
						}}>
						{finalConfirmationPage}
					</View>
					{/* Body info */}
					<View
						style={[
							generalStyles.shadowStyle,
							{
								height: "100%",
								width: "100%",
								backgroundColor: "white",
								borderRadius: 20,
								paddingTop: 20,
								display: this.state.mainContentSwiperDisplay,
							},
						]}>
						<View
							style={{
								marginBottom: 20,
								display: this.isDataFromTracking ? "flex" : "none",
							}}>
							<View style={{ width: "100%", alignItems: "center" }}>
								<View
									style={{
										width: "90%",
										flexDirection: "row",
										justifyContent: "flex-start",
										alignItems: "center",
									}}>
									<Ionicons
										name="arrow-forward-circle-sharp"
										size={15}
										color="black"
									/>
									<Text
										style={{
											fontFamily: "RobotoBoldItalic",
											fontSize: 18,
											textAlign: "left",
											marginLeft: 5,
										}}>
										Continued Strategy
									</Text>
								</View>
							</View>
							<View style={{ width: "100%", alignItems: "center" }}>
								<View
									style={[
										generalStyles.shadowStyle,
										{
											height: 81,
											width: 335,
											borderColor: GREEN,
											borderWidth: 2,
											borderRadius: 20,
											marginTop: "2%",
											flexDirection: "row",
											backgroundColor: "white",
										},
									]}>
									<TouchableOpacity
										style={{
											height: "100%",
											width: "100%",

											// borderRightColor: "black",
											// borderRightWidth: 2,
											paddingLeft: 0,
											paddingVertical: 0,
											justifyContent: "space-between",
											alignItems: "flex-start",
											flexDirection: "column",
										}}>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "flex-start",
												width: "100%",
												height: "50%",
												borderTopLeftRadius: 18,
												borderTopRightRadius: 18,
												backgroundColor: GREEN,
											}}>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "center",
												}}>
												<Text
													style={{
														fontFamily: "RobotoBoldBlack",
														fontSize: 18,
														marginBottom: 0,
														marginRight: 10,
														alignItems: "center",
														justifyContent: "center",
														marginLeft: "10%",
														color: "white",
														alignSelf: "center",
														textAlign: "center",
													}}>
													{this.planStrategyName}
												</Text>
											</View>
											{/* <View
													style={{
														flexDirection: "column",
														justifyContent: "center",
														// backgroundColor: "red",
														alignItems: "center",
														backgroundColor: "white",
														borderRadius: 20,
														paddingHorizontal: 10,
													}}>
													<Text
														style={{
															fontSize: 12,
															fontFamily: "RobotoBoldBold",
															textAlign: "center",
															marginTop: 0,
															color: GREEN,
														}}>
														{this.state.strategyDuration}
													</Text>
												</View> */}
											<View style={{ position: "absolute", right: 5 }}>
												<FontAwesome5
													name="play-circle"
													size={18}
													color="white"
												/>
											</View>
										</View>
										<ScrollView
											horizontal={true}
											style={{
												width: "100%",
												height: "50%",
												flexDirection: "row",
											}}
											contentContainerStyle={{
												alignItems: "center",
												paddingLeft: "5%",
												paddingRight: "5%",
											}}>
											{this.keywordsBuddle.map((item, index) => {
												return (
													<View key = {item.id !== undefined ? item.id : `index-${index}`}
														style={{
															borderRadius: 20,
															height: 32,
															// backgroundColor: "#E7E7E7",
															marginRight: 2,
															padding: 5,
														}}>
														<Text
															style={{
																color: "black",
																fontWeight: "bold",
																color: "#1AB700",
																fontSize: 13,
															}}>
															# {item.title}
														</Text>
													</View>
												);
											})}
										</ScrollView>
									</TouchableOpacity>
								</View>
							</View>
						</View>
						<Onboarding
							bottomBarHighlight={false}
							ref={this.mainContentSwiperRef}
							showSkip={false}
							showNext={false}
							pageIndexCallback={(index) => {
								// this.panelSwiperRef.current.goToPage(index, true);
								this.pageIndex = index;
								if (index === 0) {
									this.setState({ bottomAddTxt: "Add Activity" });
								} else {
									this.setState({ bottomAddTxt: "Add Keywords" });
								}
							}}
							pages={[
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: planSetUpPage,
								},
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: summaryPage,
								},
							]}
						/>
					</View>
					{/* Slide Up Panel */}
					{/* {slideUpPanel} */}
					{/* Bottom Bar */}
					<View
						style={{
							position: "absolute",
							bottom: 20,
							zIndex: 1,
							width: "100%",
							paddingHorizontal: "5%",
							alignItems: "center",
							justifyContent: "space-between",
							flexDirection: "row",
							display: this.state.bottomBarVis,
						}}>
						<TouchableOpacity
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}
							onPress={() => {
								if (this.pageIndex === 0) {
									this.setState({ isAddingActivityModalVis: true });
								} else {
									this.setState({ isAddingKeywordsModalVis: true });
								}
							}}>
							<Ionicons name="add-circle" size={30} color="black" />
							<Text
								style={{
									fontFamily: "RobotoBoldBlack",
									fontSize: 16,
									marginLeft: 5,
								}}>
								{this.state.bottomAddTxt}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => {
								// this.panelSwiperRef.current.goNext();
								if (this.pageIndex === 1) {
									// this.setState({ panelDisplay: "none" });
									this.setState({ panelHeight: 200 });
									this.setState({ displayCalView: "none" });
									this.setState({ displayTitle: "none" });
									this.setState({ mainContentSwiperDisplay: "none" });
									this.setState({ conformationPageDisplay: "flex" });
									this.setState({ bottomBarVis: "none" });
									// this._panel.show();
								} else if (this.pageIndex === 0) {
									this.setState({ mainContentSwiperDisplay: "flex" });
									this.setState({ conformationPageDisplay: "none" });
									this.mainContentSwiperRef.current.goToPage(1, true);
									this.pageIndex = 1;
									this.setState({ bottomAddTxt: "Add Keywords" });

									this.setState({ panelHeight: 450 });
									// this._panel.hide();
									this.setState({ displayCalView: "flex" });
									this.setState({ displayTitle: "flex" });
									// if (this.pageIndex === 1) {
									// 	this.setState({
									// 		title: (
									// 			<SummarizePlanningStrategy height={28} width={119} />
									// 		),
									// 	});
									// 	this.pageIndex = 1;
									// } else if (this.pageIndex === 0) {
									// 	this.setState({
									// 		title: <PlanActivities height={28} width={150} />,
									// 	});
									// 	// this.mainContentSwiperRef.current.goToPage(1, true);
									// }
								}
							}}
							style={{
								flexDirection: "row",
								justifyContent: "center",
								alignItems: "center",
							}}>
							<Text
								style={{
									fontFamily: "RobotoBoldBlack",
									fontSize: 16,
									marginRight: 5,
								}}>
								Next
							</Text>
							<AntDesign name="rightcircle" size={27} color="black" />
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		);
	}
}
AppRegistry.registerComponent("Planneregy", () => PlanOnCalendar);
