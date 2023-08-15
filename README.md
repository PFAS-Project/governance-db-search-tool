Test deployment: https://pfas-gov-tracker-test.onrender.com/

To install and run this web tool in a development environment:
- Install [node.js](https://nodejs.org/en/download)
- Install [Visual Studio Code](https://code.visualstudio.com/download)
- Install and run [GitHub Desktop](https://desktop.github.com/)  
- Clone this project
- Open the project in Visual Studio Code
- Get `keys.json` from Google Drive and place it in this folder
- Open a terminal and type `npm install` to install dependencies
- In the terminal, type `npm run dev` to run the web server
- In the web browser, navigate to [localhost:9001](http://localhost:9001)
- Use CTRL-C to quit

Deployment notes:
- Deploy at [Render.com](https://dashboard.render.com) (login required). Be sure to add `keys.json` as a "secret file."
- @ProfJanetDavis owns the Google Apps Script service account. To create a new service account:
  - Find the spreadsheet and make sure you are logged into the correct Google account.
  - On [Google Cloud console](https://console.cloud.google.com), create a new project and select that project.
  - Go to "Enable APIs and Services," search for the Google Sheets API, and enable it.
  - Create new credentials for accessing application data.
  - Open the spreadsheet and share it with the new service account, granting View access only.
  - Create a new key and update the `keys.json` file on Google Drive. Make sure to add the `sheet_id` to the end of the generated JSON content.

References:
- [How to Deploy Your Node.js Application for Free with Render](https://www.freecodecamp.org/news/how-to-deploy-nodejs-application-with-render/)
- [Node.js tutorial in Visual Studio Code](https://code.visualstudio.com/docs/nodejs/nodejs-tutorial)
- [Video: Google Sheets API - JavaScript NodeJS Tutorial](https:/youtu.be/MiPpQzW_ya0)
- [Video: Passing Data Between Frontend and Backend | Node.js](https://www.youtube.com/watch?v=5TxF9PQaq4U&ab_channel=Smoljames)
- For editing this file: [Markdown cheat sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

