import * as SecureStore from "expo-secure-store";
import moment, { min } from "moment";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./secret";
import * as Notification from "expo-notifications";

class DataModel {
  constructor() {
    console.log("create database");
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);

    this.usersRef = collection(this.db, "users");

    this.key = "";
    this.plans = [];
    this.strategies = [];

    this.asyncInit();
  }
  //init firebase
  asyncInit = async () => {
    console.log("database initialized");

    this.users = [];
    this.plans = [];
    this.strategies = [];
    this.key = "";
    await this.askPermission();
    // await this.loadUsers();
    //console.log("this.users", this.users);
  };

  //Create new user and create default activities
  createNewUser = async (username) => {
    let newUser = {
      email: username,
    };
    let newUsersDocRef = await this.usersRef.add(newUser);
    let key = newUsersDocRef.id;
    await this.usersRef.doc(key).update({ id: key });
    let testColl = {
      test: 1,
    };
    let newUserColl = await newUsersDocRef.collection("activity_plans");
    let newUserStrategyColl = await newUsersDocRef.collection("my_strategies");
    await newUserColl.add(testColl);

    let userActivityList = {
      activityList: [
        "Walking",
        "Jogging",
        "Gardening",
        "Biking",
        "Jumping Rope",
      ],
    };
    let activityList = await this.usersRef.doc(key).collection("my_activities");

    await activityList.add(userActivityList);

    this.key = key;
  };
  //Get user-defined activity types
  getUserActivities = async (key) => {
    console.log("getUserActivities");
    let activityQuerySnap = await this.usersRef
      .doc(key)
      .collection("my_activities")
      .get();
    let userActivityList = [];

    activityQuerySnap.forEach((qDocSnap) => {
      let data = qDocSnap.data();

      userActivityList.push(data);
    });
    return userActivityList;
  };
  //Load users' self-created plans
  loadUserPlans = async (key) => {
    let userPlanCollection = await this.usersRef
      .doc(key)
      .collection("activity_plans")
      .get();
    userPlanCollection.forEach(async (qDocSnap) => {
      let key = qDocSnap.id;
      let plan = qDocSnap.data();
      plan.key = key;
      this.plans.push(plan);
    });
  };
  getActivityKey = async(key, onReportActivity) => {
    let activityKey;
    let userPlanCollection = await this.usersRef
    .doc(key)
    .collection("activity_plans")
    .get();
    userPlanCollection.forEach(async (qDocSnap) => {

      if (qDocSnap.data().key === onReportActivity.key) {
        console.log(qDocSnap.data());
        activityKey = qDocSnap.id;
      }
    });
    return activityKey;
  }
  loadUserStrategies = async (key) => {
    this.strategies = [];
    let UserStrategyCollection = await this.usersRef
      .doc(key)
      .collection("my_strategies")
      .get();
    UserStrategyCollection.forEach(async (qDocSnap) => {
      let key = qDocSnap.id;
      let strategy = qDocSnap.data();
      strategy.key = key;
      this.strategies.push(strategy);
    });
  };
  //Update the weather list to Firebase
  updateWeatherInfo = async (key, fullWeatherList) => {
    let weatherList = await this.usersRef
      .doc(key)
      .collection("weather_records");
    for (let weather of fullWeatherList) {
      await weatherList.add(weather);
    }
  };
  //Check if the user defined activity list exist
  isUserDefineActivitiesExist = async (key) => {
    let userDefineActivities = await this.usersRef
      .doc(key)
      .collection("my_activities")
      .limit(1)
      .get();

    return userDefineActivities.empty;
  };
  //Create default activities
  createUserActivities = async (key) => {
    let userActivityList = {
      activityList: [
        "Walking",
        "Jogging",
        "Gardening",
        "Biking",
        "Jumping Rope",
      ],
    };
    let activityList = await this.usersRef.doc(key).collection("my_activities");
    // for (let activity of userActivityList) {
    //   await activityList.add(activity);
    // }
    await activityList.add(userActivityList);
  };
  //Update user-defined activity list with new activity
  updateUserActivities = async (key, activity) => {
    console.log("key", key);
    console.log("activity", activity);
    let activityQuerySnap = await this.usersRef
      .doc(key)
      .collection("my_activities")
      .get();
    let docKey;
    let userActivityList = [];
    activityQuerySnap.forEach((qDocSnap) => {
      docKey = qDocSnap.id;
      let data = qDocSnap.data();
      userActivityList.push(data);
    });
    userActivityList[0].activityList.push(activity);
    let updatedList = {
      activityList: userActivityList[0].activityList,
    };
    //console.log("updatedList", updatedList);
    //console.log("docKey", docKey);
    await this.usersRef
      .doc(key)
      .collection("my_activities")
      .doc(docKey)
      .update(updatedList);
  };
  //Ask user's permission to push notifications
  askPermission = async () => {
    const perms = await Notification.getPermissionsAsync();
    let granted = perms.granted;
    console.log("tried to get permissions", perms);
    if (!granted) {
      const newPerms = await Notification.requestPermissionsAsync();
      granted = newPerms.granted;
    }
    return granted;
  };
  //Create notification to the next 7 days: reminds users at 20:00
  createDailyNotifications = async () => {
    let startDate = new Date();
    for (let i = 0; i <= 7; i++) {
      let nextDate = startDate.setDate(startDate.getDate() + 1);
      let trigger = new Date(
        Date.parse(moment(nextDate).format().slice(0, 11) + "20:00:00")
      );
      await Notification.scheduleNotificationAsync({
        content: {
          title: "How's everything going",
          body: "Take some time to report you day!",
          data: { data: "goes here" },
        },
        trigger,
      });
    }
    console.log("createDailyNotifications");
  };
  //Schedule notification when here is a plan: reminds users 1 hour before
  scheduleNotification = async (newEvent) => {
    //2021-04-16T10:37:00
    //let trigger = new Date(Date.now() + 5 * 1000);
    let startTime = newEvent.start;
    let trigger = new Date(Date.parse(startTime) - 60 * 60 * 1000);
    //let secTrigger = new Date(Date.parse(startTime) + 7 * 1000);
    console.log("trigger", trigger);

    let identifier = await Notification.scheduleNotificationAsync({
      content: {
        title: "Upcoming Physical Activity",
        body: newEvent.title + " is about to happen in an hour",
        data: { data: "goes here" },
      },
      trigger,
    });
    console.log("identifier1", identifier);
    return identifier;
  };
  //Schedule report notification when here is a plan: remind users at 21:00
  scheduleReportNotification = async (newEvent) => {
    let reportStartTime = newEvent.start.slice(0, 11) + "21:00:00";
    //console.log("reportStartTime", reportStartTime);
    let trigger = new Date(Date.parse(reportStartTime));
    //console.log("reportTrigger", reportTrigger);
    let identifier = await Notification.scheduleNotificationAsync({
      content: {
        title: "Take some time to report your activity",
        body: "What is your experience with " + newEvent.title,
        data: { data: "goes here" },
      },
      trigger,
    });
    console.log("identifier2", identifier);
    return identifier;
  };
  //Upload new plan to firebase
  createNewPlan = async (key, newEvent) => {
    //newEvent.reminderKey = await this.scheduleNotification(newEvent);
    //newEvent.reportReminderKey = await this.scheduleReportNotification(newEvent);
    // console.log("data modal",newEvent);
    let userPlanCollection = await this.usersRef
      .doc(key)
      .collection("activity_plans")
      .add(newEvent);
  };
  //Update the specified plan
  updatePlan = async (userKey, newEvent) => {
    let newEventRef = this.usersRef
      .doc(userKey)
      .collection("activity_plans")
      .doc(newEvent.key);
    newEventRef.update(newEvent);
  };
  //Update the specified strategy
  updateStrategy = async (userKey, newStrategy) => {
    let newStrategyRef = this.usersRef
      .doc(userKey)
      .collection("my_strategies")
      .doc(newStrategy.key);
      newStrategyRef.update(newStrategy);
  };
  //Cancel reminders associated with the deleted event
  deleteReminders = async (newEvent) => {
    await Notification.cancelScheduledNotificationAsync(
      newEvent.activityReminderKey
    );
    await Notification.cancelScheduledNotificationAsync(
      newEvent.reportReminderKey
    );
  };

  // //Check if the user defined activity list exist
  // isUserDefinePlanStrategyListExist = async (key) => {
  //   let userDefineStrategies = await this.usersRef
  //     .doc(key)
  //     .collection("my_strategies")
  //     .limit(1)
  //     .get();

  //   return userDefineStrategies.empty;
  // };

  addToUserDefinedPlanStrategyList = async (key, newStrategy) => {
    let userDefinedPlanStrategyList = await this.usersRef
      .doc(key)
      .collection("my_strategies")
      .add(newStrategy);
  };

  getUserKey = () => {
    return this.key;
  };
  getUserPlans = () => {
    return this.plans;
  };
  getUserStrategies = () => {
    return this.strategies;
  };
}

let theDataModel = undefined;

export function getDataModel() {
  if (!theDataModel) {
    theDataModel = new DataModel();
  }
  return theDataModel;
}
