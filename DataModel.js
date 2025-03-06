import * as SecureStore from "expo-secure-store";
import moment, { min } from "moment";

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  limit } from "firebase/firestore";
import { firebaseConfig } from "./secret";
import * as Notifications from "expo-notifications";

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
    let newUser = { email: username };
    let newUsersDocRef = await addDoc(this.usersRef, newUser);
    let key = newUserDocsRef.id;
    
    await updateDoc(doc(this.db, "users", key), { id: key });
    let testColl = {
      test: 1,
    };
    //let newUserColl = await newUsersDocRef.collection("activity_plans");
    //let newUserStrategyColl = await newUsersDocRef.collection("my_strategies");
    //await newUserColl.add(testColl);
    await addDoc(collection(newUserDocRef, "activity_plans"), testColl);

    let userActivityList = {
      activityList: [
        "Walking",
        "Jogging",
        "Gardening",
        "Biking",
        "Jumping Rope",
      ],
    };
    //let activityList = await this.usersRef.doc(key).collection("my_activities");
    //await activityList.add(userActivityList);
    await addDoc(collection(newUserDocRef, "my_activities"), userActivityList);

    this.key = key;
  };
  //Get user-defined activity types
  getUserActivities = async (key) => {
    console.log("getUserActivities");
    /*let activityQuerySnap = await this.usersRef
      .doc(key)
      .collection("my_activities")
      .get();*/
    let activityQuerySnap = await getDocs(collection(this.db, "users", key, "my_activities"));
    let userActivityList = [];

    activityQuerySnap.forEach((qDocSnap) => {
      let data = qDocSnap.data();

      userActivityList.push(data);
    });
    return userActivityList;
  };
  //Load users' self-created plans
  loadUserPlans = async (key) => {
    let userPlanCollection = collection(this.db, "users", key, "activity_plans");
    let querySnapshot = await getDocs(userPlanCollection);

    querySnapshot.forEach((qDocSnap) => {
      let plan = qDocSnap.data();
      plan.key = qDocSnap.id;
      this.plans.push(plan);
    });
  };
  getActivityKey = async(key, onReportActivity) => {
    let activityKey;
    let userPlanCollection = collection(this.db, "users", key, "activity_plans");
    let querySnapshot = await getDocs(userPlanCollection);

    for (let qDocSnap of querySnapshot.docs) {
      if (qDocSnap.data().key === onReportActivity.key) {
        activityKey = qDocSnap.id;
        break;
      }
    }
    return activityKey;
  };
  loadUserStrategies = async (key) => {
    this.strategies = [];
    let userStrategyCollection = collection(this.db, "users", key, "my_strategies");
    let querySnapshot = await getDocs(userStrategyCollection);

    querySnapshot.forEach((qDocSnap) => {
      let strategy = qDocSnap.data();
      strategy.key = qDocSnap.id;
      this.strategies.push(strategy);
    });
  };
  //Update the weather list to Firebase
  updateWeatherInfo = async (key, fullWeatherList) => {
    let weatherListRef = collection(this.db, "users", key, "weather_records");

    for (let weather of fullWeatherList) {
      await addDoc(weatherListRef, weather);
    }
  };
  //Check if the user defined activity list exist
  isUserDefineActivitiesExist = async (key) => {
    let userDefineActivitiesQuery = query(
      collection(this.db, "users", key, "my_activities"),
      limit(1)
    );
    let querySnapshot = await getDocs(userDefineActivitiesQuery);
  
    return querySnapshot.empty;
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
    let activityList = collection(this.db, "users", key, "my_activities");
    // for (let activity of userActivityList) {
    //   await activityList.add(activity);
    // }
    await addDoc(activityListRef, userActivityList);
  };
  //Update user-defined activity list with new activity
  updateUserActivities = async (key, activity) => {
    console.log("key", key);
    console.log("activity", activity);
    let activityQuerySnap = await getDocs(collection(this.db, "users", key, "my_activities"));
    let docKey;
    let userActivityList = [];
    activityQuerySnap.forEach((qDocSnap) => {
      docKey = qDocSnap.id;
      let data = qDocSnap.data();
      userActivityList.push(data);
    });
    if (userActivityList.length > 0) {
      userActivityList[0].activityList.push(activity);
      let updatedList = { activityList: userActivityList[0].activityList };
  
      await updateDoc(doc(this.db, "users", key, "my_activities", docKey), updatedList);
    }
  };
  //Ask user's permission to push notifications
  askPermission = async () => {
    const perms = await Notifications.getPermissionsAsync();
    let granted = perms.granted;
    console.log("tried to get permissions", perms);
    if (!granted) {
      const newPerms = await Notifications.requestPermissionsAsync();
      granted = newPerms.granted;
    }
    return granted;
  };
  //Create notification to the next 7 days: reminds users at 20:00
  createDailyNotifications = async () => {
    let startDate = new Date();
    for (let i = 0; i <= 7; i++) {
      let nextDate = new Date(startDate);
      nextDate.setDate(nextDate.getDate() + i);
      let trigger = new Date(moment(nextDate).format("YYYY-MM-DD") + "T20:00:00");
      await Notifications.scheduleNotificationAsync({
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

    let identifier = await Notifications.scheduleNotificationAsync({
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
    let reportStartTime = newEvent.start.slice(0, 10) + "T21:00:00";
    //console.log("reportStartTime", reportStartTime);
    let trigger = new Date(Date.parse(reportStartTime));
    //console.log("reportTrigger", reportTrigger);
    let identifier = await Notifications.scheduleNotificationAsync({
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
    let userPlanCollection = collection(this.db, "users", key, "activity_plans");
    await addDoc(userPlanCollection, newEvent);
  };
  //Update the specified plan
  updatePlan = async (userKey, newEvent) => {
    const newEventRef = doc(this.db, "users", userKey, "activity_plans", newEvent.key);
    await updateDoc(newEventRef, newEvent);
  };
  //Update the specified strategy
  updateStrategy = async (userKey, newStrategy) => {
    const newStrategyRef = doc(this.db, "users", userKey, "my_strategies", newStrategy.key);
    await updateDoc(newStrategyRef, newStrategy);
  };
  //Cancel reminders associated with the deleted event
  deleteReminders = async (newEvent) => {
    await Notifications.cancelScheduledNotificationAsync(
      newEvent.activityReminderKey
    );
    await Notifications.cancelScheduledNotificationAsync(
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
    const userDefinedPlanStrategyListRef = collection(this.db, "users", key, "my_strategies");
    await addDoc(userDefinedPlanStrategyListRef, newStrategy);
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
