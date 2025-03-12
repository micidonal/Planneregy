# Planneregy

**Done So Far**
 - API keys for Firebase, Google Cloud, Open Weather Map updated in secret.js
 - OpenWeather API calls updated in BeforeLoginScreen.js (using https://openweathermap.org/api/one-call-3 documentation), hopefully right
 - Locate and adjust API call related code in DataModel.js (Firebase calls) and Login.js (Google Cloud calls) to ensure they work properly
 - Ensure depreciated packages/imports used in the original project still work and any issues can be adjusted for by adjusting import versions and not the code itself
 - Tested the code using Expo ('expo start' or 'npx expo start' depending on imports to local machine) and iPhones (download ExpoGo from AppStore), mostly stable
    - Gets through each .js file at least once, on sequential logins of the same account errors occur (for testing, hit reset button on login screen each time, error discussed below)

   
**Need To Do**
 - *react-native-modal-selector* causing only error, happens on sequential logins, seems to tie back to library being 8+ years old and recent **React** versions affect usability
    - Currently, testing possible solution with library fork, linking it locally and changing code that causes issue (just one line)
 - (Likely) Some UI Tweaks/Fixes once ModalSelector is done and we can see the whole app (odds are there will be a few spacing issues in the newly available screens)
  
# How to Test
 - Clone this repo locally
 - Ensure you have expo/eas installed ("npm install -g expo-cli eas-cli")
 - Login to Expo with your account info (the one tied to cs-4605-team org with the planneregy project)
 - Before running, you *must* check Login.js for tempToken (Dev login workaround)
    - **Note:** The Dev login workaround has mostly to due with just rough testing capabilities w/o App Store Connect, shouldn't be nearly as rough with it
    - Go to https://developers.google.com/oauthplayground/
    - Login Credentials:
       - Email: planneregyemailtest@gmail.com
       - Password: CS460533
    - In Step 1, Select the API "https://www.googleapis.com/auth/calendar.readonly" under Google Calendar API v3
    - Hit "Authorize APIs"
    - In Step 2, hit "Exchange authorization code for tokens"
    - Copy the token in the Access token box and paste it in Login.js for "const tempToken"
       - This value expires every hour, so don't forget to refresh it and reassign it every hour
 - Now, in the CLI run "npm install --legacy-peer-deps"
 - Next, in the CLI run "npx expo start --clear --tunnel" (--clear is optional, --tunnel required for ExpoGo testing)
 - If asked, press 'y' for the use of a port
 - When the console shows the loaded expo start visual, scan the QR code for ExpoGo or use the localhost link for Web testing
    - If QR code doesn't work, press 's' and when it reloads try again
 - For App testing, it will take you to ExpoGo (either directly or routed through browser)
    - Make sure you have downloaded and logged into ExpoGo
 - Once there, wait for the app to load. Eventually, you will see the start menu.
    - If this is your *first* time (since restart/initial), you can just hit "Login with Google" and *cancel* the redirect request (part of the Dev workaround)
    - If this is not your first time, tap "Reset" at the top of this screen and hit "Confirm", then continue with the process above (avoids initial crash)
      - Don't do this if you want to see initial crash logs
 - Move through the Onboarding screen, when you hit the last check, you will see a lot of console logs, and it will eventually load main navigation screen
 - You can mess around with it from here (will crash if you try to add a new plan, as it encounters **ModalSelector** when loading *PlanOnCalendar.js*/*TrackingPage.js* and the same error occurs)
