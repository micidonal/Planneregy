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
	// Modal,
} from "react-native";
import { Modal as RNModal } from "react-native";
import * as Font from "expo-font";
// import { TextInput } from 'react-native-paper';

//Load svg files
import PlanActivities from "./assets/svg/planActivities.svg";
import SlidingUpPanelTxt from "./assets/svg/slideUpPanelTxt.svg";
import SlidingUpPanelTxt2 from "./assets/svg/slideUpPanelTxt2.svg";
import AddActivityBtn from "./assets/svg/addActivityBtn.svg";
import SummarizePlanningStrategy from "./assets/svg/Summarize.svg";
import CalendarHeader from "./assets/svg/calendarHeader.svg";
import Indicator from "./assets/svg/indicator.svg";
import BottomIndicator from "./assets/svg/bottomIndicator.svg";
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
import { MaterialIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";

//Load interactive component libraries
import SlidingUpPanel from "rn-sliding-up-panel";
import ModalSelector from "react-native-modal-selector";
import DateTimePicker from "@react-native-community/datetimepicker";
import Popover from "react-native-popover-view";
import Modal from "react-native-modal";
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from "react-native-flash-message";
import { Calendar } from "react-native-big-calendar";
import * as Progress from "react-native-progress";
import SwitchSelector from "react-native-switch-selector";

//Load layout component libraries
import ChipsList from "react-native-expandable-chips-list";
import SelectableChips from "react-native-chip/SelectableChips";
import RemovableChips from "react-native-chip/RemovableChips";
import Onboarding from "react-native-onboarding-swiper";
import Swiper from "react-native-swiper";
import { Badge } from "react-native-ui-lib";

//Load functional libraries
import moment, { min } from "moment";
import * as SecureStore from "expo-secure-store";

//Load from other local components
import { MonthCalendar } from "./Calendar";
import { getDataModel } from "./DataModel";
import { generalStyles } from "./styles/GeneralStyling";
import { timing } from "react-native-reanimated";

Array.prototype.move = function (from, to) {
	this.splice(to, 0, this.splice(from, 1)[0]);
};

let TEST_DATA = [
	"Light Exercise",
	"Moderate Exercise",
	"Intensive Exercise",
	"Morning",
	"Afternoon",
	"Home Workout",
	"Outdoor",
	"Gym",
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
const WEEKDAY_EX = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

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
const REPORTSCREEN_ONE = [
	{ label: "Yes", value: "1" },
	{ label: "I didn't do any activity", value: "2" },
	{ label: "I did it differently", value: "3" },
];

const REPORTSCREEN_TWO = [
	{ label: 1, value: "1" },
	{ label: 2, value: "2" },
	{ label: 3, value: "3" },
	{ label: 4, value: "4" },
	{ label: 5, value: "5" },
	{ label: 6, value: "6" },
	{ label: 7, value: "7" },
];
const REPORTSCREEN_FOUR = [
	{ label: "I did a different activity", value: "Different_Activity" },
	{ label: "I did it at a different time", value: "Different_Time" },
];
const REPORTSCREEN_SEVEN = [
	{ label: "Yes", value: "Yes" },
	{ label: "No", value: "No" },
];
const REPORT_OPTIONS = [
	{ label: "Records", value: "activity" },
	{ label: "Reports", value: "daily" },
	// { label: "Both", value: "both" },
];

const EVALUATIONSCREEN_FOUR = [
	{ label: "Yes, I'll choose a different strategy", value: "Yes" },
	{ label: "No, I'll try this for another week", value: "No" },
];
const EVALUATIONSCREEN_FIVE = [
	{ label: "Yes, I'll retry a previous strategy", value: "Yes" },
	{ label: "No, I'll reset all plans", value: "No" },
];

const GREEN = "#1AB700";
const BLACK = "#393939";
const YELLOW = "#FFB800";
const BLUE = "#579AFF";
const LIGHTBLUE = "#00D4E1";

export class TrackingPage extends React.Component {
	constructor(props) {
		super(props);
		//Load users' basic info from BeforeLoginScreen.js
		this.isFromPlanSetUp = this.props.route.params.isFromPlanSetUp;
		this.userEmail = this.props.route.params.userEmail;
		this.userKey = this.props.route.params.userInfo.key;
		this.userPlans = this.props.route.params.userInfo.userPlans;
		this.userStrategies = this.props.route.params.userStrategies;
		this.userStrategies.sort(function (a, b) {
			return new Date(b.startDate) - new Date(a.startDate);
		});
		// console.log("this.userPlans",this.userPlans);
		// console.log("this.userPlans",this.userKey);
		//Get data model & user strategies
		// this.dataModel = getDataModel();
		// this.dataModel.asyncInit();

		// this.dataModel.loadUserStrategies();
		// this.userStrategies = this.dataModel.getUserStrategies();
		// console.log(" this.userStrategies", this.userStrategies);
		this.currentStrategy;

		this.mainContentSwiperRef = React.createRef();
		this.monthCalRef = React.createRef();
		this.evaluationSwipeRef = React.createRef();
		this.panelSwiperRef = React.createRef();
		this.weeklyCalendarScrollViewRef = React.createRef();
		this.reportModalSwiperRef = React.createRef();
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

		//On Report popup:
		this.onReportActivity = { title: "", start: "", end: "", duration: "" };

		// //Mange the activity list in the self-report activity window
		// this.userAddedActivityList = [];

		this.preList = [];
		this.reportCnt;
		this.isBadgeVis = "flex";
		this.processDailyReports();
		//Determine where the report popup come from
		this.isReportFromPopup = true;
		//Daily report item to be submit
		this.dailyReportItem;
		this.state = {
			date: new Date(),

			title: "Tracking",
			displayTitle: "flex",

			panelHeight: 250,
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
			isDateSelected: false,
			//Selected Date
			selectedDate: new Date(),
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
			keywordsBuddle: [],
			//User defined plan strategy name
			planStrategyName: "",
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
			//Strategy Duration shown on the first panel page
			strategyDuration: "",
			//Report Modal visibility
			isReportModalVis: false,
			//Report Screen Three text input
			reportScreen_THREETxt: "",
			//Current Index of swiper in report modal
			currentSwipeIndex: 0,
			//If the previous btn of report swiper is disabled
			isReportSwipePERVdisabled: true,
			//If Previous btn in the report popup is visible
			isReportSwipePERVvis: "flex",
			//the current page of report swipe
			currentSwipePage: 0,
			//Height of the report modal
			reportModalHeight: "50%",
			//Txt on the report next btn
			reportNEXTbtn: "NEXT",
			//Detail information shown on top of the report window
			reportDetailInfoVis: "flex",
			//The value selected on the first report page
			reportPageONEvalue: "1",
			//user-entered satisfaction score on the second page
			satisfactionScore: "1",
			//The value selected on the 4th report page
			reportPage_FOUR_value: "Different_Activity",
			//Page seven default value
			reportPage_SEVEN_value: "Yes",
			//Activity list on the report popup
			selfReportedActivityList: [],
			//Daily report collections
			preList: this.preList,
			//Daily report collection visibility
			isDailyReportVis: "none",
			//Activity records collection visibility
			isActivityRecordsVis: "flex",
			//report status: check the type of the report user submit
			reportStatus: "default",
			//calendar view height
			calendarViewHeight: 145,
			//hide icon
			hideIcon: <Ionicons name="chevron-down-circle" size={25} color="black" />,
			hideIcon2: (
				<Ionicons name="chevron-down-circle" size={25} color="black" />
			),
			isPanelHided: false,

			//The activity detail information view on the detail popup
			isDetailViewActivityInfoListVis: "flex",
			//Display "No activity" on the detail popup  when there is no planned activity
			isNoActivitySignVis: "none",
			//Report count number shown on the badge
			reportCnt: this.reportCnt,
			//Visibility of the badge
			isBadgeVis: this.isBadgeVis,
			//Report title activity fields
			reportTitle: this.onReportActivity.title,
			reportStart: this.onReportActivity.start,
			reportEnd: this.onReportActivity.end,
			reportDuration: this.onReportActivity.duration,
			reportStartTime: "",
			reportEndTime: "",
			reportActivityName: "",
			dailyReportDate: "",
			//Highlight the selected strategy
			selectedStrategyDate: "",
			//Strategy start date
			monthCalStrategyStartDate: "",
			//Selected strategy
			selectedStrategy: "",
			selectedKeywords: [],
			selectedStrategyPlans: [],
			//Evaluate Panel shown or not
			evaluatePanelDisplay: "none",
			satisfactionScoreEV: "1",
			evaluationPage_FOUR_value: "Yes",
			evaluationPage_FIVE_value: "Yes",
			evaluationPage_Index: 0,
			evaluationNEXTbtnTxt: "NEXT",
			//Guide popup vis
			isGuideVis: false,
			//Value for reloading
			valueForReload:0,
		};
		this.processUserStrategies();
		// this.processDailyReports_after();
		this.dailyReportPopup();
		// console.log("this.state.activityData", this.state.activityData);
	}
	componentDidMount() {
		this.scrollToThisWeek();
		this.dataModel = getDataModel();
		this.dataModel.loadUserStrategies();
		this.dailyReportPopup();
		// this.setState({isBadgeVis:"none"})
		// this.processDailyReports_after();
		// console.log("componentDidMount");
	}
	evaluatePanelPopup = async () => {
		if (this.state.evaluatePanelDisplay === "none") {
			this.setState({ evaluatePanelDisplay: "flex" });
			this.setState({ swipeAblePanelDisplay: "none" });
			await this.setState({ isPanelHided: false });
			await this.setState({
				hideIcon2: (
					<Ionicons name="chevron-down-circle" size={25} color="black" />
				),
			});
			this.setState({ panelHeight: 300 });
			setTimeout(() => {
				this._panel.show();
			});
		} else {
			this.setState({ evaluatePanelDisplay: "none" });
			this.setState({ swipeAblePanelDisplay: "flex" });
		}
	};
	dailyReportPopup = () => {
		// console.log("this.state.preList", this.state.preList);
		let today = moment(new Date()).format().slice(5, 10);
		let reportItem;
		let isActivityPlanned = false;
		let isReportExist = false;
		// console.log("this.state.preList",this.state.preList);
		for (let item of this.state.preList) {
			// console.log("item.start.slice(5, 10)",item.start.slice(5, 10),today);
			if (item.start.slice(5, 10) === today) {
				reportItem = item;
				isReportExist = true;
				if (item.timeStamp) {
					isActivityPlanned = true;
				}
			}
		}
		if (isReportExist) {
			if (isActivityPlanned) {
				console.log("isActivity PLanned");
				setTimeout(() => {
					this.onMyActivityReportPressed(reportItem), 1000;
				});
				this.setState({ isPlanDetailModalVis: false });
			} else {
				console.log("no Activity PLanned");
				this.onDailyPressed(reportItem);
				// this.setState({ isReportModalVis: true });
			}
		}
	};
	//Get previous 5-day's daily reports
	processDailyReports = async() => {

		// console.log("formattedStartDate",formattedStartDate);
		this.preList = [];
		this.reportCnt = 0;
		let todayDate = new Date();
		let dailyReport = {};
		dailyReport.start = moment(todayDate).format().slice(0, 10);
		dailyReport.end = dailyReport.start;
		dailyReport.key = dailyReport.start;
		dailyReport.title = "Daily Report";
		let isReportExist = false;
		let dailyReportEvent;
		let isReportPopup = false;

		for (let event of this.userPlans) {
			if (
				event.start &&
				!event.isDeleted &&
				event.isPlanned != "added-activity"
			) {
				if (event.start.slice(0, 10) === dailyReport.start.slice(0, 10)) {
					// console.log("event",event);
					isReportExist = true;
					if (!event.isReported && !event.isDeleted) {
						isReportPopup = true;
						dailyReportEvent = event;
					}
				}
			}
		}
		if (!isReportExist) {
			//report.date = date;
			this.preList.push(dailyReport);
		} else {
			if (isReportPopup) {
				this.preList.push(dailyReportEvent);
			}
		}

		//this.preList.push(dailyReport);
		// let eventList;
		// if (this.state.plansBuddle) {
		//   eventList = this.state.plansBuddle;
		// }else {
		//   eventList = this.userPlans;
		// }
		let startDate = await SecureStore.getItemAsync("START_DATE");
		let formattedStartDate = new Date(moment(startDate).format("YYYY-MM-DD"));

		for (let i = 1; i <= 5; i++) {
			let preDate = todayDate.setDate(todayDate.getDate() - 1);
			let report = {};
			let date = moment(preDate).format().slice(0, 10);
			let isReportExist = false;
			for (let event of this.userPlans) {
				let eventStartDate = new Date(moment(event.start.slice(0,10)).format("YYYY-MM-DD"));
				if (event.start && eventStartDate>=formattedStartDate) {
					if (
						event.start.slice(0, 10) === date.slice(0, 10) &&
						!event.isDeleted &&
						event.isPlanned != "added-activity"
					) {
						isReportExist = true;
					}
				}
			}
			if (!isReportExist) {
				report.title = "Daily Report";
				report.start = date;
				report.end = report.start;
				report.key = report.start;
				let reportStartDate = new Date(moment(report.start.slice(0,10)).format("YYYY-MM-DD"));
				if (reportStartDate >= formattedStartDate) {
					this.preList.push(report);
				}

			} else {
				for (let event of this.userPlans) {
					if (
						event.start.slice(0, 10) === date &&
						!event.isReported &&
						!event.isDeleted
					) {
						// console.log("push event1", event.title);
						this.preList.push(event);
						// console.log("push event");
					}
				}
			}
		}
		// console.log("this.preList",this.preList);
		this.reportCnt = this.preList.length;
		console.log("this.preList.length",this.preList.length);
		this.setState({ preList: this.preList });
		this.setState({ reportCnt: this.reportCnt });
		if (this.reportCnt != 0) {
			this.isBadgeVis = "flex";
		} else {
			this.isBadgeVis = "none";
		}
		this.setState({isBadgeVis:this.isBadgeVis})

	};
	processDailyReports_after = async () => {
		
		console.log("======processDailyReports_after======");
		// console.log("this.state.plansBuddle",this.state.plansBuddle);
		this.preList = [];
		this.reportCnt = 0;
		let todayDate = new Date();
		let dailyReport = {};
		dailyReport.start = moment(todayDate).format().slice(0, 10);
		dailyReport.end = dailyReport.start;
		dailyReport.key = dailyReport.start;
		dailyReport.title = "Daily Report";
		let isReportExist = false;
		let isReportPopup = false;
		let dailyReportEvent;
		for (let event of this.userPlans) {
			if (
				event.start &&
				!event.isDeleted &&
				event.isPlanned != "added-activity"
			) {
				if (event.start.slice(0, 10) === dailyReport.start.slice(0, 10)) {
					isReportExist = true;
					if (!event.isReported && !event.isDeleted) {
						isReportPopup = true;
						dailyReportEvent = event;
					}
				}
			}
		}
		if (!isReportExist) {
			// console.log("psh wrong report");
			this.preList.push(dailyReport);
			
			console.log("push daily report1", report);
		} else {
			if (isReportPopup) {
				console.log("psh wrong report");

				this.preList.push(dailyReportEvent);
			}
		}

		//this.preList.push(dailyReport);
		// let eventList;
		// if (this.state.plansBuddle) {
		//   eventList = this.state.plansBuddle;
		// }else {
		//   eventList = this.userPlans;
		// }
		
		let startDate = await SecureStore.getItemAsync("START_DATE");
		let formattedStartDate = new Date(moment(startDate).format("YYYY-MM-DD"));
		for (let i = 1; i <= 5; i++) {
			let preDate = todayDate.setDate(todayDate.getDate() - 1);
			let report = {};
			let date = moment(preDate).format().slice(0, 10);
			let isReportExist = false;
			for (let event of this.userPlans) {
				let eventStartDate = new Date(moment(event.start.slice(0,10)).format("YYYY-MM-DD"));
				if (event.start && eventStartDate>=formattedStartDate) {
					if (
						event.start.slice(0, 10) === date.slice(0, 10) &&
						!event.isDeleted &&
						event.isPlanned != "added-activity"
					) {
						isReportExist = true;
					}
				}
			}
			if (!isReportExist) {
				// console.log("this.preList",this.preList);
				report.title = "Daily Report";
				report.start = date;
				report.end = report.start;
				report.key = report.start;
				let reportStartDate = new Date(moment(report.start.slice(0,10)).format("YYYY-MM-DD"));
				if (reportStartDate >= formattedStartDate) {
					this.preList.push(report);
					console.log("push daily report2", report);
				}

			} else {
				console.log("this.state.plansBuddle", this.state.plansBuddle);
				for (let event of this.state.plansBuddle) {
					if (
						event.start.slice(0, 10) === date &&
						!event.isReported &&
						!event.isDeleted
					) {
						this.preList.push(event);
						
					}
				}
			}
		}
		this.reportCnt = this.preList.length;
		this.setState({ preList: this.preList });
		// console.log("preList",this.preList);
		this.setState({ reportCnt: this.reportCnt });
		// console.log("this.reportCnt",this.reportCnt);
		if (this.reportCnt != 0) {
			await this.setState({ isBadgeVis: "flex" });
		} else {
			// console.log("set to none");
			await this.setState({ isBadgeVis: "none" });
		}
		// console.log("this.state.isBadgeVis", this.state.isBadgeVis);

		// console.log("this.state.preList", this.state.preList);
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
	//Process user strategies and get the current one
	processUserStrategies = async () => {
		let startDate = await SecureStore.getItemAsync("START_DATE");
		// console.log("START_DATE",startDate);
		for (let strategy of this.userStrategies) {
			if (strategy.startDate === startDate) {
				this.currentStrategy = strategy;
				this.setState({ planStrategyName: strategy.title });
				this.setState({
					strategyDuration:
						strategy.startDate.slice(5) + " → " + strategy.endDate.slice(5),
				});
				let initKey = 0;
				for (let keyword of strategy.keywords) {
					keyword.key = initKey;
					initKey++;
				}
				this.setState({ keywordsBuddle: strategy.keywords });
				this.setState({ plansBuddle: strategy.plans });
				this.setState({ selectedKeywords: strategy.keywords });
				this.setState({ selectedStrategyPlans: strategy.plans });
			}
		}
		this.setState({
			monthCalStrategyStartDate: this.currentStrategy.startDate,
		});
		this.setState({ selectedStrategy: this.currentStrategy });
		// console.log("this.state.selectedStrategy");
		// console.log("this.state.monthCalStrategyStartDate",this.state.monthCalStrategyStartDate);
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
			// console.log("past month pressed");
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
		// console.log("selectedDay", selectedDay);
		let today = new Date(moment(new Date()).format("YYYY-MM-DD"));

		let endDay = new Date(moment(today).add(7, "days"));
		// console.log("today", "endDay", today, endDay);
		// if (selectedDay > today && selectedDay <= endDay) {
		await this.setState({ selectedDate: selectedDay });
		// console.log("selectedDate", this.state.selectedDate);
		await this.setState({ isDateSelected: true });
		showMessage({
			message: "Date Selected",
			description:
				"The activity will be planned on " + moment(date).format("YYYY-MM-DD"),
			type: "success",
			icon: "success",
		});
		// } else {
		//   showMessage({
		//     message: "Invalid Date",
		//     description: "Please select a date in the next 7 days",
		//     type: "warning",
		//     icon: "warning",
		//   });
		// }
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
			if (this.state.currentSwipeIndex != 8) {
				await this.setState({ reportStart: formattedStart });
			}

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
			if (this.state.currentSwipeIndex != 8) {
				await this.setState({ reportStart: formattedStart });
			}

			await this.setState({ isStartTimeValid: false });
			console.log("formattedStart", formattedStart);
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
		// this.setState({ })
		this.setState({ isEndTimeSelected: true });
		if (date > this.state.startTime) {
			await this.setState({ endTime: date });
			await this.setState({ isStartTimeValid: true });
			await this.setState({ isEndTimeValid: true });

			let formattedEnd = moment(this.state.endTime).format();
			if (this.state.currentSwipeIndex != 8) {
				await this.setState({ reportEnd: formattedEnd });
			}
			// console.log("formattedEnd",formattedEnd);

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
			if (this.state.currentSwipeIndex != 8) {
				await this.setState({ reportEnd: formattedEnd });
			}

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
	onPlanBtnPressed = async () => {
		// if (!(this.state.isStartTimeSelected && this.state.isEndTimeSelected)) {
		//   showMessage({
		//     message: "Please specify the time",
		//     description: "You didn't pick the start or the end time",
		//     type: "warning",
		//     icon: "warning",
		//   });
		//   return;
		// }
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

		let timeStamp = moment(new Date()).format();
		newEvent.timeStamp = timeStamp;

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
		console.log("new event", newEvent);

		let duration = moment.duration(
			moment(formattedEndTime).diff(moment(formattedStartTime))
		);
		let durationMinutes = parseInt(duration.asMinutes()) % 60;

		newEvent.duration = durationMinutes;
		newEvent.activityReminderKey = await this.dataModel.scheduleNotification(
			newEvent
		);

		newEvent.reportReminderKey =
			await this.dataModel.scheduleReportNotification(newEvent);

		if (moment(selectedDate).month() === moment(new Date()).month()) {
			this.combinedEventListThis.push(newEvent);
			this.resetCalendarToCurrentMonth();
		} else {
			this.combinedEventListNext.push(newEvent);
			this.nextMonthBtnPressed();
		}

		let updatedPlanBundle = this.state.plansBuddle;
		updatedPlanBundle.push(newEvent);

		let currentMinutes = this.state.accumulatedMinutes;
		let updatedMinutes = currentMinutes + durationMinutes;
		this.setState({ accumulatedMinutes: updatedMinutes });

		await this.setState({ plansBuddle: updatedPlanBundle });
		console.log(this.state.plansBuddle);

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
			if (event.timeStamp === selectedActivity.timeStamp) {
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
			if (event.timeStamp === selectedActivity.timeStamp) {
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
				if (event.timeStamp === selectedActivity.timeStamp) {
					deleteIndex = this.combinedEventListThis.indexOf(event);
				}
			}
			this.combinedEventListThis.splice(deleteIndex, 1);
			await this.setState({ eventsThisMonth: this.combinedEventListThis });
		} else if (monthNum === this.state.date.getMonth() + 2) {
			let deleteIndex;
			for (let event of this.combinedEventListNext) {
				if (event.timeStamp === selectedActivity.timeStamp) {
					deleteIndex = this.combinedEventListNext.indexOf(event);
				}
			}
			this.combinedEventListNext.splice(deleteIndex, 1);
			await this.setState({ eventsNextMonth: this.combinedEventListNext });
		}

		if (moment(selectedActivity.start).month() === moment(new Date()).month()) {
			this.resetCalendarToCurrentMonth();
		} else {
			this.nextMonthBtnPressed();
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
			if (newKeywordsRow === "") {
				showMessage({
					message: "Invalid Name",
					description: "keywords name can't be empty",
					type: "warning",
					icon: "warning",
				});
				return;
			}
			let newKeywords = { title: newKeywordsRow, type: "USER_DEFINED" };
			this.KeyWordTextInput.clear();
			this.setState({ userDefinedKeywords: "" });
			let updatedKeywordsListFromInput = this.state.keywordsListFromInput;
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
			this.setState({ keywordsListFromInput: updatedKeywordsListFromInput });

			let updatedKeywordsBuddle = [];
			for (let keywords of this.state.keywordsListFromExample) {
				updatedKeywordsBuddle.push(keywords);
			}
			for (let keywords of updatedKeywordsListFromInput) {
				updatedKeywordsBuddle.push(keywords);
			}
			this.setState({ keywordsBuddle: updatedKeywordsBuddle });
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
	//Delete user defined keywords
	deleteKeywords = (item) => {
		let deleteIndex;
		for (let keywords of this.state.keywordsListFromInput) {
			if (keywords.title === item.title) {
				deleteIndex = this.state.keywordsListFromInput.indexOf(keywords);
			}
		}
		let updatedKeywordsListFromInput = this.state.keywordsListFromInput;
		updatedKeywordsListFromInput.splice(deleteIndex, 1);
		this.setState({
			keywordsListFromInput: updatedKeywordsListFromInput,
		});

		let updatedKeywordsBuddle = [];
		for (let keywords of this.state.keywordsListFromInput) {
			updatedKeywordsBuddle.push(keywords);
		}
		for (let keywords of this.state.keywordsListFromExample) {
			updatedKeywordsBuddle.push(keywords);
		}
		this.setState({
			keywordsBuddle: updatedKeywordsBuddle,
		});
	};
	//Modify keywords selected from examples
	onChangeChips = (chips) => {
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
		this.setState({ panelHeight: 500 });
		this._panel.hide();
		this.setState({ displayCalView: "flex" });
		this.setState({ displayTitle: "flex" });
		this.setState({
			title: <SummarizePlanningStrategy height={28} width={119} />,
		});
		this.panelSwiperRef.current.goToPage(1, true);
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
		let timeStamp = moment(new Date()).format();

		let newStrategy = {
			title: this.state.planStrategyName,
			duration: duration,
			keywords: this.state.keywordsBuddle,
			plans: this.state.plansBuddle,
			timeStamp: timeStamp,
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
	};
	//Press the title on calendar
	onPress = (item, monthNum, month) => {
		this.isReportFromPopup = true;
		this.setState({ isDetailViewActivityInfoListVis: "flex" });
		this.setState({ isNoActivitySignVis: "none" });
		console.log("item, monthNum, month", item, monthNum, month);
		let today = new Date();
		let weatherList = [];
		let detailViewCalendar = [];
		let selectedEventDate = new Date(this.today.getFullYear(), monthNum, item);
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
	//Report btn pressed
	onMyActivityReportPressed = async(item) => {

		if (this.isReportFromPopup) {
			for (let event of this.state.plansBuddle) {
				if (event.timeStamp === item.timeStamp) {
					this.onReportActivity = event;
				}
			}
			console.log("isReportFromPopup");
		} else {
			console.log("not ReportFromPopup");
			this.onReportActivity = item;
		}

		// console.log("key",key);

		this.setState({ isReportModalVis: true });
		this.setState({ reportDetailInfoVis: "flex" });
		this.setState({ isReportSwipePERVvis: "flex" });
		this.setState({ reportNEXTbtn: "NEXT" });

		this.setState({ reportTitle: item.title });
		this.setState({ reportStart: item.start });
		this.setState({ reportEnd: item.end });
		this.setState({ reportDuration: item.duration });

		let selectedDay = new Date(
			moment(item.start).add(1, "d").format("YYYY-MM-DD")
		);
		this.setState({ selectedDate: selectedDay });
		this.setState({ dateTimePickerDate: selectedDay });
	};
	//When user pressed the daily report btn
	onDailyPressed = async (item) => {
		let selectedDay = new Date(
			moment(new Date()).add(1, "d").format("YYYY-MM-DD")
		);
		this.setState({ selectedDate: selectedDay });
		this.setState({ dateTimePickerDate: selectedDay });

		this.dailyReportItem = item;
		// console.log("item",item);
		await this.setState({ dailyReportDate: item.start.slice(5) });
		// console.log("this.state.dailyReportDate",this.state.dailyReportDate);
		this.setState({ isReportModalVis: true });
		this.setState({ currentSwipeIndex: 6 });
		this.setState({ currentSwipePage: 6 });
		this.setState({ reportModalHeight: "50%" });
		this.setState({ reportDetailInfoVis: "none" });
		this.setState({ isReportSwipePERVvis: "none" });
		this.setState({ reportNEXTbtn: "NEXT" });
	};
	//Close the daily report window
	onDailyReportClose = () => {
		this.setState({ isReportModalVis: false });
		this.setState({ currentSwipeIndex: 0 });
		this.setState({ currentSwipePage: 0 });
		this.setState({ reportModalHeight: "50%" });
		this.setState({ reportNEXTbtn: "NEXT" });
		this.setState({ isReportSwipePERVvis: "flex" });
		this.setState({ isReportSwipePERVdisabled: true });
		this.setState({ reportPageONEvalue: 1 });
		this.setState({ satisfactionScore: "1" });
		this.setState({ reportPage_FOUR_value: "Different_Activity" });
		this.setState({ reportPage_SEVEN_value: "Yes" });
		this.setState({ reportStatus: "default" });
		this.setState({
			selfReportedActivityList: [],
		});
		this.setState({ reportScreen_THREETxt: "" });
		this.setState({ selectedActivity: "" });
		this.setState({ startTime: new Date(this.today.setHours(8, 0, 0)) });
		this.setState({ startTime: new Date(this.today.setHours(8, 30, 0)) });

		this.isReportFromPopup = true;
	};
	//Add unplanned activity btn pressed
	onAddActivityPressed = () => {
		let selectedDay = new Date(
			moment(new Date()).add(1, "d").format("YYYY-MM-DD")
		);
		this.setState({ selectedDate: selectedDay });
		this.setState({ dateTimePickerDate: selectedDay });

		this.setState({ isReportModalVis: true });
		this.setState({ currentSwipeIndex: 8 });
		this.setState({ currentSwipePage: 8 });
		this.setState({ reportModalHeight: 600 });
		this.setState({ reportDetailInfoVis: "none" });
		this.setState({ isReportSwipePERVvis: "none" });
		this.setState({ reportStatus: "ADD_ACTIVITY" });
		this.setState({ reportNEXTbtn: "SUBMIT" });
	};
	//The previous btn on the report modal pressed
	onReportPrevBtnPressed = () => {
		// let currentSwipePage = this.state.currentSwipePage;
		// this.reportModalSwiperRef.current.scrollBy(-1, true);

		// if (currentSwipePage - 1 === 0) {
		//   this.setState({ currentSwipeIndex: 0 });
		//   this.setState({ isReportSwipePERVdisabled: true });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (currentSwipePage - 1 === 2) {
		//   this.setState({ currentSwipeIndex: 2 });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (currentSwipePage - 1 === 4) {
		//   this.setState({ currentSwipeIndex: 4 });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (currentSwipePage - 1 === 5) {
		//   this.setState({ currentSwipeIndex: 5 });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (currentSwipePage - 1 === 6) {
		//   this.setState({ currentSwipeIndex: 6 });
		//   this.setState({ reportModalHeight: "50%" });
		//   this.setState({ reportNEXTbtn: "NEXT" });

		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// }
		// currentSwipePage--;
		// this.setState({ currentSwipePage: currentSwipePage });
		let currentSwipePage = this.state.currentSwipePage;
		// this.reportModalSwiperRef.current.scrollBy(-1, true);
		console.log("currentSwipePage", currentSwipePage);
		if (currentSwipePage === 1) {
			this.setState({ currentSwipeIndex: 0 });
			this.setState({ currentSwipePage: 0 });
			this.reportModalSwiperRef.current.scrollBy(-1, true);
			this.setState({ isReportSwipePERVdisabled: true });
			this.setState({ isReportModalVis: false });
			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else if (currentSwipePage === 2) {
			this.setState({ currentSwipeIndex: 0 });
			this.setState({ currentSwipePage: 0 });
			this.setState({ isReportSwipePERVdisabled: true });

			this.setState({ reportNEXTbtn: "NEXT" });
			this.reportModalSwiperRef.current.scrollBy(-1, true);
			this.setState({ isReportModalVis: false });

			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else if (currentSwipePage === 3) {
			this.setState({ currentSwipeIndex: 2 });
			this.setState({ currentSwipePage: 2 });
			this.reportModalSwiperRef.current.scrollBy(-1, true);
			this.setState({ isReportModalVis: false });

			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else if (currentSwipePage === 4) {
			this.setState({ currentSwipeIndex: 2 });
			this.setState({ currentSwipePage: 2 });
			this.reportModalSwiperRef.current.scrollBy(-2, true);
			this.setState({ reportModalHeight: "50%" });

			this.setState({ isReportModalVis: false });
			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else if (currentSwipePage === 5) {
			this.setState({ currentSwipeIndex: 3 });
			this.setState({ currentSwipePage: 3 });
			this.reportModalSwiperRef.current.scrollBy(-2, true);

			this.setState({ isReportModalVis: false });
			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else if (currentSwipePage === 7) {
			this.setState({ currentSwipeIndex: 4 });
			this.setState({ currentSwipePage: 4 });
			this.reportModalSwiperRef.current.scrollBy(-3, true);
			this.setState({ isReportModalVis: false });
			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else if (currentSwipePage === 8) {
			console.log("currentSwipePage7");
			this.setState({ isReportModalVis: false });
			this.setState({ reportNEXTbtn: "NEXT" });
			this.setState({ reportModalHeight: "50%" });
			if (this.state.reportModalHeight === 600) {
				this.setState({ currentSwipeIndex: 6 });
				this.setState({ currentSwipePage: 6 });
				this.reportModalSwiperRef.current.scrollBy(-1, true);
				this.setState({ isReportSwipePERVvis: "none" });
				this.setState({ isReportSwipePERVdisabled: true });
				this.setState({ reportModalHeight: "50%" });
			} else {
				if (this.state.reportPageONEvalue == 1) {
					this.setState({ currentSwipeIndex: 1 });
					this.setState({ currentSwipePage: 1 });
					this.reportModalSwiperRef.current.scrollBy(-6, true);
				} else if (this.state.reportPageONEvalue == 3) {
					// if (this.state.reportPage_FOUR_value == "Different_Activity") {
					//   this.setState({ currentSwipeIndex: 5 });
					//   this.setState({ currentSwipePage: 5 });
					//   this.reportModalSwiperRef.current.scrollBy(-2, true);
					// } else {
					this.setState({ reportModalHeight: 500 });
					this.setState({ currentSwipeIndex: 7 });
					this.setState({ currentSwipePage: 7 });
					this.reportModalSwiperRef.current.scrollBy(-1, true);
					// }
				}
			}

			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		}
		// currentSwipePage--;
		// this.setState({ currentSwipePage: currentSwipePage });
	};
	//The next btn on the report modal pressed
	onReportNextBtnPressed = async () => {
		//this.state.currentSwipePage refers to the current page's index
		// if (this.state.currentSwipePage === 0) {
		//   this.setState({ isReportSwipePERVdisabled: false });
		//   this.reportModalSwiperRef.current.scrollBy(1, true);
		// } else if (this.state.currentSwipePage === 1) {
		//   this.setState({ currentSwipeIndex: 2 });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (this.state.currentSwipePage === 3) {
		//   this.setState({ currentSwipeIndex: 4 });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (this.state.currentSwipePage === 4) {
		//   this.setState({ currentSwipeIndex: 5 });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (this.state.currentSwipePage === 6) {
		//   this.setState({ currentSwipeIndex: 7 });
		//   this.setState({ reportModalHeight: "90%" });
		//   this.setState({ isReportModalVis: false });
		//   this.setState({ reportNEXTbtn: "SUBMIT" });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else {
		//   this.reportModalSwiperRef.current.scrollBy(1, true);
		// }
		// let currentSwipePage = this.state.currentSwipePage;
		// currentSwipePage++;
		// this.setState({ currentSwipePage: currentSwipePage });

		//this.state.currentSwipePage refers to the current page's index
		// console.log("this.state.reportPageONEvalue", this.state.reportPageONEvalue);
		let currentSwipePage = this.state.currentSwipePage;

		if (this.state.currentSwipePage === 0) {
			this.setState({ isReportSwipePERVdisabled: false });

			if (this.state.reportPageONEvalue == 1) {
				this.reportModalSwiperRef.current.scrollBy(1, true);
				currentSwipePage++;
				this.setState({ currentSwipeIndex: 1 });
				this.setState({ isReportModalVis: false });
				setTimeout(() => {
					this.setState({ isReportModalVis: true }), 1000;
				});
			} else if (this.state.reportPageONEvalue == 2) {
				this.reportModalSwiperRef.current.scrollBy(2, true);

				currentSwipePage = currentSwipePage + 2;
				this.setState({ currentSwipeIndex: 2 });
				this.setState({ isReportModalVis: false });
				this.setState({ reportNEXTbtn: "SUBMIT" });
				setTimeout(() => {
					this.setState({ isReportModalVis: true }), 1000;
				});
			} else if (this.state.reportPageONEvalue == 3) {
				this.reportModalSwiperRef.current.scrollBy(2, true);

				currentSwipePage = currentSwipePage + 2;
				this.setState({ currentSwipeIndex: 2 });
				this.setState({ isReportModalVis: false });
				this.setState({ reportNEXTbtn: "NEXT" });
				setTimeout(() => {
					this.setState({ isReportModalVis: true }), 1000;
				});
			}
		} else if (this.state.currentSwipePage === 1) {
			currentSwipePage = currentSwipePage + 7;
			this.setState({ currentSwipeIndex: 8 });
			this.setState({ reportModalHeight: 670 });
			this.setState({ isReportModalVis: false });
			this.setState({ reportStatus: "COMPLETE" });
			this.setState({ reportNEXTbtn: "SUBMIT" });
			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else if (this.state.currentSwipePage === 2) {
			if (this.state.reportNEXTbtn === "SUBMIT") {
				console.log("SUBMIT FUNCTION HERE: NO ACTIVITY");
				this.onSubmitPressed_NoActivity();
			} else {
				console.log("set activity name");
				this.reportModalSwiperRef.current.scrollBy(1, true);
				currentSwipePage = currentSwipePage + 2;
				this.setState({ currentSwipeIndex: 4 });
				this.setState({ reportModalHeight: 500 });
				this.setState({ isReportModalVis: false });
				await this.setState({
					startTime: new Date(this.onReportActivity.start),
				});
				await this.setState({ endTime: new Date(this.onReportActivity.end) });
				await this.setState({ selectedActivity: this.onReportActivity.title });
				console.log("this.state.selectedActivity", this.state.selectedActivity);
				setTimeout(() => {
					this.setState({ isReportModalVis: true }), 1000;
				});
			}
		} else if (this.state.currentSwipePage === 3) {
			if (this.state.reportPage_FOUR_value == "Different_Activity") {
				// console.log("Different_Activity");
				this.reportModalSwiperRef.current.scrollBy(2, true);

				currentSwipePage = currentSwipePage + 2;
				this.setState({ currentSwipeIndex: 5 });
				this.setState({ isReportModalVis: false });
				setTimeout(() => {
					this.setState({ isReportModalVis: true }), 1000;
				});
			} else {
				// console.log("Different_TIME");
				this.reportModalSwiperRef.current.scrollBy(1, true);
				this.setState({ reportModalHeight: 500 });
				currentSwipePage = currentSwipePage + 1;
				this.setState({ currentSwipeIndex: 4 });
				this.setState({ isReportModalVis: false });
				setTimeout(() => {
					this.setState({ isReportModalVis: true }), 1000;
				});
			}
		} else if (this.state.currentSwipePage === 4) {
			this.reportModalSwiperRef.current.scrollBy(3, true);
			currentSwipePage = currentSwipePage + 3;
			this.setState({ currentSwipeIndex: 7 });
			this.setState({ reportStartTime: this.state.startTime });
			this.setState({ reportEndTime: this.state.endTime });
			this.setState({ reportActivityName: this.state.selectedActivity });
			this.setState({ reportNEXTbtn: "NEXT" });
			this.setState({ reportStatus: "PARTIALLY_COMPLETE_TIME" });
			this.setState({ isReportModalVis: false });
			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else if (this.state.currentSwipePage === 5) {
			this.reportModalSwiperRef.current.scrollBy(2, true);
			currentSwipePage = currentSwipePage + 2;
			this.setState({ currentSwipeIndex: 7 });
			this.setState({ reportModalHeight: 670 });
			this.setState({ reportNEXTbtn: "SUBMIT" });
			this.setState({ reportStatus: "PARTIALLY_COMPLETE_ACTIVITY" });
			this.setState({ isReportModalVis: false });
			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else if (this.state.currentSwipePage === 6) {
			if (this.state.reportPage_SEVEN_value == "Yes") {
				this.reportModalSwiperRef.current.scrollBy(2, true);
				currentSwipePage = currentSwipePage + 2;
				this.setState({ currentSwipeIndex: 8 });
				this.setState({ reportModalHeight: 600 });
				this.setState({ reportNEXTbtn: "SUBMIT" });
				this.setState({ isReportSwipePERVvis: "flex" });
				this.setState({ isReportSwipePERVdisabled: false });
				this.setState({ isReportModalVis: false });
				setTimeout(() => {
					this.setState({ isReportModalVis: true }), 1000;
				});
			} else {
				this.setState({ reportNEXTbtn: "SUBMIT" });
				this.onSubmitDailyReport_NoActivity();
				console.log("SUBMIT FUNCTION HERE");
			}
		} else if (this.state.currentSwipePage === 7) {
			this.reportModalSwiperRef.current.scrollBy(1, true);
			currentSwipePage = currentSwipePage + 1;
			this.setState({ currentSwipeIndex: 8 });
			this.setState({ reportNEXTbtn: "SUBMIT" });
			this.setState({ reportStatus: "PARTIALLY_COMPLETE_TIME" });
			this.setState({ reportModalHeight: 670 });
			this.setState({ isReportModalVis: false });
			setTimeout(() => {
				this.setState({ isReportModalVis: true }), 1000;
			});
		} else {
			if (this.state.reportStatus == "ADD_ACTIVITY") {
				this.onSubmitPressed_UserAddedActivity();
				this.onDailyReportClose();
			} else if (this.state.reportStatus == "COMPLETE") {
				this.onSubmitPressed_CompleteActivity();
			} else if (
				this.state.reportStatus == "PARTIALLY_COMPLETE_ACTIVITY" ||
				this.state.reportStatus == "PARTIALLY_COMPLETE_TIME"
			) {
				this.OnSubmitPressed_PartiallyComplete();
			} else {
				this.onSubmitPressed_UserAddedActivity();
				this.onDailyReportClose();
			}
		}
		// } else if (this.state.currentSwipePage === 1) {
		//   this.setState({ currentSwipeIndex: 2 });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (this.state.currentSwipePage === 3) {
		//   this.setState({ currentSwipeIndex: 4 });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (this.state.currentSwipePage === 4) {
		//   this.setState({ currentSwipeIndex: 5 });
		//   this.setState({ isReportModalVis: false });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else if (this.state.currentSwipePage === 6) {
		//   this.setState({ currentSwipeIndex: 7 });
		//   this.setState({ reportModalHeight: "90%" });
		//   this.setState({ isReportModalVis: false });
		//   this.setState({ reportNEXTbtn: "SUBMIT" });
		//   setTimeout(() => {
		//     this.setState({ isReportModalVis: true }), 1000;
		//   });
		// } else {
		//   this.reportModalSwiperRef.current.scrollBy(1, true);
		// }

		this.setState({ currentSwipePage: currentSwipePage });
	};

	//Pressed the btn of the self-added activity report popup
	onPlanBtnPressed_reportScreen = async () => {
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
		let selectedDate = this.state.selectedDate;
		let startTimeMinutes = moment(this.state.startTime).format("HH:mm:ss");
		let endTimeMinutes = moment(this.state.endTime).format("HH:mm:ss");
		console.log("selectedDate on pressed", selectedDate);
		let formattedDate;
		if (this.state.isDateSelected) {
			formattedDate = moment(selectedDate).add(1, "days").format().slice(0, 11);
		} else {
			formattedDate = moment(selectedDate).format().slice(0, 11);
		}

		console.log("formattedDate on pressed", formattedDate);
		let formattedStartTime = formattedDate + startTimeMinutes;
		let formattedEndTime = formattedDate + endTimeMinutes;
		let activityName = this.state.selectedActivity;

		let newEvent = {
			start: formattedStartTime,
			end: formattedEndTime,
			id: formattedStartTime + formattedEndTime,
			isPlanned: "added-activity",
			isReported: false,
			isCompleted: false,
			isDeleted: false,
			color: "blue",
			title: activityName,
		};

		let timeStamp = moment(new Date()).format();
		newEvent.timeStamp = timeStamp;

		let weatherList = [];

		if (moment(selectedDate).month() === moment(new Date()).month()) {
			weatherList = this.thisMonthWeather;
		} else {
			weatherList = this.nextMonthWeather;
		}
		for (let weather of weatherList) {
			if (weather.date === moment(selectedDate).date()) {
				newEvent.weather = weather.text;
				newEvent.temp = weather.temp;
			}
		}
		console.log("new event", newEvent);

		let duration = moment.duration(
			moment(formattedEndTime).diff(moment(formattedStartTime))
		);
		let durationMinutes = parseInt(duration.asMinutes()) % 60;

		newEvent.duration = durationMinutes;
		let updatedAdditionalActivityList = this.state.selfReportedActivityList;
		updatedAdditionalActivityList.push(newEvent);
		await this.setState({
			selfReportedActivityList: updatedAdditionalActivityList,
		});
		await this.setState({ isDateSelected: false });
		await this.setState({ selectedDate: new Date() });
	};
	//Delete the selected activity and update it on Firebase
	deleteActivity_reportScreen = async (selectedActivity) => {
		for (let event of this.state.selfReportedActivityList) {
			if (event.timeStamp === selectedActivity.timeStamp) {
				// deleteIndexInPlansBuddle = this.state.plansBuddle.indexOf(event);
				event.isDeleted = true;
			}
		}

		let updatedUserReportedActivityBuddle = this.state.selfReportedActivityList;
		await this.setState({
			selfReportedActivityList: updatedUserReportedActivityBuddle,
		});
		selectedActivity.isDeleted = true;
	};
	//Submit the report when no activity performed
	onSubmitDailyReport_NoActivity = async () => {
		this.setState({ isReportModalVis: false });
		let itemToSubmit = this.dailyReportItem;
		itemToSubmit.isReported = true;
		let formattedSelectedMonth = parseInt(
			moment(itemToSubmit.start).format().slice(5, 7)
		);
		this.userPlans.push(itemToSubmit);
		this.processDailyReports_after();
		let formattedThisMonth = parseInt(moment(new Date()).format().slice(5, 7));
		if (formattedSelectedMonth === formattedThisMonth) {
			this.combinedEventListThis.push(itemToSubmit);
		} else {
			this.combinedEventListLast.push(itemToSubmit);
		}
		await this.dataModel.createNewPlan(this.userKey, itemToSubmit);
		this.onDailyReportClose();
		let eventDate = new Date(itemToSubmit.start);
		await this.setState({ selectedDateRaw: eventDate });
		await this.setState({
			currentMonthDate: this.state.selectedDateRaw,
		});
		this.scrollToThisWeek();

		this.onDailyReportClose();
	};
	//Submit the user added activities
	onSubmitPressed_UserAddedActivity = async () => {
		this.setState({ isReportModalVis: false });
		for (let event of this.state.selfReportedActivityList) {
			event.isReported = true;
			await this.dataModel.createNewPlan(this.userKey, event);
			if (moment(event.start).month() === moment(new Date()).month()) {
				this.combinedEventListThis.push(event);
				this.resetCalendarToCurrentMonth();
			} else {
				this.combinedEventListLast.push(event);
				this.pastMonthBtnPressed();
			}
		}
	};
	//Submit the completed activity
	onSubmitPressed_CompleteActivity = async () => {
		console.log("==================onSubmitPressed_CompleteActivity==================");
		// console.log("this.onReportActivity",this.onReportActivity);
		this.setState({ isReportModalVis: false });
		// await this.onSubmitPressed_UserAddedActivity();

		let eventToUpdate = this.onReportActivity;
		eventToUpdate.isActivityCompleted = true;
		eventToUpdate.isReported = true;
		eventToUpdate.satisfactionScore = this.state.satisfactionScore;
		this.onSubmitPressed_UserAddedActivity();

		let formattedThisMonth = parseInt(moment(new Date()).format().slice(5, 7));
		let formattedSelectedMonth = parseInt(
			moment(eventToUpdate.start).format().slice(5, 7)
		);

		let eventDate = new Date(eventToUpdate.start);
		await this.setState({ selectedDateRaw: eventDate });

		let eventToUpdateToFirebaseActivities;
		// console.log("this.combinedEventListThis",this.combinedEventListThis);

		if (formattedSelectedMonth === formattedThisMonth) {
			for (let event of this.combinedEventListThis) {
				if (event.timeStamp) {
					if (event.timeStamp === eventToUpdate.timeStamp) {
						// console.log("event from this.combinedEventListThis", event);
						event.isActivityCompleted = true;
						event.isReported = true;
						event.satisfactionScore = this.state.satisfactionScore;
						eventToUpdateToFirebaseActivities = event;
					}
				}
			}
			await this.resetCalendarToCurrentMonth();
			await this.setState({
				currentMonthDate: this.state.selectedDateRaw,
			});
			this.scrollToThisWeek();
		} else {
			for (let event of this.combinedEventListLast) {
				if (event.timeStamp) {
					if (event.timeStamp === eventToUpdate.timeStamp) {
						event.isActivityCompleted = true;
						event.isReported = true;
						eventToUpdateToFirebaseActivities = event;
					}
				}
			}
			await this.lastMonthEventReported(this.state.selectedDateRaw);
			this.scrollToThisWeek();
		}

		let strategyToUpdate = this.currentStrategy;
		// console.log("this.currentStrategy.plans", this.currentStrategy.plans);
		// console.log("this.userKey",this.userKey);
		if (this.isFromPlanSetUp) {
			let key = await this.dataModel.getActivityKey(this.userKey, eventToUpdateToFirebaseActivities);
			eventToUpdateToFirebaseActivities.key = key;
		}

		console.log("eventToUpdateToFirebaseActivities",eventToUpdateToFirebaseActivities);
		console.log("==================onSubmitPressed_CompleteActivity==================");

		await this.dataModel.updatePlan(
			this.userKey,
			eventToUpdateToFirebaseActivities
		);
		await this.dataModel.loadUserPlans(this.userKey);
		this.userPlans = this.dataModel.getUserPlans();

		await this.dataModel.updateStrategy(this.userKey, strategyToUpdate);
		await this.dataModel.loadUserStrategies(this.userKey);
		this.userStrategies = this.dataModel.getUserStrategies();
		this.onDailyReportClose();
		this.processDailyReports_after();
	};
	//Submit uncompleted activity
	onSubmitPressed_NoActivity = async () => {
		this.setState({ isReportModalVis: false });
		// await this.onSubmitPressed_UserAddedActivity();

		let eventToUpdate = this.onReportActivity;
		let reason = this.state.reportScreen_THREETxt;
		eventToUpdate.isActivityCompleted = false;
		eventToUpdate.reason = reason;
		eventToUpdate.isReported = true;
		eventToUpdate.partialStatus = "NONE";
		// eventToUpdate.satisfactionScore = this.state.satisfactionScore;
		this.onSubmitPressed_UserAddedActivity();

		let formattedThisMonth = parseInt(moment(new Date()).format().slice(5, 7));
		let formattedSelectedMonth = parseInt(
			moment(eventToUpdate.start).format().slice(5, 7)
		);

		let eventDate = new Date(eventToUpdate.start);
		await this.setState({ selectedDateRaw: eventDate });

		let eventToUpdateToFirebaseActivities;

		if (formattedSelectedMonth === formattedThisMonth) {
			for (let event of this.combinedEventListThis) {
				if (event.timeStamp) {
					if (event.timeStamp === eventToUpdate.timeStamp) {
						// console.log("event from this.combinedEventListThis", event);
						event.isActivityCompleted = false;
						event.isReported = true;
						event.reason = reason;
						event.partialStatus = "NONE";
						eventToUpdateToFirebaseActivities = event;
					}
				}
			}
			await this.resetCalendarToCurrentMonth();
			await this.setState({
				currentMonthDate: this.state.selectedDateRaw,
			});
			this.scrollToThisWeek();
		} else {
			for (let event of this.combinedEventListLast) {
				if (event.timeStamp) {
					if (event.timeStamp === eventToUpdate.timeStamp) {
						event.isActivityCompleted = false;
						event.isReported = true;
						event.reason = reason;
						event.partialStatus = "NONE";
						eventToUpdateToFirebaseActivities = event;
					}
				}
			}
			await this.lastMonthEventReported(this.state.selectedDateRaw);
			this.onDailyReportClose();
			this.scrollToThisWeek();
		}

		let strategyToUpdate = this.currentStrategy;
		// console.log("this.currentStrategy.plans", this.currentStrategy.plans);
		if (this.isFromPlanSetUp) {
			let key = await this.dataModel.getActivityKey(this.userKey, eventToUpdateToFirebaseActivities);
			eventToUpdateToFirebaseActivities.key = key;
		}
		await this.dataModel.updatePlan(
			this.userKey,
			eventToUpdateToFirebaseActivities
		);
		await this.dataModel.loadUserPlans(this.userKey);
		this.userPlans = this.dataModel.getUserPlans();

		await this.dataModel.updateStrategy(this.userKey, strategyToUpdate);
		await this.dataModel.loadUserStrategies(this.userKey);
		this.userStrategies = this.dataModel.getUserStrategies();
		this.processDailyReports_after();
	};
	//Submit the report when the activity is partially completed
	OnSubmitPressed_PartiallyComplete = async () => {
		this.setState({ isReportModalVis: false });
		// await this.onSubmitPressed_UserAddedActivity();
		this.onSubmitPressed_UserAddedActivity();
		let eventToUpdate = this.onReportActivity;
		eventToUpdate.satisfactionScore = this.state.satisfactionScore;
		let newActivity = Object.assign({}, this.onReportActivity);
		newActivity.satisfactionScore = this.state.satisfactionScore;
		let eventToUpdateToFirebaseActivities;

		let reason = this.state.reportScreen_THREETxt;
		let formattedSelectedMonth = parseInt(
			moment(eventToUpdate.start).format().slice(5, 7)
		);
		let formattedThisMonth = parseInt(moment(new Date()).format().slice(5, 7));
		let eventDate = new Date(eventToUpdate.start);
		await this.setState({ selectedDateRaw: eventDate });

		let reportStatus;
		let formattedStart = moment(this.state.reportStartTime)
			.format()
			.slice(11, 16);
		let formattedEnd = moment(this.state.reportEndTime).format().slice(11, 16);
		if (
			formattedStart === this.onReportActivity.start.slice(11, 16) &&
			formattedEnd === this.onReportActivity.end.slice(11, 16)
		) {
			reportStatus = "PARTIALLY_COMPLETE_ACTIVITY";
		} else {
			reportStatus = "PARTIALLY_COMPLETE_TIME";
		}
		// console.log("reportStatus", reportStatus);
		// console.log("this.state.selectedActivity", this.state.selectedActivity);

		if (reportStatus === "PARTIALLY_COMPLETE_TIME") {
			// Add a new partially completed activity

			newActivity.isActivityCompleted = false;
			newActivity.isReported = true;
			newActivity.isOtherActivity = true;
			newActivity.timeStamp = eventToUpdate.timeStamp + "PARTIAL_NEW";
			let startTimeMinutes = moment(this.state.reportStartTime).format(
				"HH:mm:ss"
			);
			let endTimeMinutes = moment(this.state.reportEndTime).format("HH:mm:ss");
			let formattedDate = this.onReportActivity.start.slice(0, 11);

			let formattedStartTime = formattedDate + startTimeMinutes;
			let formattedEndTime = formattedDate + endTimeMinutes;
			newActivity.newStart2 = newActivity.start;
			newActivity.newEnd2 = newActivity.end;
			console.log("newActivity.newStart2", newActivity.newStart2);
			newActivity.start = formattedStartTime;
			newActivity.end = formattedEndTime;

			newActivity.title = this.state.reportActivityName;
			newActivity.reason = reason;

			if (formattedSelectedMonth === formattedThisMonth) {
				this.combinedEventListThis.push(newActivity);
			} else {
				this.combinedEventListLast.push(newActivity);
			}

			//Update the original event
			eventToUpdate.isActivityCompleted = false;
			eventToUpdate.isOtherActivity = false;
			eventToUpdate.reason = reason;
			eventToUpdate.isReported = true;
			if (this.state.reportActivityName === this.onReportActivity.title) {
				eventToUpdate.partialStatus = "TIME";
				newActivity.partialStatus = "TIME";
			} else {
				eventToUpdate.partialStatus = "TIME_AND_ACTIVITY";
				let oldTitle = eventToUpdate.title;
				eventToUpdate.oldTitle = oldTitle;
				eventToUpdate.title = this.state.reportActivityName;
				newActivity.partialStatus = "TIME_AND_ACTIVITY";
				newActivity.oldTitle = oldTitle;
			}

			eventToUpdate.newStart = formattedStartTime;
			eventToUpdate.newEnd = formattedEndTime;
			newActivity.newStart = formattedStartTime;
			newActivity.newEnd = formattedEndTime;

			let duration = moment.duration(
				moment(formattedEndTime).diff(moment(formattedStartTime))
			);
			let durationMinutes = parseInt(duration.asMinutes()) % 60;
			eventToUpdate.newDuration = durationMinutes;
			newActivity.newDuration = durationMinutes;
			await this.dataModel.createNewPlan(this.userKey, newActivity);
			// let eventToUpdateToFirebaseActivities;
			if (formattedSelectedMonth === formattedThisMonth) {
				for (let event of this.combinedEventListThis) {
					if (event.timeStamp) {
						if (event.timeStamp === eventToUpdate.timeStamp) {
							// console.log("event from this.combinedEventListThis", event);
							event.isActivityCompleted = false;
							event.isReported = true;
							event.isOtherActivity = false;
							event.reason = reason;
							event.satisfactionScore = this.state.satisfactionScore;
							eventToUpdateToFirebaseActivities = event;
						}
					}
				}
				await this.resetCalendarToCurrentMonth();
				await this.setState({
					currentMonthDate: this.state.selectedDateRaw,
				});
				this.onDailyReportClose();

				this.scrollToThisWeek();
			} else {
				for (let event of this.combinedEventListLast) {
					if (event.timeStamp) {
						if (event.timeStamp === eventToUpdate.timeStamp) {
							event.isActivityCompleted = false;
							event.isReported = true;
							event.isOtherActivity = false;
							event.reason = reason;
							event.satisfactionScore = this.state.satisfactionScore;
							eventToUpdateToFirebaseActivities = event;
						}
					}
				}
				await this.lastMonthEventReported(this.state.selectedDateRaw);
				this.scrollToThisWeek();
			}

			// console.log("formattedStartTime",formattedStartTime);
			// console.log("formattedEndTime",formattedEndTime);
		} else if (reportStatus === "PARTIALLY_COMPLETE_ACTIVITY") {
			let activityName = this.state.reportActivityName;

			eventToUpdate.isActivityCompleted = false;
			eventToUpdate.reason = reason;
			eventToUpdate.isReported = true;
			eventToUpdate.partialStatus = "ACTIVITY";
			eventToUpdate.oldTitle = eventToUpdate.title;
			eventToUpdate.title = activityName;

			if (formattedSelectedMonth === formattedThisMonth) {
				for (let event of this.combinedEventListThis) {
					if (event.timeStamp) {
						if (event.timeStamp === eventToUpdate.timeStamp) {
							// console.log("event from this.combinedEventListThis", event);
							event.isActivityCompleted = false;
							event.partialStatus = "ACTIVITY";
							event.isReported = true;
							event.isOtherActivity = true;
							event.reason = reason;
							event.oldTitle = event.title;
							event.title = activityName;
							event.satisfactionScore = this.state.satisfactionScore;
							eventToUpdateToFirebaseActivities = event;
						}
					}
				}
				await this.resetCalendarToCurrentMonth();
				await this.setState({
					currentMonthDate: this.state.selectedDateRaw,
				});
				this.scrollToThisWeek();
			} else {
				for (let event of this.combinedEventListLast) {
					if (event.timeStamp) {
						if (event.timeStamp === eventToUpdate.timeStamp) {
							event.isActivityCompleted = false;
							event.partialStatus = "ACTIVITY";
							event.isReported = true;
							event.isOtherActivity = true;
							event.reason = reason;
							event.oldTitle = event.title;
							event.title = activityName;
							eventToUpdateToFirebaseActivities = event;
						}
					}
				}
				await this.lastMonthEventReported(this.state.selectedDateRaw);
				this.onDailyReportClose();
				this.scrollToThisWeek();
			}
		}
		let strategyToUpdate = this.currentStrategy;
		// console.log("this.currentStrategy.plans", this.currentStrategy.plans);
		if (this.isFromPlanSetUp) {
			let key = await this.dataModel.getActivityKey(this.userKey, eventToUpdateToFirebaseActivities);
			eventToUpdateToFirebaseActivities.key = key;
		}
		await this.dataModel.updatePlan(
			this.userKey,
			eventToUpdateToFirebaseActivities
		);
		await this.dataModel.loadUserPlans(this.userKey);
		this.userPlans = this.dataModel.getUserPlans();

		await this.dataModel.updateStrategy(this.userKey, strategyToUpdate);
		await this.dataModel.loadUserStrategies(this.userKey);
		this.userStrategies = this.dataModel.getUserStrategies();
		await this.processDailyReports_after();
		let newValueForReload = this.state.valueForReload + 1;
		await this.setState({valueForReload:newValueForReload})
	};

	lastMonthEventReported = async (date) => {
		this.monthCalRef.current.processEvents();
		if (this.state.currentMonth === "THIS_MONTH") {
			// console.log("nxt month pressed");
			await this.setState({ currentMonth: "PAST_MONTH" });
			await this.setState({
				currentMonthEvents: this.combinedEventListLast,
			});
			await this.setState({
				currentWeatherLists: this.lastMonthWeather,
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

			await this.setState({ nextMonthBtnDisabled: false });
			await this.setState({ pastMonthBtnDisabled: true });
			await this.setState({
				currentMonthName: moment().subtract(1, "month").format("MMMM"),
			});

			this.monthCalRef.current.processEvents();
		} else if (this.state.currentMonth === "NEXT_MONTH") {
			this.resetCalendarToCurrentMonth();
		}
	};
	onHideDetailPressed = () => {
		if (this.state.calendarViewHeight === 145) {
			this.setState({ calendarViewHeight: 435 });
			this.setState({
				hideIcon: <Ionicons name="chevron-up-circle" size={25} color="black" />,
			});
		} else {
			this.setState({ calendarViewHeight: 145 });
			this.setState({
				hideIcon: (
					<Ionicons name="chevron-down-circle" size={25} color="black" />
				),
			});
			this.scrollToThisWeek();
			this.resetCalendarToCurrentMonth();
		}
	};
	onHideDetailPressed2 = async () => {
		console.log("pressed", this.state.isPanelHided);
		if (this.state.isPanelHided) {
			setTimeout(() => {
				this._panel.show();
			});
			await this.setState({ isPanelHided: false });
			await this.setState({
				hideIcon2: (
					<Ionicons name="chevron-down-circle" size={25} color="black" />
				),
			});
		} else {
			console.log("hide panel");
			setTimeout(() => {
				this._panel.hide();
			});
			await this.setState({ isPanelHided: true });
			await this.setState({
				hideIcon2: (
					<Ionicons name="chevron-up-circle" size={25} color="black" />
				),
			});
		}
		console.log("pressed", this.state.isPanelHided);
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
						backgroundColor: "black",
						justifyContent: "center",
						alignItems: "center",
					}}
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
							backgroundColor: "black",
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
	calculateCompletion = () => {
		let selectedStrategyPlans;
		if (this.state.selectedStrategy) {
			selectedStrategyPlans = this.state.selectedStrategy.plans;
		} else {
			selectedStrategyPlans = this.state.plansBuddle;
		}
		// console.log("selectedStrategyPlans", selectedStrategyPlans);
		let accCompletion = 0;
		for (let event of selectedStrategyPlans) {
			if (event.isActivityCompleted || event.partialStatus) {
				accCompletion++;
			}
		}
		let avgCompletion = (
			(accCompletion / selectedStrategyPlans.length) *
			100
		).toFixed(2);
		return avgCompletion;
	};
	calculateComplete = () => {
		let selectedStrategyPlans;
		if (this.state.selectedStrategy) {
			selectedStrategyPlans = this.state.selectedStrategy.plans;
		} else {
			selectedStrategyPlans = this.state.plansBuddle;
		}
		let accCompletion = 0;
		let totalPlans = selectedStrategyPlans.length;
		for (let event of selectedStrategyPlans) {
			if (event.isActivityCompleted || event.partialStatus) {
				accCompletion++;
			}
		}
		return [accCompletion, totalPlans];
	};
	calculateSatisfaction = () => {
		let selectedStrategyPlans;
		if (this.state.selectedStrategy) {
			selectedStrategyPlans = this.state.selectedStrategy.plans;
		} else {
			selectedStrategyPlans = this.state.plansBuddle;
		}
		let completedNum = 0;
		let accSatisfaction = 0;
		for (let event of selectedStrategyPlans) {
			if (event.satisfactionScore) {
				completedNum++;
				accSatisfaction = accSatisfaction + parseInt(event.satisfactionScore);
			}
		}
		let avgSatisfaction = (accSatisfaction / completedNum).toFixed(2);
		return avgSatisfaction;
	};

	calculateTotalDuration = () => {
		let selectedStrategyPlans;
		// console.log("this.state.selectedStrategy", this.state.selectedStrategy);
		if (this.state.selectedStrategy) {
			selectedStrategyPlans = this.state.selectedStrategy.plans;
		} else {
			selectedStrategyPlans = this.state.plansBuddle;
		}
		let accDuration = 0;
		for (let event of selectedStrategyPlans) {
			if (event.satisfactionScore) {
				if (event.newDuration) {
					accDuration = accDuration + event.newDuration;
				} else {
					accDuration = accDuration + event.duration;
				}
			}
		}
		return accDuration;
	};

	render() {
		// console.log("this.state.selectedKeywords", this.state.selectedKeywords);
		let firstSlidePanelPage = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: "100%",
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
								height: "50%",
								width: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}>
							<ModalSelector
								style={{ borderWidth: 0, borderRadius: 20 }}
								// touchableStyle={{ color: "white" }}
								optionContainerStyle={{
									borderWidth: 0,
									backgroundColor: "white",
									borderColor: "grey",
									borderWidth: 2,
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
								initValue={"Select Here"}
								onChange={async (item) => {
									this.setState({ isActivityTypeSelected: true });
									this.setState({ selectedActivity: item.label });
									// this.setState({ reportTitle: item.label})
									// console.log("item.label",item.label);
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
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 14 }}>
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
				<TouchableOpacity onPress={() => this.onPlanBtnPressed()}>
					<AddActivityBtn height={32} width={202} marginTop={"5%"} />
				</TouchableOpacity>
			</View>
		);
		let secondSlidePanelPage = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: "100%",
				}}>
				<SlidingUpPanelTxt2 height={188} width={335} marginTop={15} />
				<View style={{ width: 335, marginTop: "2%" }}>
					<SelectableChips
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
						onChangeChips={(chips) => this.onChangeChips(chips)}
						alertRequired={false}
					/>
				</View>
				<View
					style={{
						backgroundColor: "white",
						height: 32,
						width: 180,
						borderRadius: 20,
						borderWidth: 2,
						borderColor: "black",
						marginRight: 0,
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						position: "absolute",
						bottom: 50,
					}}>
					<TextInput
						style={{
							fontSize: 14,
							width: "100%",
							textAlign: "center",
							fontFamily: "RobotoBoldItalic",
						}}
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
							onPress={() => this.addKeywords()}>
							<Ionicons name="ios-add-circle" size={25} color={"black"} />
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
		let thirdSlidePanelPage = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: "100%",
				}}>
				<View
					style={{
						alignItems: "center",
						justifyContent: "flex-start",
						width: "80%",
					}}>
					<View
						style={[
							generalStyles.shadowStyle,
							{
								marginTop: "5%",
								width: "80%",
								backgroundColor: "white",
							},
						]}>
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
		//Current Planning Strategy on the panel
		let thirdSlidePanelPageUpdated = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: 250,
				}}>
				<View
					style={{
						alignItems: "center",
						justifyContent: "flex-start",
						width: "100%",
					}}>
					{/* <View
            style={[
              generalStyles.shadowStyle,
              {
                marginTop: "5%",
                width: "90%",
                height: 40,
                backgroundColor: "white",
                borderRadius: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                zIndex: 1,
              },
            ]}
          >
            <Text
              style={{
                fontFamily: "RobotoBoldBold",
                fontSize: 14,
                textAlign: "center",
                marginLeft: "5%",
                flex: 1,
              }}
            >
              0 uncompleted daily report
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "black",
                borderRadius: 20,
                height: "90%",
                flex: 0.4,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontFamily: "RobotoBoldBold",
                  fontSize: 14,
                }}
              >
                Complete
              </Text>
            </TouchableOpacity>
          </View> */}
					<View
						style={[
							// generalStyles.shadowStyle,
							{
								marginTop: "6%",
								width: "90%",
								height: 40,
								backgroundColor: "white",
								borderRadius: 20,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
							},
						]}>
						<Text
							style={{
								fontFamily: "RobotoBoldItalic",
								fontSize: 18,
								textAlign: "left",
								marginLeft: "2%",
								flex: 1,
							}}>
							Current Planning Strategy
						</Text>
						<TouchableOpacity
							style={[
								generalStyles.shadowStyle,
								{
									width: 90,
									height: 35,
									backgroundColor: "white",
									marginLeft: 10,
									borderRadius: 20,
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									paddingHorizontal: 10,
								},
							]}
							onPress={() => {
								this.evaluatePanelPopup();
								this.mainContentSwiperRef.current.goToPage(1, true);
								this.panelSwiperRef.current.goToPage(0, true);
							}}>
							{/* <MaterialIcons name="all-inclusive" size={20} color={GREEN} /> */}
							<FontAwesome5 name="flag-checkered" size={18} color={GREEN} />
							<Text
								style={{
									fontFamily: "RobotoBoldItalic",
									fontSize: 14,
									color: GREEN,
								}}>
								Review
							</Text>
						</TouchableOpacity>
					</View>
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
							}}
							onPress={() => this.setState({ isStrategyDetailModalVis: true })}>
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
									{/* <View
                    style={{
                      height: 9,
                      width: 9,
                      borderRadius: 4.5,
                      backgroundColor: GREEN,
                      marginRight: 10,
                    }}
                  /> */}
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
										{this.state.planStrategyName}
									</Text>
								</View>
								<View
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
								</View>
								<View style={{ position: "absolute", right: 5 }}>
									<FontAwesome5 name="play-circle" size={18} color="white" />
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
								{this.state.keywordsBuddle.map((item) => {
									return (
										<View
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
								{/* <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor: "red",
                  }}
                  data={this.state.keywordsBuddle}
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
							</ScrollView>
						</TouchableOpacity>
					</View>
					<BottomIndicator style={{ marginTop: "3%" }} />
				</View>
			</View>
		);
		//My Planning Strategies list on the panel
		let secondSlidePanelPageUpdated = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: "100%",
				}}>
				<View
					style={[
						// generalStyles.shadowStyle,
						{
							marginTop: "6%",
							width: "90%",
							height: 40,
							backgroundColor: "white",
							borderRadius: 20,
							flexDirection: "row",
							justifyContent: "flex-start",
							alignItems: "center",
						},
					]}>
					<Text
						style={{
							fontFamily: "RobotoBoldItalic",
							fontSize: 18,
							textAlign: "left",
							marginLeft: "2%",
							flex: 1,
						}}>
						My Strategies Records
					</Text>
					<TouchableOpacity
						style={[
							generalStyles.shadowStyle,
							{
								width: 110,
								height: 35,
								backgroundColor: "white",
								marginLeft: 10,
								borderRadius: 20,
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								paddingHorizontal: 10,
							},
						]}>
						<MaterialIcons name="all-inclusive" size={20} color="black" />
						<Text
							style={{
								fontFamily: "RobotoBoldItalic",
								fontSize: 14,
								color: "black",
							}}>
							Overview
						</Text>
					</TouchableOpacity>
				</View>

				<ScrollView
					style={{
						width: "100%",
					}}
					contentContainerStyle={{
						alignItems: "center",
						justifyContent: "flex-start",
					}}>
					{this.userStrategies.map((item) => {
						let startDate = new Date(item.startDate);
						let endDate = new Date(item.endDate);
						let isTodayInBetween;
						let isSelected;
						let today = new Date();

						if (today > startDate && today < endDate) {
							isTodayInBetween = true;
						} else {
							isTodayInBetween = false;
						}
						isSelected = item.startDate === this.state.selectedStrategyDate;

						let completionRate;
						let completionCnt = 0;

						for (let event of item.plans) {
							if (event.isActivityCompleted) {
								completionCnt++;
							}
						}
						completionRate = (
							(completionCnt / item.plans.length) *
							100
						).toFixed(2);

						let satisfaction = 0;
						let satisfactionCnt = 0;
						let accDuration = 0;
						for (let event of item.plans) {
							if (event.satisfactionScore) {
								satisfaction = satisfaction + parseInt(event.satisfactionScore);
								satisfactionCnt++;
								accDuration += event.duration;
							}
						}
						let avgSatisfaction = (satisfaction / satisfactionCnt).toFixed(2);
						// console.log("isTodayInBetween", item.title, isTodayInBetween);

						return (
							<View
								style={[
									// generalStyles.shadowStyle,
									{
										height: 90,
										width: 335,
										borderColor: isSelected
											? GREEN
											: isTodayInBetween
											? GREEN
											: "black",
										borderWidth: 2,
										borderRadius: 15,
										marginTop: "5%",
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
									}}
									onPress={async () =>
										// this.setState({ isStrategyDetailModalVis: true })
										{
											setTimeout(() => {
												this._panel.hide();
											});
											this.setState({
												hideIcon2: (
													<Ionicons
														name="chevron-up-circle"
														size={25}
														color="black"
													/>
												),
											});
											this.setState({ isPanelHided: true });

											let thisMonthNum = parseInt(
												moment(new Date()).format().slice(5, 7)
											);
											let selectedMonthNum = parseInt(
												item.startDate.slice(5, 7)
											);
											console.log("selectedMonthNum", selectedMonthNum);
											console.log("thisMonthNum", thisMonthNum);
											this.setState({ selectedStrategy: item });
											this.setState({ selectedKeywords: item.keywords });
											this.setState({ selectedStrategyPlans: item.plans });
											if (thisMonthNum > selectedMonthNum) {
												this.pastMonthBtnPressed();
												this.setState({
													selectedStrategyDate: item.startDate,
												});
												this.setState({
													monthCalStrategyStartDate: item.startDate,
												});
												if (thisMonthNum != selectedMonthNum + 2) {
													let eventDate = new Date(item.startDate);
													await this.setState({ selectedDateRaw: eventDate });
													await this.setState({
														currentMonthDate: this.state.selectedDateRaw,
													});
													this.scrollToThisWeek();
												}
											} else if (thisMonthNum < selectedMonthNum) {
												this.nextMonthBtnPressed();
												this.setState({
													selectedStrategyDate: item.startDate,
												});
												this.setState({
													monthCalStrategyStartDate: item.startDate,
												});
												let eventDate = new Date(item.startDate);
												await this.setState({ selectedDateRaw: eventDate });
												await this.setState({
													currentMonthDate: this.state.selectedDateRaw,
												});
												this.scrollToThisWeek();
											} else {
												if (this.state.currentMonth != "THIS_MONTH") {
													this.resetCalendarToCurrentMonth();
												}
											}

											this.setState({
												selectedStrategyDate: item.startDate,
											});
											this.setState({
												monthCalStrategyStartDate: item.startDate,
											});
											if (thisMonthNum != selectedMonthNum + 2) {
												let eventDate = new Date(item.startDate);
												await this.setState({ selectedDateRaw: eventDate });
												await this.setState({
													currentMonthDate: this.state.selectedDateRaw,
												});
												this.scrollToThisWeek();
											}
										}
									}>
									<View
										style={{
											flexDirection: "column",
											justifyContent: "flex-start",
											width: "100%",
											height: "70%",
											borderTopLeftRadius: 13,
											borderTopRightRadius: 13,
											backgroundColor: isSelected ? GREEN : "black",
										}}>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "flex-start",
												marginTop: 10,
											}}>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "center",
												}}>
												{/* <View
                    style={{
                      height: 9,
                      width: 9,
                      borderRadius: 4.5,
                      backgroundColor: GREEN,
                      marginRight: 10,
                    }}
                  /> */}
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
													{item.title}
												</Text>
											</View>
											<View
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
														color: isSelected ? GREEN : "black",
													}}>
													{item.startDate.slice(5)} → {item.endDate.slice(5)}
												</Text>
											</View>
											<View style={{ position: "absolute", right: 5 }}>
												{isTodayInBetween ? (
													<FontAwesome5
														name="play-circle"
														size={18}
														color="white"
													/>
												) : (
													<MaterialIcons
														name="motion-photos-paused"
														size={20}
														color="white"
													/>
												)}
											</View>
										</View>
										<View
											style={{
												width: "100%",
												flexDirection: "row",
												paddingLeft: "6%",
												alignItems: "center",
												justifyContent: "flex-start",
												paddingHorizontal: 25,
												marginTop: 5,
												// backgroundColor:"red"
											}}>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													marginRight: 10,
												}}>
												<Ionicons
													name="checkmark-circle"
													size={15}
													color="white"
												/>
												<Text
													style={{
														fontWeight: "bold",
														fontSize: 11,
														color: "white",
														marginLeft: 5,
													}}>
													{completionRate}%
												</Text>
											</View>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													marginRight: 10,
												}}>
												<Ionicons name="heart-circle" size={15} color="white" />
												<Text
													style={{
														fontWeight: "bold",
														fontSize: 11,
														color: "white",
														marginLeft: 5,
													}}>
													{avgSatisfaction}
												</Text>
											</View>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													marginRight: 10,
												}}>
												<Ionicons name="timer" size={15} color="white" />
												<Text
													style={{
														fontWeight: "bold",
														fontSize: 11,
														color: "white",
														marginLeft: 5,
													}}>
													{accDuration} min
												</Text>
											</View>
										</View>
									</View>

									<ScrollView
										horizontal={true}
										style={{
											width: "100%",
											height: "30%",
											flexDirection: "row",
										}}
										contentContainerStyle={{
											paddingLeft: "5%",
											paddingRight: "5%",
											alignItems: "center",
										}}>
										{item.keywords.map((item) => {
											return (
												<View
													style={{
														borderRadius: 20,
														height: 32,
														// backgroundColor: "#E7E7E7",
														marginRight: 2,
														padding: 5,
														alignItems: "center",
														justifyContent: "center",
													}}>
													<Text
														style={{
															color: "black",
															fontWeight: "bold",
															fontSize: 13,
														}}>
														# {item.title}
													</Text>
												</View>
											);
										})}
										{/* <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor: "red",
                  }}
                  data={this.state.keywordsBuddle}
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
									</ScrollView>
								</TouchableOpacity>
							</View>
						);
					})}
				</ScrollView>
			</View>
		);
		let planSetUpPage = (
			<View
				style={{
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
							height: "100%",
							backgroundColor: "white",
							marginTop: 4,
							borderRadius: 20,
							borderColor: "grey",
							borderRadius: 2,
							alignItems: "center",
						},
					]}>
					{/* Report option switch selector */}
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "space-between",
							alignItems: "center",
							marginTop: 5,
							padding: 15,
						}}>
						{/* <Text style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}>
              My Activities
            </Text> */}
						<TouchableOpacity
							style={{
								alignItems: "center",
								justifyContent: "center",
								flex: 1,
								marginRight: 10,
							}}
							onPress={() => {
								this.onHideDetailPressed();
							}}>
							{this.state.hideIcon}
						</TouchableOpacity>

						<View
							style={{
								width: "100%",
								flex: 10,

								height: 20,
								alignItems: "center",
								flexDirection: "row",
							}}>
							<SwitchSelector
								options={REPORT_OPTIONS}
								height={20}
								buttonColor="black"
								style={{
									borderWidth: 2,
									borderRadius: 40,
									padding: 1,
									borderColor: "black",
								}}
								textStyle={{
									fontSize: 10,
									fontFamily: "RobotoRegular",
									color: "black",
								}}
								selectedTextStyle={{
									fontSize: 10,
									fontWeight: "bold",
									color: "white",
								}}
								borderWidth={0}
								initial={0}
								onPress={(value) => {
									if (value == "daily") {
										this.setState({ isDailyReportVis: "flex" });
										this.setState({ isActivityRecordsVis: "none" });
										this.isReportFromPopup = true;
									} else {
										this.setState({ isDailyReportVis: "none" });
										this.setState({ isActivityRecordsVis: "flex" });

										this.isReportFromPopup = false;
									}
								}}
							/>
							<View
								style={{
									position: "absolute",
									top: -5,
									right: -5,
									display: this.state.isBadgeVis,
								}}>
								<Badge
									label={this.state.reportCnt}
									size={16}
									backgroundColor={"red"}
								/>
							</View>
						</View>
						{/* <Text style={{ fontFamily: "RobotoBoldBold", fontSize: 13 }}>
              {this.state.accumulatedMinutes}/150 minutes remains
            </Text> */}
						<TouchableOpacity
							style={{
								alignItems: "center",
								justifyContent: "center",
								marginLeft: 10,
								flex: 1,
							}}
							onPress={() => {
								this.onAddActivityPressed();
							}}>
							<Ionicons
								name="ios-add-circle"
								size={25}
								color={"black"}
								// style={{flex:0.1}}
							/>
						</TouchableOpacity>
					</View>
					{/* Planned Activity records  */}
					<View
						style={{
							width: "100%",
							height: 280,
							paddingHorizontal: 15,
							display: this.state.isActivityRecordsVis,
						}}>
						<FlatList
							data={this.state.plansBuddle}
							renderItem={({ item }) => {
								if (!item.isDeleted) {
									let newTiming = "";
									let timing;
									if (item.newStart2) {
										timing =
											moment(item.newStart2).format("ddd").toUpperCase() +
											" " +
											item.newStart2.slice(11, 16) +
											" - " +
											item.newEnd2.slice(11, 16) +
											" | " +
											item.duration +
											" MIN";
									} else {
										timing =
											moment(item.start).format("ddd").toUpperCase() +
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

									if (!item.isReported) {
										// itemBlockStyle = this.itemUnreportedBlockStyle(
										//   item,
										//   timing
										// );
									} else {
										if (item.isActivityCompleted) {
											itemBlockStyle = this.itemCompletedBlockStyle(
												item,
												timing
											);
										} else {
											if (item.isOtherActivity) {
											} else {
												if (item.partialStatus) {
													if (item.partialStatus === "TIME") {
														itemBlockStyle = this.itemPartialCompleteStyle_TIME(
															item,
															timing,
															newTiming
														);
													} else if (item.partialStatus === "ACTIVITY") {
														itemBlockStyle =
															this.itemPartialCompleteStyle_ACTIVITY(
																item,
																timing
															);
													} else if (item.partialStatus === "NONE") {
														itemBlockStyle = this.itemUnCompletedBlockStyle(
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
												} else {
												}
											}
										}
									}

									return itemBlockStyle;
								}
								// console.log("items in plansBuddle", item);
							}}
						/>
					</View>
					{/* Daily reports */}
					<View
						style={{
							width: "100%",
							height: 280,
							paddingHorizontal: 15,
							display: this.state.isDailyReportVis,
						}}>
						<FlatList
							data={this.state.preList}
							renderItem={
								({ item }) => {
									let timing =
										moment(item.start).format("ddd").toUpperCase() +
										" " +
										item.start.slice(11, 16) +
										" - " +
										item.end.slice(11, 16) +
										" | " +
										item.duration +
										" MIN";
									let itemUnreportedBlockStyle = (
										<View
											style={[
												{
													width: "100%",
													height: 40,
													borderRadius: 20,
													borderColor: "black",
													borderWidth: 2,
													paddingHorizontal: 10,
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "center",
													marginTop: 15,
													backgroundColor: "white",
													flexDirection: "column",
													paddingVertical: 6,
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
													{item.title}
													{" | "}
													<Text
														style={{
															fontFamily: "RobotoRegular",
															fontSize: 16,
														}}>
														{moment(item.start).format().slice(5, 10)}
													</Text>
												</Text>

												<TouchableOpacity
													style={{
														borderRadius: 20,
														height: "100%",
														backgroundColor: "black",
														justifyContent: "center",
														alignItems: "center",
													}}
													onPress={() => {
														// item.isReported = true;
														// console.log(
														//   "this.state.plansBuddle",
														//   this.state.plansBuddle
														// );
														this.onDailyPressed(item);
													}}>
													<Text
														style={{
															fontFamily: "RobotoBoldBold",
															fontSize: 14,
															color: "white",
															paddingHorizontal: 10,
															alignSelf: "center",
														}}>
														Report
													</Text>
												</TouchableOpacity>
											</View>
										</View>
									);
									if (item.timeStamp) {
										return this.itemUnreportedBlockStyle(item, timing);
									} else {
										return itemUnreportedBlockStyle;
									}
								}
								// console.log("items in plansBuddle", item);
							}
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
							marginTop: 0,
							borderRadius: 20,
							justifyContent: "flex-start",
							alignItems: "center",
							flexDirection: "column",
						},
					]}>
					<View
						style={{
							width: "100%",
							flexDirection: "row",
							justifyContent: "flex-start",
							alignItems: "center",
							padding: 15,
							paddingBottom: 0,
							marginTop: 0,
						}}>
						<TouchableOpacity
							style={{
								alignItems: "flex-start",
								justifyContent: "center",
								marginRight: 10,
							}}
							onPress={() => {
								this.onHideDetailPressed();
							}}>
							{this.state.hideIcon}
						</TouchableOpacity>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "center",
								height: 45,
							}}>
							<Text
								style={{
									fontFamily: "RobotoBoldItalic",
									fontSize: 18,
									marginRight: 10,
								}}>
								{this.state.selectedStrategy.title}
							</Text>
							<View
								style={{
									flexDirection: "column",
									justifyContent: "center",
									// backgroundColor: "red",
									alignItems: "center",
									backgroundColor: "black",
									borderRadius: 20,
									paddingHorizontal: 10,
								}}>
								<Text
									style={{
										fontSize: 12,
										fontFamily: "RobotoBoldBold",
										textAlign: "center",
										marginTop: 0,
										color: "white",
									}}>
									{this.state.selectedStrategy.startDate} →{" "}
									{this.state.selectedStrategy.endDate}
								</Text>
							</View>
						</View>
					</View>
					<View style={{ height: 300 }}>
						<ScrollView
							style={{ width: "100%", zIndex: 1 }}
							contentContainerStyle={{
								justifyContent: "flex-start",
								alignItems: "center",
							}}>
							<View
								style={[
									generalStyles.shadowStyle,
									{
										width: "90%",
										height: 100,
										flexDirection: "row",
										backgroundColor: "white",
										flexDirection: "row",
										justifyContent: "space-between",
										marginTop: 10,
										borderRadius: 20,
										paddingVertical: 10,
										zIndex: 1,
									},
								]}>
								<View
									style={[
										{
											height: "100%",
											width: "33%",
											backgroundColor: "white",
											borderTopLeftRadius: 20,
											borderBottomLeftRadius: 20,
											flexDirection: "column",
											borderRightWidth: 2,
											borderColor: "#D8D8D8",
										},
									]}>
									<View
										style={{
											width: "100%",
											justifyContent: "center",
											alignItems: "center",
											height: "20%",
											flexDirection: "row",
										}}>
										<Ionicons name="checkmark-circle" size={15} color="black" />
										<Text
											style={{
												fontFamily: "RobotoBoldBold",
												fontSize: 12,
												marginLeft: 2,
											}}>
											Completion
										</Text>
									</View>
									<View
										style={{
											width: "100%",
											justifyContent: "space-between",
											alignItems: "center",
											height: "80%",
											paddingVertical: 8,
										}}>
										<Text
											style={{
												fontFamily: "RobotoBoldBold",
												fontSize: 15,
												fontFamily: "RobotoBoldItalic",
											}}>
											{this.calculateCompletion()}%
										</Text>
										<View
											style={{
												height: 2,
												width: "30%",
												backgroundColor: "black",
											}}></View>
										<Text
											style={{
												fontFamily: "RobotoBoldBold",
												fontSize: 15,
												fontFamily: "RobotoBoldItalic",
											}}>
											{this.calculateComplete()[0]} /{" "}
											{this.calculateComplete()[1]}
										</Text>
									</View>
								</View>
								<View
									style={[
										{
											height: "100%",
											width: "33%",
											backgroundColor: "white",
											borderRightWidth: 2,
											borderColor: "#D8D8D8",
										},
									]}>
									<View
										style={{
											width: "100%",
											justifyContent: "center",
											alignItems: "center",
											height: "20%",
											flexDirection: "row",
										}}>
										<Ionicons name="heart-circle" size={15} color="black" />

										<Text
											style={{
												fontFamily: "RobotoBoldBold",
												fontSize: 12,
												marginLeft: 2,
											}}>
											Satisfaction
										</Text>
									</View>
									<View
										style={{
											width: "100%",
											justifyContent: "center",
											alignItems: "center",
											height: "80%",
											paddingVertical: 10,
										}}>
										<Text
											style={{
												fontFamily: "RobotoBoldBold",
												fontSize: 18,
												fontFamily: "RobotoBoldItalic",
											}}>
											{this.calculateSatisfaction()}
										</Text>
									</View>
								</View>
								<View
									style={[
										{
											height: "100%",
											width: "33%",
											backgroundColor: "white",
											borderRadius: 20,
										},
									]}>
									<View
										style={{
											width: "100%",
											justifyContent: "center",
											alignItems: "center",
											height: "20%",
											flexDirection: "row",
										}}>
										<Ionicons name="timer" size={15} color="black" />

										<Text
											style={{
												fontFamily: "RobotoBoldBold",
												fontSize: 12,
												marginLeft: 2,
											}}>
											Activity Level
										</Text>
									</View>
									<View
										style={{
											width: "100%",
											justifyContent: "center",
											alignItems: "center",
											height: "80%",
											paddingVertical: 10,
										}}>
										<Text
											style={{
												fontSize: 18,
												fontFamily: "RobotoBoldItalic",
											}}>
											{this.calculateTotalDuration()} min
										</Text>
									</View>
								</View>
							</View>
							<View
								style={[
									// generalStyles.shadowStyle,
									{
										width: "95%",
										backgroundColor: "white",
										borderRadius: 20,
										marginTop: 10,
									},
								]}>
								<View
									style={{
										width: "100%",
										justifyContent: "flex-start",
										flexDirection: "row",
										marginTop: 10,
										marginLeft: "5%",
									}}>
									<View style={{ flexDirection: "row" }}>
										<FontAwesome name="asterisk" size={15} color="black" />
										<Text
											style={{
												fontWeight: "bold",
												fontSize: 12,
												marginLeft: "5%",
											}}>
											Keywords
										</Text>
									</View>
								</View>
								<View
									style={{
										flexDirection: "row",
										flexWrap: "wrap",
										alignItems: "center",
										marginTop: "2%",
										paddingHorizontal: "5%",
									}}>
									{this.state.selectedKeywords.map((item) => {
										return (
											<View
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
													# {item.title}
												</Text>
											</View>
										);
									})}
								</View>
								<View
									style={{
										width: "100%",
										justifyContent: "flex-start",
										flexDirection: "row",
										marginTop: 15,
										marginLeft: "5%",
									}}>
									<View style={{ flexDirection: "row" }}>
										<MaterialIcons name="event-note" size={15} color="black" />
										<Text
											style={{
												fontWeight: "bold",
												fontSize: 12,
												marginLeft: "5%",
											}}>
											Activity Plan Records
										</Text>
									</View>
								</View>
								<FlatList
									data={this.state.selectedStrategyPlans}
									renderItem={({ item }) => {
										if (!item.isDeleted) {
											let newTiming = "";
											let timing;
											if (item.newStart2) {
												timing =
													moment(item.newStart2).format("ddd").toUpperCase() +
													" " +
													item.newStart2.slice(11, 16) +
													" - " +
													item.newEnd2.slice(11, 16) +
													" | " +
													item.duration +
													" MIN";
											} else {
												timing =
													moment(item.start).format("ddd").toUpperCase() +
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

											if (!item.isReported) {
												// itemBlockStyle = this.itemUnreportedBlockStyle(
												//   item,
												//   timing
												// );
											} else {
												if (item.isActivityCompleted) {
													itemBlockStyle = this.itemCompletedBlockStyle(
														item,
														timing
													);
												} else {
													if (item.isOtherActivity) {
													} else {
														if (item.partialStatus) {
															if (item.partialStatus === "TIME") {
																itemBlockStyle =
																	this.itemPartialCompleteStyle_TIME(
																		item,
																		timing,
																		newTiming
																	);
															} else if (item.partialStatus === "ACTIVITY") {
																itemBlockStyle =
																	this.itemPartialCompleteStyle_ACTIVITY(
																		item,
																		timing
																	);
															} else if (item.partialStatus === "NONE") {
																itemBlockStyle = this.itemUnCompletedBlockStyle(
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
														} else {
														}
													}
												}
											}

											return itemBlockStyle;
										}
										// console.log("items in plansBuddle", item);
									}}
								/>
							</View>
						</ScrollView>
					</View>
				</View>
			</View>
		);
		// let finalConfirmationPage = (
		//   <View
		//     style={{
		//       backgroundColor: "white",
		//       width: "100%",
		//       height: "100%",
		//       justifyContent: "flex-start",
		//       alignItems: "center",
		//     }}
		//   >
		//     {/* Body */}
		//     <View
		//       style={[
		//         generalStyles.shadowStyle,
		//         {
		//           width: "100%",
		//           height: "100%",
		//           backgroundColor: "white",
		//           marginTop: 0,
		//           borderRadius: 0,
		//           justifyContent: "center",
		//           alignItems: "center",
		//         },
		//       ]}
		//     >
		//       {this.state.confirmPageIcon}
		//       <Text
		//         style={{
		//           fontFamily: "RobotoBoldItalic",
		//           fontSize: 24,
		//           marginTop: "5%",
		//         }}
		//       >
		//         {this.state.confirmPageTitle}
		//       </Text>
		//       <View
		//         style={{
		//           flexDirection: "column",
		//           alignItems: "center",
		//           display: this.state.confirmBtnDisplay,
		//         }}
		//       >
		//         <Text
		//           style={{
		//             fontFamily: "RobotoRegular",
		//             fontSize: 14,
		//             marginTop: "5%",
		//             width: "80%",
		//             textAlign: "center",
		//           }}
		//         >
		//           Give a name to your plans:
		//         </Text>
		//         <View
		//           style={{
		//             backgroundColor: "white",
		//             height: 32,
		//             width: 200,
		//             borderRadius: 20,
		//             borderWidth: 2,
		//             marginTop: 20,
		//             borderColor: "black",
		//             flexDirection: "row",
		//             alignItems: "center",
		//             justifyContent: "space-between",
		//           }}
		//         >
		//           <TextInput
		//             style={{
		//               fontSize: 14,
		//               width: "100%",
		//               textAlign: "center",
		//               fontFamily: "RobotoBoldItalic",
		//             }}
		//             placeholder="e.g. Morning Exercise Plan"
		//             ref={(input) => {
		//               this.planStrategyInputRef = input;
		//             }}
		//             value={this.state.planStrategyName}
		//             onChangeText={(text) => {
		//               this.setState({ planStrategyName: text });
		//             }}
		//           />
		//         </View>
		//         {/* Confirm btns */}
		//         <View
		//           style={{
		//             flexDirection: "row",
		//             marginTop: 20,
		//             width: 205,
		//             justifyContent: "space-between",
		//           }}
		//         >
		//           <TouchableOpacity
		//             style={{
		//               backgroundColor: "black",
		//               height: 30,
		//               width: 100,
		//               borderRadius: 20,
		//               borderWidth: 2,
		//               borderColor: "black",
		//               marginRight: 0,
		//               flexDirection: "row",
		//               alignItems: "center",
		//               justifyContent: "flex-start",
		//             }}
		//             onPress={async () => this.onBackBtnPressed()}
		//           >
		//             <View
		//               style={{
		//                 margin: 0,
		//                 width: 25,
		//                 position: "absolute",
		//                 left: 1,
		//               }}
		//             >
		//               <View
		//                 style={{
		//                   alignItems: "flex-start",
		//                   justifyContent: "flex-start",
		//                   flex: 1,
		//                 }}
		//               >
		//                 <Ionicons
		//                   name="chevron-back-circle-sharp"
		//                   size={25}
		//                   color={"white"}
		//                 />
		//               </View>
		//             </View>
		//             <View
		//               style={{
		//                 margin: 0,
		//                 width: 73,
		//                 position: "absolute",
		//                 right: 1,
		//               }}
		//             >
		//               <View
		//                 style={{
		//                   alignItems: "flex-end",
		//                   justifyContent: "flex-end",
		//                   flex: 1,
		//                 }}
		//               >
		//                 <Text
		//                   style={{
		//                     fontSize: 14,
		//                     width: "100%",
		//                     textAlign: "center",
		//                     fontFamily: "RobotoBoldItalic",
		//                     color: "white",
		//                   }}
		//                 >
		//                   Back
		//                 </Text>
		//               </View>
		//             </View>
		//           </TouchableOpacity>
		//           <TouchableOpacity
		//             style={{
		//               backgroundColor: "black",
		//               height: 30,
		//               width: 100,
		//               borderRadius: 20,
		//               borderWidth: 2,
		//               borderColor: "black",
		//               marginRight: 0,
		//               flexDirection: "row",
		//               alignItems: "center",
		//               justifyContent: "flex-start",
		//             }}
		//             // OnConfirm
		//             onPress={() => this.onConfirmBtnPressed()}
		//           >
		//             <View
		//               style={{
		//                 margin: 0,
		//                 width: 73,
		//                 position: "absolute",
		//                 left: 1,
		//               }}
		//             >
		//               <View
		//                 style={{
		//                   alignItems: "flex-start",
		//                   justifyContent: "flex-start",
		//                   flex: 1,
		//                 }}
		//               >
		//                 <Text
		//                   style={{
		//                     fontSize: 14,
		//                     width: "100%",
		//                     textAlign: "center",
		//                     fontFamily: "RobotoBoldItalic",
		//                     color: "white",
		//                   }}
		//                 >
		//                   Confirm
		//                 </Text>
		//               </View>
		//             </View>
		//             <View
		//               style={{
		//                 margin: 0,
		//                 width: 25,
		//                 position: "absolute",
		//                 right: 1,
		//               }}
		//             >
		//               <View
		//                 style={{
		//                   alignItems: "flex-end",
		//                   justifyContent: "flex-end",
		//                   flex: 1,
		//                 }}
		//               >
		//                 <Ionicons
		//                   name="ios-checkmark-circle"
		//                   size={25}
		//                   color={"white"}
		//                 />
		//               </View>
		//             </View>
		//           </TouchableOpacity>
		//         </View>
		//       </View>

		//       <View style={{ width: "60%", display: this.state.confirmTxtDisplay }}>
		//         <Text
		//           style={{
		//             fontFamily: "RobotoRegular",
		//             fontSize: 14,
		//             marginTop: "5%",

		//             textAlign: "center",
		//           }}
		//         >
		//           Click the{" "}
		//           <Text style={{ fontFamily: "RobotoBoldItalic" }}>Start</Text>{" "}
		//           below to start your first week of tracking
		//         </Text>
		//       </View>
		//     </View>
		//   </View>
		// );
		let evaluatePage_ONE = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: "100%",
					width: "95%",
					// backgroundColor:"red"
				}}>
				<View style={{ marginTop: "10%" }}>
					<Text style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}>
						Which aspects of your strategy{" "}
						<Text style={{ color: GREEN }}>helped</Text> you better complete
						your plans?
					</Text>
				</View>
				<ScrollView>
					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
							alignItems: "center",
							marginTop: "5%",
							paddingHorizontal: "1%",
						}}>
						{this.state.keywordsBuddle.map((item) => {
							let isColored = false;
							if ("isSelected" in item && item.isSelected) {
								isColored = true;
							}
							let itemColor;
							if ("color" in item) {
								if (item.color === "GREEN") {
									itemColor = GREEN;
								} else if (item.color === "YELLOW") {
									itemColor = YELLOW;
								} else {
									itemColor = "black";
								}
							} else {
								itemColor = "black";
							}

							return (
								<TouchableOpacity
									style={{
										height: 25,
										borderRadius: 20,
										backgroundColor: itemColor,
										justifyContent: "space-between",
										alignItems: "center",
										alignSelf: "center",
										marginBottom: 5,
										marginRight: 5,
										paddingHorizontal: 2,
										flexDirection: "row",
									}}
									onPress={() => {
										// if ("isSelected" in item) {
										//   item.isSelected = !item.isSelected
										//   if (item.isSelected) {
										//     item.color="GREEN"
										//   }else{
										//     item.color="UNDEFINED"
										//   }
										// } else {
										//   item.color="GREEN";
										//   item.isSelected = true;
										// }
										if ("color" in item) {
											if (item.color != "GREEN") {
												item.color = "GREEN";
											} else {
												item.color = "UNDEFINED";
											}
										} else {
											item.color = "GREEN";
										}
										let newKeyWordsBuddle = this.state.keywordsBuddle;
										this.setState({ keywordsBuddle: newKeyWordsBuddle });
										// console.log("item",this.state.keywordsBuddle);
									}}>
									<Text
										style={{
											fontFamily: "RobotoBoldBlack",
											color: "white",
											paddingHorizontal: 20,
											fontSize: 12,
										}}>
										# {item.title}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</ScrollView>
			</View>
		);
		let evaluatePage_TWO = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: "100%",
					width: "95%",
					// backgroundColor:"red"
				}}>
				<View style={{ marginTop: "10%" }}>
					<Text style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}>
						Which aspects of your strategy that you think is not helpful?{" "}
						<Text style={{ color: YELLOW }}>is not helpful</Text>
					</Text>
				</View>
				<ScrollView>
					<View
						style={{
							flexDirection: "row",
							flexWrap: "wrap",
							alignItems: "center",
							marginTop: "5%",
							paddingHorizontal: "5%",
						}}>
						{this.state.keywordsBuddle.map((item) => {
							let itemColor;
							if (item.color === "GREEN") {
								itemColor = GREEN;
							} else if (item.color === "YELLOW") {
								itemColor = YELLOW;
							} else {
								itemColor = "black";
							}
							return (
								<TouchableOpacity
									style={{
										height: 25,
										borderRadius: 20,
										backgroundColor: itemColor,
										justifyContent: "space-between",
										alignItems: "center",
										alignSelf: "center",
										marginBottom: 5,
										marginRight: 5,
										paddingHorizontal: 2,
										flexDirection: "row",
									}}
									onPress={() => {
										if (item.color != "GREEN") {
											if (item.color === "YELLOW") {
												item.color = "UNDEFINED";
											} else {
												item.color = "YELLOW";
											}
										} else {
											item.color = "YELLOW";
										}
										let newKeyWordsBuddle = this.state.keywordsBuddle;
										this.setState({ keywordsBuddle: newKeyWordsBuddle });
										console.log(
											"this.state.keywordsBuddle",
											this.state.keywordsBuddle
										);
									}}>
									<Text
										style={{
											fontFamily: "RobotoBoldBlack",
											color: "white",
											paddingHorizontal: 20,
											fontSize: 12,
										}}>
										# {item.title}
									</Text>
								</TouchableOpacity>
							);
						})}
					</View>
				</ScrollView>
			</View>
		);
		let evaluatePage_THREE = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: "100%",
					width: "93%",
					// backgroundColor:"red"
				}}>
				<View style={{ marginTop: "10%" }}>
					<Text style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}>
						How satisfied are you with this planning strategy?
					</Text>
				</View>
				<View
					style={[
						generalStyles.shadowStyle,
						{
							height: 95,
							width: 335,
							borderColor: GREEN,
							borderWidth: 2,
							borderRadius: 15,
							marginTop: 10,

							backgroundColor: "white",
						},
					]}>
					<View
						style={{
							flexDirection: "column",
							justifyContent: "flex-start",
							width: "100%",
							height: "65%",
							borderTopLeftRadius: 13,
							borderTopRightRadius: 13,
							backgroundColor: GREEN,
						}}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "flex-start",
								marginTop: 10,
							}}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
								}}>
								{/* <View
                    style={{
                      height: 9,
                      width: 9,
                      borderRadius: 4.5,
                      backgroundColor: GREEN,
                      marginRight: 10,
                    }}
                  /> */}
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
									{this.state.selectedStrategy.title}
								</Text>
							</View>
							<View
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
									{this.state.selectedStrategy.startDate} →{" "}
									{this.state.selectedStrategy.endDate}
								</Text>
							</View>
							{/* <View style={{ position: "absolute", right: 5 }}>
                    <MaterialIcons
                      name="track-changes"
                      size={20}
                      color="white"
                    />
                </View> */}
						</View>
						<View
							style={{
								width: "100%",
								flexDirection: "row",
								paddingLeft: "6%",
								alignItems: "center",
								justifyContent: "flex-start",
								paddingHorizontal: 25,
								marginTop: 5,
								// backgroundColor:"red"
							}}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: 10,
								}}>
								<Ionicons name="checkmark-circle" size={15} color="white" />
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 11,
										color: "white",
										marginLeft: 5,
									}}>
									{this.calculateCompletion()}%
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: 10,
								}}>
								<Ionicons name="heart-circle" size={15} color="white" />
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 11,
										color: "white",
										marginLeft: 5,
									}}>
									{this.calculateSatisfaction()}
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: 10,
								}}>
								<Ionicons name="timer" size={15} color="white" />
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 11,
										color: "white",
										marginLeft: 5,
									}}>
									{this.calculateTotalDuration()} min
								</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							height: "35%",
							width: "100%",
							borderBottomLeftRadius: 13,
							borderBottomRightRadius: 13,
						}}>
						<ScrollView
							contentContainerStyle={{ justifyContent: "flex-start" }}>
							<View
								style={{
									flexDirection: "row",
									flexWrap: "wrap",
									alignItems: "center",
									// marginBottom: "5%",
									paddingHorizontal: "5%",
								}}>
								{this.state.keywordsBuddle.map((item) => {
									let itemColor;
									if (item.color === "GREEN") {
										itemColor = GREEN;
									} else if (item.color === "YELLOW") {
										itemColor = YELLOW;
									} else {
										itemColor = "black";
									}
									return (
										<View
											style={{
												height: 25,
												borderRadius: 20,
												backgroundColor: itemColor,
												justifyContent: "space-between",
												alignItems: "center",
												alignSelf: "center",
												marginBottom: 5,
												marginRight: 5,
												paddingHorizontal: 2,
												flexDirection: "row",
											}}
											// onPress={() => {
											//   if (item.color != "GREEN") {
											//     if (item.color === "YELLOW") {
											//       item.color = "UNDEFINED"
											//     } else {
											//       item.color = "YELLOW";
											//     }

											//   } else {
											//     item.color = "YELLOW";
											//   }
											//   let newKeyWordsBuddle = this.state.keywordsBuddle;
											//   this.setState({keywordsBuddle:newKeyWordsBuddle});
											// }}
										>
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
				</View>
				<View style={{ width: "95%", marginTop: 10 }}>
					<SwitchSelector
						height={20}
						options={REPORTSCREEN_TWO}
						buttonColor="black"
						borderColor="black"
						style={{ borderWidth: 2, borderRadius: 40, padding: 1 }}
						textStyle={{ fontSize: 10 }}
						selectedTextStyle={{ fontSize: 10 }}
						borderWidth={0}
						initial={parseInt(this.state.satisfactionScoreEV) - 1}
						onPress={(value) => {
							this.setState({ satisfactionScoreEV: value });
						}}
					/>
				</View>
				<View
					style={{
						width: "95%",
						// height: 5,
						// backgroundColor: "black",
						borderRadius: 10,
						justifyContent: "space-between",
						flexDirection: "row",
						marginTop: 10,
						marginBottom: 30,
					}}>
					<Text style={{ fontWeight: "bold", fontSize: 10, width: 70 }}>
						Not Satisfied
					</Text>
					<Text
						style={{
							fontWeight: "bold",
							fontSize: 10,
							width: 70,
							textAlign: "right",
						}}>
						Indifferent
					</Text>
					<Text
						style={{
							fontWeight: "bold",
							fontSize: 10,
							width: 90,
							textAlign: "right",
						}}>
						Very Satisfied
					</Text>
				</View>
			</View>
		);
		let evaluatePage_FOUR = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "flex-start",
					height: "100%",
					width: "93%",
					// backgroundColor:"red"
				}}>
				<View style={{ marginTop: "10%" }}>
					<Text style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}>
						Do you want to change this planning strategy?
					</Text>
				</View>
				<View
					style={[
						generalStyles.shadowStyle,
						{
							height: 95,
							width: 335,
							borderColor: GREEN,
							borderWidth: 2,
							borderRadius: 15,
							marginTop: 10,

							backgroundColor: "white",
						},
					]}>
					<View
						style={{
							flexDirection: "column",
							justifyContent: "flex-start",
							width: "100%",
							height: "65%",
							borderTopLeftRadius: 13,
							borderTopRightRadius: 13,
							backgroundColor: GREEN,
						}}>
						<View
							style={{
								flexDirection: "row",
								alignItems: "center",
								justifyContent: "flex-start",
								marginTop: 10,
							}}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									justifyContent: "center",
								}}>
								{/* <View
                    style={{
                      height: 9,
                      width: 9,
                      borderRadius: 4.5,
                      backgroundColor: GREEN,
                      marginRight: 10,
                    }}
                  /> */}
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
									{this.state.selectedStrategy.title}
								</Text>
							</View>
							<View
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
									{this.state.selectedStrategy.startDate} →{" "}
									{this.state.selectedStrategy.endDate}
								</Text>
							</View>
							{/* <View style={{ position: "absolute", right: 5 }}>
                    <MaterialIcons
                      name="track-changes"
                      size={20}
                      color="white"
                    />
                </View> */}
						</View>
						<View
							style={{
								width: "100%",
								flexDirection: "row",
								paddingLeft: "6%",
								alignItems: "center",
								justifyContent: "flex-start",
								paddingHorizontal: 25,
								marginTop: 5,
								// backgroundColor:"red"
							}}>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: 10,
								}}>
								<Ionicons name="checkmark-circle" size={15} color="white" />
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 11,
										color: "white",
										marginLeft: 5,
									}}>
									{this.calculateCompletion()}%
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: 10,
								}}>
								<Ionicons name="heart-circle" size={15} color="white" />
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 11,
										color: "white",
										marginLeft: 5,
									}}>
									{this.calculateSatisfaction()}
								</Text>
							</View>
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: 10,
								}}>
								<Ionicons name="timer" size={15} color="white" />
								<Text
									style={{
										fontWeight: "bold",
										fontSize: 11,
										color: "white",
										marginLeft: 5,
									}}>
									{this.calculateTotalDuration()} min
								</Text>
							</View>
						</View>
					</View>
					<View
						style={{
							height: "35%",
							width: "100%",
							borderBottomLeftRadius: 13,
							borderBottomRightRadius: 13,
						}}>
						<ScrollView
							contentContainerStyle={{ justifyContent: "flex-start" }}>
							<View
								style={{
									flexDirection: "row",
									flexWrap: "wrap",
									alignItems: "center",
									// marginBottom: "5%",
									paddingHorizontal: "5%",
								}}>
								{this.state.keywordsBuddle.map((item) => {
									let itemColor;
									if (item.color === "GREEN") {
										itemColor = GREEN;
									} else if (item.color === "YELLOW") {
										itemColor = YELLOW;
									} else {
										itemColor = "black";
									}
									return (
										<View
											style={{
												height: 25,
												borderRadius: 20,
												backgroundColor: itemColor,
												justifyContent: "space-between",
												alignItems: "center",
												alignSelf: "center",
												marginBottom: 5,
												marginRight: 5,
												paddingHorizontal: 2,
												flexDirection: "row",
											}}
											// onPress={() => {
											//   if (item.color != "GREEN") {
											//     if (item.color === "YELLOW") {
											//       item.color = "UNDEFINED"
											//     } else {
											//       item.color = "YELLOW";
											//     }

											//   } else {
											//     item.color = "YELLOW";
											//   }
											//   let newKeyWordsBuddle = this.state.keywordsBuddle;
											//   this.setState({keywordsBuddle:newKeyWordsBuddle});
											// }}
										>
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
				</View>
				<View style={{ width: "95%", marginTop: 10 }}>
					<SwitchSelector
						height={40}
						options={EVALUATIONSCREEN_FOUR}
						buttonColor="black"
						borderColor="black"
						style={{ borderWidth: 2, borderRadius: 40, padding: 1 }}
						textStyle={{ fontSize: 11, padding: 2 }}
						selectedTextStyle={{ fontSize: 11 }}
						borderWidth={0}
						initial={0}
						onPress={(value) => {
							console.log("value", value);
							this.setState({ evaluationPage_FOUR_value: value });
							if (this.state.evaluationPage_FOUR_value === "No") {
								this.setState({ evaluationNEXTbtnTxt: "NEXT" });
							} else {
								this.setState({ evaluationNEXTbtnTxt: "START TRACKING!" });
							}
						}}
					/>
				</View>
			</View>
		);
		let evaluatePage_FIVE = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "space-between",
					height: "100%",
					width: "93%",
					// backgroundColor:"red"
				}}>
				<View style={{ marginTop: "10%" }}>
					<Text style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}>
						Do you want to retry with a previous strategy?
					</Text>
				</View>
				<View style={{ width: "95%", marginTop: 10 }}>
					<SwitchSelector
						height={40}
						options={EVALUATIONSCREEN_FIVE}
						buttonColor="black"
						borderColor="black"
						style={{ borderWidth: 2, borderRadius: 40, padding: 1 }}
						textStyle={{ fontSize: 11, padding: 2 }}
						selectedTextStyle={{ fontSize: 11 }}
						borderWidth={0}
						initial={0}
						onPress={(value) => {
							this.setState({ evaluationPage_FIVE_value: value });
							if (this.state.evaluationPage_FIVE_value === "No") {
								this.setState({ evaluationNEXTbtnTxt: "NEXT" });
							} else {
								this.setState({ evaluationNEXTbtnTxt: "START TRACKING!" });
							}
						}}
					/>
				</View>
			</View>
		);
		let evaluatePage_SIX = (
			<View
				style={{
					alignItems: "center",
					justifyContent: "space-between",
					height: "100%",
					width: "93%",
					// backgroundColor:"red"
				}}>
				<View style={{ marginTop: "10%" }}>
					<Text style={{ fontFamily: "RobotoBoldItalic", fontSize: 18 }}>
						Pick a previous strategy to start:
					</Text>
				</View>
				<ScrollView
					style={{
						width: "100%",
					}}
					contentContainerStyle={{
						alignItems: "center",
						justifyContent: "flex-start",
					}}>
					{this.userStrategies.map((item) => {
						let startDate = new Date(item.startDate);
						let endDate = new Date(item.endDate);
						let isTodayInBetween;
						let isSelected;
						let today = new Date();

						if (today > startDate && today < endDate) {
							isTodayInBetween = true;
						} else {
							isTodayInBetween = false;
						}
						isSelected = item.startDate === this.state.selectedStrategyDate;

						let completionRate;
						let completionCnt = 0;

						for (let event of item.plans) {
							if (event.isActivityCompleted) {
								completionCnt++;
							}
						}
						completionRate = (
							(completionCnt / item.plans.length) *
							100
						).toFixed(2);

						let satisfaction = 0;
						let satisfactionCnt = 0;
						let accDuration = 0;
						for (let event of item.plans) {
							if (event.satisfactionScore) {
								satisfaction = satisfaction + parseInt(event.satisfactionScore);
								satisfactionCnt++;
								accDuration += event.duration;
							}
						}
						let avgSatisfaction = (satisfaction / satisfactionCnt).toFixed(2);
						// console.log("isTodayInBetween", item.title, isTodayInBetween);

						return (
							<View
								style={[
									// generalStyles.shadowStyle,
									{
										height: 90,
										width: 335,
										borderColor: isSelected
											? GREEN
											: isTodayInBetween
											? GREEN
											: "black",
										borderWidth: 2,
										borderRadius: 15,
										marginTop: "5%",
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
									}}
									onPress={async () =>
										// this.setState({ isStrategyDetailModalVis: true })
										{
											setTimeout(() => {
												this._panel.hide();
											});
											this.setState({
												hideIcon2: (
													<Ionicons
														name="chevron-up-circle"
														size={25}
														color="black"
													/>
												),
											});
											this.setState({ isPanelHided: true });

											let thisMonthNum = parseInt(
												moment(new Date()).format().slice(5, 7)
											);
											let selectedMonthNum = parseInt(
												item.startDate.slice(5, 7)
											);
											console.log("selectedMonthNum", selectedMonthNum);
											console.log("thisMonthNum", thisMonthNum);
											this.setState({ selectedStrategy: item });
											this.setState({ selectedKeywords: item.keywords });
											this.setState({ selectedStrategyPlans: item.plans });
											if (thisMonthNum > selectedMonthNum) {
												this.pastMonthBtnPressed();
												this.setState({
													selectedStrategyDate: item.startDate,
												});
												this.setState({
													monthCalStrategyStartDate: item.startDate,
												});
												if (thisMonthNum != selectedMonthNum + 2) {
													let eventDate = new Date(item.startDate);
													await this.setState({ selectedDateRaw: eventDate });
													await this.setState({
														currentMonthDate: this.state.selectedDateRaw,
													});
													this.scrollToThisWeek();
												}
											} else if (thisMonthNum < selectedMonthNum) {
												this.nextMonthBtnPressed();
												this.setState({
													selectedStrategyDate: item.startDate,
												});
												this.setState({
													monthCalStrategyStartDate: item.startDate,
												});
												let eventDate = new Date(item.startDate);
												await this.setState({ selectedDateRaw: eventDate });
												await this.setState({
													currentMonthDate: this.state.selectedDateRaw,
												});
												this.scrollToThisWeek();
											} else {
												if (this.state.currentMonth != "THIS_MONTH") {
													this.resetCalendarToCurrentMonth();
												}
											}

											this.setState({
												selectedStrategyDate: item.startDate,
											});
											this.setState({
												monthCalStrategyStartDate: item.startDate,
											});
											if (thisMonthNum != selectedMonthNum + 2) {
												let eventDate = new Date(item.startDate);
												await this.setState({ selectedDateRaw: eventDate });
												await this.setState({
													currentMonthDate: this.state.selectedDateRaw,
												});
												this.scrollToThisWeek();
											}
										}
									}>
									<View
										style={{
											flexDirection: "column",
											justifyContent: "flex-start",
											width: "100%",
											height: "70%",
											borderTopLeftRadius: 13,
											borderTopRightRadius: 13,
											backgroundColor: isSelected ? GREEN : "black",
										}}>
										<View
											style={{
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "flex-start",
												marginTop: 10,
											}}>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "center",
												}}>
												{/* <View
                    style={{
                      height: 9,
                      width: 9,
                      borderRadius: 4.5,
                      backgroundColor: GREEN,
                      marginRight: 10,
                    }}
                  /> */}
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
													{item.title}
												</Text>
											</View>
											<View
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
														color: isSelected ? GREEN : "black",
													}}>
													{item.startDate.slice(5)} → {item.endDate.slice(5)}
												</Text>
											</View>
											<View style={{ position: "absolute", right: 5 }}>
												{isTodayInBetween ? (
													<FontAwesome5
														name="play-circle"
														size={18}
														color="white"
													/>
												) : (
													<MaterialIcons
														name="motion-photos-paused"
														size={20}
														color="white"
													/>
												)}
											</View>
										</View>
										<View
											style={{
												width: "100%",
												flexDirection: "row",
												paddingLeft: "6%",
												alignItems: "center",
												justifyContent: "flex-start",
												paddingHorizontal: 25,
												marginTop: 5,
												// backgroundColor:"red"
											}}>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													marginRight: 10,
												}}>
												<Ionicons
													name="checkmark-circle"
													size={15}
													color="white"
												/>
												<Text
													style={{
														fontWeight: "bold",
														fontSize: 11,
														color: "white",
														marginLeft: 5,
													}}>
													{completionRate}%
												</Text>
											</View>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													marginRight: 10,
												}}>
												<Ionicons name="heart-circle" size={15} color="white" />
												<Text
													style={{
														fontWeight: "bold",
														fontSize: 11,
														color: "white",
														marginLeft: 5,
													}}>
													{avgSatisfaction}
												</Text>
											</View>
											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													marginRight: 10,
												}}>
												<Ionicons name="timer" size={15} color="white" />
												<Text
													style={{
														fontWeight: "bold",
														fontSize: 11,
														color: "white",
														marginLeft: 5,
													}}>
													{accDuration} min
												</Text>
											</View>
										</View>
									</View>

									<ScrollView
										horizontal={true}
										style={{
											width: "100%",
											height: "30%",
											flexDirection: "row",
										}}
										contentContainerStyle={{
											paddingLeft: "5%",
											paddingRight: "5%",
											alignItems: "center",
										}}>
										{item.keywords.map((item) => {
											return (
												<View
													style={{
														borderRadius: 20,
														height: 32,
														// backgroundColor: "#E7E7E7",
														marginRight: 2,
														padding: 5,
														alignItems: "center",
														justifyContent: "center",
													}}>
													<Text
														style={{
															color: "black",
															fontWeight: "bold",
															fontSize: 13,
														}}>
														# {item.title}
													</Text>
												</View>
											);
										})}
										{/* <FlatList
                  horizontal={true}
                  contentContainerStyle={{
                    flexDirection: "row",
                    width: "100%",
                    backgroundColor: "red",
                  }}
                  data={this.state.keywordsBuddle}
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
									</ScrollView>
								</TouchableOpacity>
							</View>
						);
					})}
				</ScrollView>
			</View>
		);
		let slideUpPanel = (
			<SlidingUpPanel
				allowDragging={false}
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
					<TouchableOpacity
						style={{
							position: "absolute",
							left: "5%",
							top: "3%",
							zIndex: 1,
						}}
						onPress={() => {
							this.onHideDetailPressed2();
						}}>
						{this.state.hideIcon2}
					</TouchableOpacity>
					{/* <TouchableOpacity
            style={{
              position: "absolute",
              right: "5%",
              top: "3%",
              zIndex: 1,
            }}
            onPress={async () => {
              this.evaluatePanelPopup();

              this.mainContentSwiperRef.current.goToPage(1, true);
              this.setState({ selectedStrategy: this.currentStrategy });
              this.setState({
                selectedKeywords: this.currentStrategy.keywords,
              });
              this.setState({
                selectedStrategyPlans: this.currentStrategy.plans,
              });
              this.setState({ panelHeight: 250 });
              this.setState({
                title: "Review",
              });
              this.setState({ selectedStrategyDate: "" });
              // this._panel.hide();
              if (this.state.currentMonth != "THIS_MONTH") {
                this.resetCalendarToCurrentMonth();
              }

              this.setState({
                selectedStrategyDate: this.currentStrategy.startDate,
              });
              this.setState({
                monthCalStrategyStartDate: this.currentStrategy.startDate,
              });
              let eventDate = new Date(this.currentStrategy.startDate);
              await this.setState({ selectedDateRaw: eventDate });
              await this.setState({
                currentMonthDate: this.state.selectedDateRaw,
              });
              this.scrollToThisWeek();
            }}
          >
            <AntDesign name="pluscircle" size={24} color="black" />
          </TouchableOpacity> */}
					{/* Top Sliding Up Indication Bar */}
					<View
						style={{
							width: "30%",
							backgroundColor: "white",
							height: 7,
							borderRadius: 10,
							marginTop: 10,
						}}></View>
					{/* <View
            style={{
              height: 470,
              width: "100%",
              display: this.state.thirdSlidePanelPageUpdatedDisplay,
            }}
          >
            {thirdSlidePanelPageUpdated}
          </View> */}

					{/* Swipable Body Content */}
					<View
						style={{
							height: this.state.panelHeight,
							paddingBottom: 20,
							width: "100%",
							display: this.state.swipeAblePanelDisplay,
						}}>
						<Onboarding
							// bottomBarHighlight={false}
							// ref={this.mainContentSwiperRef}
							containerStyles={{ justifyContent: "flex-start" }}
							ref={this.panelSwiperRef}
							imageContainerStyles={{ height: this.state.panelHeight }}
							bottomBarHeight={30}
							showSkip={false}
							showNext={false}
							bottomBarColor="white"
							showDone={false}
							pageIndexCallback={async (index) => {
								this.setState({ mainContentSwiperDisplay: "flex" });
								this.setState({ conformationPageDisplay: "none" });
								this.mainContentSwiperRef.current.goToPage(index, true);

								//
								this.setState({ displayCalView: "flex" });
								this.setState({ displayTitle: "flex" });
								if (index === 1) {
									this.setState({ panelHeight: 450 });
									this._panel.hide();
									this.setState({
										hideIcon2: (
											<Ionicons
												name="chevron-up-circle"
												size={25}
												color="black"
											/>
										),
									});
									this.setState({ isPanelHided: true });
									this.setState({
										title: "Strategies",
									});
								} else if (index === 0) {
									this._panel.show();
									this.setState({
										hideIcon2: (
											<Ionicons
												name="chevron-down-circle"
												size={25}
												color="black"
											/>
										),
									});
									this.setState({ isPanelHided: false });
									this.onHideDetailPressed2();
									// this.onHideDetailPressed2();
									this.setState({ selectedStrategy: this.currentStrategy });
									this.setState({
										selectedKeywords: this.currentStrategy.keywords,
									});
									this.setState({
										selectedStrategyPlans: this.currentStrategy.plans,
									});
									this.setState({ panelHeight: 250 });
									this.setState({
										title: "Tracking",
									});
									this.setState({ selectedStrategyDate: "" });
									// this._panel.hide();
									if (this.state.currentMonth != "THIS_MONTH") {
										this.resetCalendarToCurrentMonth();
									}

									this.setState({
										selectedStrategyDate: this.currentStrategy.startDate,
									});
									this.setState({
										monthCalStrategyStartDate: this.currentStrategy.startDate,
									});
									let eventDate = new Date(this.currentStrategy.startDate);
									await this.setState({ selectedDateRaw: eventDate });
									await this.setState({
										currentMonthDate: this.state.selectedDateRaw,
									});
									this.scrollToThisWeek();
								}
							}}
							pages={[
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: thirdSlidePanelPageUpdated,
								},
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: secondSlidePanelPageUpdated,
								},
							]}
						/>
					</View>
					{/* Swipable Evaluation Content */}
					<View
						style={{
							height: this.state.panelHeight,
							paddingBottom: 20,
							width: "100%",
							// backgroundColor:"red",
							display: this.state.evaluatePanelDisplay,
						}}>
						<Onboarding
							// bottomBarHighlight={false}
							// ref={this.mainContentSwiperRef}
							containerStyles={{ justifyContent: "flex-start" }}
							// ref={this.panelSwiperRef}
							imageContainerStyles={{ height: this.state.panelHeight }}
							ref={this.evaluationSwipeRef}
							bottomBarHeight={30}
							showSkip={false}
							showNext={true}
							bottomBarColor="white"
							showDone={true}
							pageIndexCallback={async (index) => {
								this.setState({ evaluationPage_Index: index });
								if (index === 5) {
									this.mainContentSwiperRef.current.goToPage(1, true);
									await this.setState({ isPanelHided: false });
									await this.setState({
										hideIcon2: (
											<Ionicons
												name="chevron-down-circle"
												size={25}
												color="black"
											/>
										),
									});
									this.setState({ panelHeight: 450 });
									setTimeout(() => {
										this._panel.show();
									});
								} else {
									this.setState({ panelHeight: 300 });
								}
							}}
							NextButtonComponent={() => (
								<TouchableOpacity
									style={{ width: "100%", padding: "5%" }}
									onPress={() => {
										if (this.state.evaluationPage_Index === 3) {
											if (this.state.evaluationPage_FOUR_value === "Yes") {
												this.evaluationSwipeRef.current.goNext();
											} else {
												console.log(
													"Direct to new tracking page with same plans"
												);
											}
										} else if (this.state.evaluationPage_Index === 4) {
											if (this.state.evaluationPage_FIVE_value === "Yes") {
												this.evaluationSwipeRef.current.goNext();
											} else {
												console.log("Direct to plan set up");
											}
										} else {
											this.evaluationSwipeRef.current.goNext();
										}
									}}>
									<Text
										style={{
											fontFamily: "RobotoBoldBlack",
											textAlign: "right",
											marginRight: 10,
										}}>
										{this.state.evaluationNEXTbtnTxt}
									</Text>
								</TouchableOpacity>
							)}
							DoneButtonComponent={() => (
								<TouchableOpacity
									style={{ width: "100%", padding: "5%" }}
									onPress={() => {}}>
									<Text
										style={{
											fontFamily: "RobotoBoldBlack",
											textAlign: "right",
											marginRight: 10,
										}}>
										START TRACKING!
									</Text>
								</TouchableOpacity>
							)}
							// pageIndexCallback={(index) => {
							//   if (index === 1) {
							//     let updatedEvaluationList = this.state.keywordsBuddle;
							//     for (let key of updatedEvaluationList) {
							//       if ("isSelected" in key) {
							//       } else {
							//         key.isSelected = false;
							//         key.color = "UNDEFINED"
							//       }
							//     }
							//     this.setState({keywordsBuddle: updatedEvaluationList});
							//     console.log("this.state.keywordsBuddle",this.state.keywordsBuddle);
							//   }
							// }}
							pages={[
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: evaluatePage_ONE,
								},
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: evaluatePage_TWO,
								},
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: evaluatePage_THREE,
								},
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: evaluatePage_FOUR,
								},
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: evaluatePage_FIVE,
								},
								{
									title: "",
									subtitle: "",
									backgroundColor: "white",
									image: evaluatePage_SIX,
								},
							]}
						/>
					</View>
					{/* {firstSlidePanelPage} */}
					{/* {secondSlidePanelPage} */}
					{/* {thirdSlidePanelPage} */}
				</View>
			</SlidingUpPanel>
		);
		let reportScreen_ONE = (
			<View
				style={{ height: "100%", width: "100%", padding: 15, marginTop: 20 }}>
				<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 16 }}>
					Did you complete this activity as planned?
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
				<SwitchSelector
					options={REPORTSCREEN_ONE}
					buttonColor="black"
					borderColor="black"
					style={{ borderWidth: 2, borderRadius: 40, padding: 1 }}
					textStyle={{ fontSize: 10 }}
					selectedTextStyle={{ fontSize: 10 }}
					borderWidth={0}
					initial={parseInt(this.state.reportPageONEvalue) - 1}
					onPress={async (value) =>
						await this.setState({ reportPageONEvalue: value })
					}
				/>
				<View
					style={{
						// position: "absolute",
						// right: 15,
						// top: "5%",
						height: 20,
						width: 20,
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1,
						marginTop: 15,
					}}>
					<Popover
						popoverStyle={{ borderRadius: 20 }}
						from={
							<TouchableOpacity style={{ marginLeft: "5%" }}>
								<AntDesign name="questioncircle" size={18} color="black" />
							</TouchableOpacity>
						}>
						<View
							style={{
								height: 100,
								width: 350,
								alignItems: "center",
								justifyContent: "space-between",
								borderRadius: 20,
								transform: [{ scale: 0.8 }],
							}}>
							<Text
								style={{
									fontFamily: "RobotoBoldBold",
									fontSize: 14,
									color: "grey",
									textAlign: "left",
								}}>
								Yes - I completed the activity exactly as I planned
							</Text>
							<Text
								style={{
									fontFamily: "RobotoBoldBold",
									fontSize: 14,
									color: "grey",
								}}>
								I didn't do any activity - I didn't performed any physical
								activity today
							</Text>
							<Text
								style={{
									fontFamily: "RobotoBoldBold",
									fontSize: 14,
									color: "grey",
								}}>
								I did it differently - I did a different activity or I did it at
								the different time
							</Text>
						</View>
					</Popover>
				</View>
			</View>
		);
		let reportScreen_TWO = (
			<View
				style={{ height: "100%", width: "100%", padding: 15, marginTop: 20 }}>
				<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 16 }}>
					How satisfied are you with this activity?
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
				<SwitchSelector
					options={REPORTSCREEN_TWO}
					buttonColor="black"
					borderColor="black"
					style={{ borderWidth: 2, borderRadius: 40, padding: 1 }}
					textStyle={{ fontSize: 10 }}
					selectedTextStyle={{ fontSize: 10 }}
					borderWidth={0}
					initial={parseInt(this.state.satisfactionScore) - 1}
					onPress={(value) => {
						this.setState({ satisfactionScore: value });
					}}
				/>
				<View
					style={{
						width: "100%",
						// height: 5,
						// backgroundColor: "black",
						borderRadius: 10,
						justifyContent: "space-between",
						flexDirection: "row",
						marginTop: 10,
						marginBottom: 30,
					}}>
					<Text style={{ fontWeight: "bold", fontSize: 10, width: 70 }}>
						Not Satisfied
					</Text>
					<Text
						style={{
							fontWeight: "bold",
							fontSize: 10,
							width: 70,
							textAlign: "right",
						}}>
						Indifferent
					</Text>
					<Text
						style={{
							fontWeight: "bold",
							fontSize: 10,
							width: 90,
							textAlign: "right",
						}}>
						Very Satisfied
					</Text>
				</View>
			</View>
		);
		let reportScreen_THREE = (
			<View
				style={{ height: "100%", width: "100%", padding: 15, marginTop: 20 }}>
				<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 16 }}>
					Tell us the reason why you didn’t complete this activity as planned
				</Text>
				<View
					style={[
						{
							width: "100%",
							height: 5,
							backgroundColor: "black",
							borderRadius: 10,
							marginTop: 10,
							marginBottom: 30,
						},
					]}></View>
				<View
					style={[
						generalStyles.shadowStyle,
						{
							backgroundColor: "white",
							height: "15%",
							borderRadius: 20,
							borderWidth: 0,
							borderColor: "black",
							marginRight: 0,
							flexDirection: "row",
							alignItems: "center",
							justifyContent: "flex-start",
						},
					]}>
					<TextInput
						style={{
							fontSize: 16,
							marginLeft: 15,
							marginRight: 5,
							// backgroundColor: "red",
							width: "100%",
							height: "100%",
							// textAlign: "center",
							// fontFamily: "RobotoBoldItalic",
						}}
						placeholder="e.g., Time conflicts"
						value={this.state.reportScreen_THREETxt}
						onChangeText={(text) => {
							this.setState({ reportScreen_THREETxt: text });
						}}></TextInput>
				</View>
			</View>
		);
		let reportScreen_FOUR = (
			<View
				style={{ height: "100%", width: "100%", padding: 15, marginTop: 20 }}>
				<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 16 }}>
					Did you complete this activity as planned?
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
				<SwitchSelector
					options={REPORTSCREEN_FOUR}
					buttonColor="black"
					borderColor="black"
					style={{ borderWidth: 2, borderRadius: 40, padding: 1 }}
					textStyle={{ fontSize: 10 }}
					selectedTextStyle={{ fontSize: 10 }}
					borderWidth={0}
					initial={0}
					onPress={async (value) =>
						this.setState({ reportPage_FOUR_value: value })
					}
				/>
			</View>
		);
		let reportScreen_FIVE = (
			<View
				style={{ height: "100%", width: "100%", padding: 15, marginTop: 20 }}>
				<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 16 }}>
					Tell us the difference from what you planned:
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
								optionContainerStyle={[
									generalStyles.shadowStyle,
									{
										borderWidth: 0,
										backgroundColor: "white",
										borderColor: "grey",
										// borderWidth: 2,
										borderRadius: 15,
									},
								]}
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
			</View>
		);
		let reportScreen_SIX = (
			<View
				style={{ height: "100%", width: "100%", padding: 15, marginTop: 20 }}>
				<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 16 }}>
					Tell us the different activity you did at this time:
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
									borderWidth: 0,
									backgroundColor: "white",
									borderColor: "grey",
									borderWidth: 2,
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
								initValue={"Select Here"}
								onChange={async (item) => {
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
			</View>
		);
		let reportScreen_SEVEN = (
			<View
				style={{ height: "100%", width: "100%", padding: 15, marginTop: 20 }}>
				<FlashMessage position="bottom" />
				<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 16 }}>
					Did you perform any other physical activities on{" "}
					{this.state.dailyReportDate}?{" "}
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
				<SwitchSelector
					options={REPORTSCREEN_SEVEN}
					buttonColor="black"
					borderColor="black"
					style={{ borderWidth: 2, borderRadius: 40, padding: 1 }}
					textStyle={{ fontSize: 10 }}
					selectedTextStyle={{ fontSize: 10 }}
					borderWidth={0}
					initial={0}
					onPress={async (value) => {
						console.log("value", value);
						this.setState({ reportPage_SEVEN_value: value });
						if (value === "No") {
							this.setState({ reportNEXTbtn: "SUBMIT" });
						} else {
							this.setState({ reportNEXTbtn: "NEXT" });
						}
					}}
				/>
			</View>
		);
		let reportScreen_EIGHT = (
			<View
				style={{ height: "100%", width: "100%", padding: 15, marginTop: 5 }}>
				<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 16 }}>
					Tell us what are other activities you did?{" "}
				</Text>
				<Text style={{ fontFamily: "RobotoRegular", fontSize: 11 }}>
					If you didn't performed any other activities, skip this step and
					submit{" "}
				</Text>
				<View
					style={{
						width: "100%",
						height: 5,
						backgroundColor: "black",
						borderRadius: 10,
						marginTop: 10,
						marginBottom: 10,
					}}></View>
				<Text
					style={{
						fontFamily: "RobotoBoldItalic",
						fontSize: 16,
						marginBottom: 5,
					}}>
					Unplanned Activities
				</Text>
				{/* Activity List */}
				<View
					style={[
						generalStyles.shadowStyle,
						{ width: "100%", height: 150, paddingHorizontal: 0 },
					]}>
					<FlatList
						data={this.state.selfReportedActivityList}
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
									<View
										style={[
											{
												width: "100%",
												height: 39,
												borderRadius: 20,
												borderColor: "#F0F0F0",
												borderWidth: 1,
												paddingHorizontal: 0,
												flexDirection: "row",
												alignItems: "center",
												justifyContent: "space-between",
												marginTop: 5,
											},
										]}>
										<Text
											ellipsizeMode="tail"
											numberOfLines={1}
											style={{
												fontFamily: "RobotoBoldBold",
												fontSize: 14,
												paddingLeft: 8,
												width: 100,
											}}>
											{item.title}
										</Text>
										<Text style={{ fontFamily: "RobotoRegular", fontSize: 14 }}>
											{timing}
										</Text>
										<Text style={{ fontFamily: "RobotoRegular", fontSize: 14 }}>
											{/* {item.duration} */}
										</Text>
										<TouchableOpacity
											onPress={() => this.deleteActivity_reportScreen(item)}>
											<Ionicons
												name="md-close-circle"
												size={24}
												color="black"
											/>
										</TouchableOpacity>
									</View>
								);
							}
							// console.log("items in plansBuddle", item);
						}}
					/>
				</View>
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
								height: "50%",
								width: "100%",
								justifyContent: "center",
								alignItems: "center",
							}}>
							<ModalSelector
								style={{ borderWidth: 0, borderRadius: 20 }}
								// touchableStyle={{ color: "white" }}
								optionContainerStyle={[
									generalStyles.shadowStyle,
									{
										borderWidth: 0,
										backgroundColor: "white",
										borderColor: "grey",
										// borderWidth: 2,
										borderRadius: 15,
									},
								]}
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
								initValue={"Select Here"}
								onChange={async (item) => {
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
						<Text style={{ fontFamily: "RobotoBoldBold", fontSize: 14 }}>
							Self-Defined
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
				{/* Second Row of Date & Time Selection */}
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
						// paddingHorizontal: "5%",

						height: 90,
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
				<View style={{ alignItems: "center", justifyContent: "center" }}>
					<TouchableOpacity
						onPress={() => this.onPlanBtnPressed_reportScreen()}>
						<AddActivityBtn height={32} width={202} marginTop={"2%"} />
					</TouchableOpacity>
				</View>
			</View>
		);
		let tip_ONE = (
			<View style={{ height: "100%", width: "100%",  }}>
				<View style={{height: "100%", width: "100%",justifyContent:"flex-start", alignItems:"center", flexDirection:"column"}}>
					<TipCalendar1 height={"100%"} width={"100%"} />
				</View>
			</View>
		);
		let tip_TWO = (
			<View style={{ height: "100%", width: "100%",  }}>
				<View style={{height: "100%", width: "100%",justifyContent:"flex-start", alignItems:"center", flexDirection:"column"}}>
					<TipCalendar2 height={"100%"} width={"100%"} />
				</View>
			</View>
		);
		let tip_THREE = (
			<View style={{ height: "100%", width: "100%",  }}>
				<View style={{height: "100%", width: "100%",justifyContent:"flex-start", alignItems:"center", flexDirection:"column"}}>
					<TipCalendar3 height={"100%"} width={"100%"} />
				</View>
			</View>
		);
		let tip_FOUR = (
			<View style={{ height: "100%", width: "100%",  }}>
				<View style={{height: "100%", width: "100%",justifyContent:"flex-start", alignItems:"center", flexDirection:"column"}}>
					<TipCalendar4 height={"100%"} width={"100%"} />
				</View>
			</View>
		);
		let tip_FIVE = (
			<View style={{ height: "100%", width: "100%",  }}>
				<View style={{height: "100%", width: "100%",justifyContent:"flex-start", alignItems:"center", flexDirection:"column"}}>
					<TipCalendar5 height={"100%"} width={"100%"} />
				</View>
			</View>
		);

		return (
			// <KeyboardAvoidingView
			//   behavior={Platform.OS === "ios" ? "padding" : "height"}
			// >
			//   <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View
				style={{
					backgroundColor: "white",
					width: "100%",
					height: "100%",
					justifyContent: "flex-start",
					alignItems: "center",
				}}>
				<FlashMessage position="bottom" />

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
						height: 20,
						width: 20,
						justifyContent: "center",
						alignItems: "center",
					}}>
					<Popover
						popoverStyle={{ borderRadius: 20 }}
						from={
							<TouchableOpacity style={{ marginLeft: "5%" }}>
								<AntDesign name="infocirlce" size={18} color="black" />
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
					<Text style={{ fontFamily: "RobotoBoldItalic", fontSize: 24 }}>
						{this.state.title}
					</Text>
				</View>
				{/* {Report Popup} */}
				<KeyboardAvoidingView>
					<RNModal
						animationType="slide"
						// propagateSwipe={true}
						visible={this.state.isReportModalVis}
						style={{
							justifyContent: "flex-start",
							alignItems: "center",
							marginTop: "75%",
						}}
						presentationStyle="overFullScreen"
						transparent={true}
						// hasBackdrop={true}
						// backdropOpacity={0}
						// onBackdropPress={() => this.setState({ isReportModalVis: false })}
						// onSwipeComplete={() => this.setState({ isReportModalVis: false })}
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
										width: "90%",
										height: this.state.reportModalHeight,
										borderRadius: 20,
										backgroundColor: "white",
										justifyContent: "center",
										alignItems: "center",
									},
								]}>
								<View
									style={{
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										marginTop: 10,
										width: "95%",
										marginBottom: 10,
									}}>
									<Text
										style={{
											fontFamily: "RobotoBoldItalic",
											fontSize: 20,
											marginLeft: 10,
										}}>
										Daily Report
									</Text>
									<TouchableOpacity
										onPress={() => {
											this.onDailyReportClose();

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
											moment(this.state.reportStart)
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
								<Swiper
									activeDotColor="black"
									index={this.state.currentSwipeIndex}
									showsButtons={false}
									autoplay={false}
									loop={false}
									keyboardShouldPersistTaps="handled"
									scrollEnabled={false}
									ref={this.reportModalSwiperRef}
									nextButton={<Text style={{ fontWeight: "bold" }}>NEXT</Text>}
									prevButton={<Text style={{ fontWeight: "bold" }}>PREV</Text>}
									showsPagination={false}
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
									{reportScreen_ONE}
									{reportScreen_TWO}
									{reportScreen_THREE}
									{reportScreen_FOUR}
									{reportScreen_FIVE}
									{reportScreen_SIX}
									{reportScreen_SEVEN}
									{reportScreen_TWO}
									{reportScreen_EIGHT}
								</Swiper>
								{/* <View style={{width:"90%", height:"50%"}}> */}
								<View
									style={{
										width: "80%",
										flexDirection: "row",
										justifyContent: "space-between",
										position: "absolute",
										bottom: 20,
										borderTopWidth: 2,
									}}>
									<TouchableOpacity
										disabled={this.state.isReportSwipePERVdisabled}
										style={{ display: this.state.isReportSwipePERVvis }}
										onPress={() => {
											this.onReportPrevBtnPressed();
										}}>
										<Text style={{ fontWeight: "bold" }}>PREV</Text>
									</TouchableOpacity>
									<TouchableOpacity
										onPress={() => {
											this.onReportNextBtnPressed();
										}}>
										<Text style={{ fontWeight: "bold" }}>
											{this.state.reportNEXTbtn}
										</Text>
									</TouchableOpacity>
								</View>
							</View>
						</View>
					</RNModal>
				</KeyboardAvoidingView>
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
						<View style={{ backgroundColor: "white", borderRadius: 20 }}>
							<Text
								style={{
									fontSize: 12,
									fontFamily: "RobotoBoldBold",
									marginTop: 0,
									marginLeft: "10%",
								}}>
								{this.state.strategyDuration}
							</Text>
						</View>
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
								{this.state.keywordsBuddle.map((item) => {
									return (
										<View
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
									style={{ position: "absolute", top: 3, right: 3, zIndex: 1 }}
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
									{/* <View
                    style={{
                      flex: 0.4,
                      width: "90%",
                      marginTop: 10,
                      marginLeft: 10,
                      marginBottom: 0,
                    }}
                  >
                    <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                      Records on {this.eventToday.title},{" "}
                      {this.state.detailViewTop}
                    </Text>
                  </View> */}
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
											{/* <Image
                        source={{
                          uri:
                            "http://openweathermap.org/img/wn/" +
                            this.selectedWeatherIcon +
                            ".png",
                        }}
                        style={{ width: 60, height: 60 }}
                      ></Image> */}
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
												style={{ fontSize: 18, fontFamily: "RobotoBoldBlack" }}>
												{this.selectedTemp}°F
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
																moment(item.start).format("ddd").toUpperCase() +
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
					<CalendarHeader height={15} width={"100%"} />
					<View
						style={{
							height: this.state.calendarViewHeight,
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
								monthCalStrategyStartDate={this.state.monthCalStrategyStartDate}
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
								style={{ position: "absolute", top: "5%", right: 10, zIndex: 1 }}
								onPress={() => {
									this.setState({ isGuideVis: false });

									// this.reportModalSwiperRef.current.scrollBy(2, true);
								}}>
								{/* <AntDesign name="closecircle" size={24} color="black" /> */}
								<Text style={{fontWeight:"bold", color:"white", fontSize:18}}>SKIP</Text>
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
								nextButton={<TouchableOpacity onPress={()=>{this.tipModalSwiperRef.current.scrollBy(1,false)}}><Text style={{ fontWeight: "bold", color:"white",fontSize:18 }}>NEXT</Text></TouchableOpacity>}
								prevButton={<TouchableOpacity onPress={()=>{this.tipModalSwiperRef.current.scrollBy(-1,false)}}><Text style={{ fontWeight: "bold", color:"white",fontSize:18 }}>PREV</Text></TouchableOpacity>}
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
							</Swiper>
						</View>
					</View>
				</RNModal>
				{/* Confirmation Page */}
				{/* <View
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "white",
            display: this.state.conformationPageDisplay,
          }}
        >
          {finalConfirmationPage}
        </View> */}
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
					{/* <Swiper gesturesEnabled={() => false} ref={this.mainContentSwiperRef}>
            {planSetUpPage}
            {summaryPage}
            {finalConfirmationPage}
          </Swiper> */}
					<Onboarding
						bottomBarHighlight={false}
						ref={this.mainContentSwiperRef}
						showSkip={false}
						showNext={false}
						pageIndexCallback={(index) => {
							if (this.state.evaluatePanelDisplay === "none") {
								this.panelSwiperRef.current.goToPage(index, true);
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
				{slideUpPanel}
			</View>
		);
	}
}
AppRegistry.registerComponent("Planneregy", () => TrackingPage);
