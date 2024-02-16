# FullstackApp
Source Code Setup Instructions
1) Begin by downloading the source code onto your system.
2) Install Visual Studio Code, a versatile code editor.
3) Launch Visual Studio Code and import the source code folder.
4) Open two terminals within Visual Studio Code, such as PowerShell.
*Note that you will require 2 .env files for the source code set up, it will not work if the .env files are not present (one is to be placed in the backend folder the other in the frontend folder)

Terminal 1:
Ensure that you are already in the FullstackApp directory. If not, navigate to it by entering cd FullstackApp.
Execute the command npm install (This is a one-time process to install dependencies for the backend).
Once installation completes, start the backend server by typing npm start.

Terminal 2:
Switch to a new terminal window.
Ensure that you are already in the FullstackApp directory. If not, navigate to it by entering cd FullstackApp.
Enter the frontend directory by typing cd frontend.
Perform npm install (This is a one-time process to install dependencies for the frontend).
Finally, initiate the Expo server by typing npx expo start.
A QR code should appear after initialisation.

5) Retrieve your mobile device and download the "Expo Go" app from your respective app store.

6) Launch the Expo Go app and scan the QR code displayed in the terminal; this will load the application on your phone
.
7) Upon launching the app, you'll encounter a sign-in screen. To proceed:

8) For regular user access, you can either create a new account or use the predefined credentials: username - testuser, password - 12345678.

9) For system administrator access, utilize the username testadmin with the password 12345678.

10) For business partner access, enter testbizpartner as the username and 12345678 as the password.

11) Please note, the online API for recipe requests has a limited number of calls per day. If you encounter blank sections in the online recipes, it indicates that the API requests have been exhausted for the day. However, you can modify the API key by commenting out the old key and uncommenting a different one in the source code. Simply save the changes with ctrl + s to re-enable the online API, unless the request quota has been depleted.

12) Should you still encounter any issues during usage, you can refresh the app by pressing the 'R' key in the terminal from which the app was launched.


## Dependencies

- Node
- React Native
- Nodemon
- Mongoose
- Dotenv

## Frameworks

### Backend

- Express
- MongoDB

### Frontend

- React Native

## Brief Description of the App

Aim of the project is to design and develop a mobile application for diet and nutrition

## Goals

- allowing user to define the goal (calorie limit per day)
- generate meal recommendations based on the user’s calorie goal
- allowing user to insert the calorie intake per meal
- using online API to obtain recipes for the recommendations
- allowing user to insert recipes
- user diary, daily/monthly calorie intake (diet) reports

