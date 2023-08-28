# [ZipSurf](https://urlshortener-8937b.web.app/)

## Overview
ZipSurf is a summer project I made to establish some fundamental skills in web development: **React** (Vite-React), **HTML**, **CSS**, **Firebase**, **TinyURL API**, **Google Docs API**, **etc**. The application's primary goal is to provide a *simple*, *visually-appealing* interface for users to shorten and save exceedingly long URLs.

## Features
### Firebase Authentication:
* Utilized Firebase `getAuth`, `GoogleAuthProvider`, and `signInWithPopup` functions to provide a seamless user authentication and login process

### Cloud Firestore:
* Integrated synchronized storage of shortened URLs using React `state` variables and Firebase `collection` and `addDoc` functions
* Added error checking for duplicate URLs and invalid URLs to avoid unnecessary reads/writes to the database

### Export URLs:
* Implemented Google Docs API to export the user's list of shortened URLs to an OAuth 2.0-verified Google Doc

### Delete URLs:
* Used Firebase `collection`, `getDocs`, and `deleteDoc` functions to selectively delete *all* or *individual* shortened URLs

### UI Polish:
* Designed the website wireframes and background graphics in **Figma** (the latter implemented *aurora* and *glass morphism* effects)
* Used **Figma** and **Realtime Colors** to generate light/dark mode themes, which is persistent across page refreshes due to the `state` variable saved in each user's database
* Included a variety of SVG icons to enhance the user experience
* Developed custom Navbar component to allow for sleek and effective user navigation
* Personally designed website **favicon**

## External APIs Used
The following external APIs were integrated into this project to enhance its functionality:

### TinyURL API:
Version: v2
* Description: Used the TinyURL API to fetch custom shortened URLs for registered users
* API Provider: TinyURL LLC
* [API Documentation](https://tinyurl.com/app/dev)

### Google Docs API:
Version: v1
* Description: Used the Google Docs API to export a list of shortened URLs to a newly generated (OAuth 2.0 verified) Google Doc
* API Provider: Google
* [API Documentation](https://developers.google.com/docs/api/reference/rest)

## How to Run Locally
1. git clone https://github.com/wderocco8/ZipSurf.git
2. cd ZipSurf
3. create free developer account with [TinyURL](https://tinyurl.com/app/register) (copy api token into .env file)
4. run the following command
      1. npm i && npm run dev
6. Open the application using the provided link (note: the Google Docs API will only work if "127.0.0.1" is replaced with "localhost" due to constraints on authorized javascript origins)

## Online Deployment
For this project, I used Firebase Hosting to deploy my site,  To try deploying it yourself, you can use the folder that you downloaded above and follow these steps:

1. open root of project directory (cd ZipSurf)
2. run the following commands
      1. firebase login
      2. firebase init
2. select "Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys"
3. type "dist" public directory name (since we are using Vite-React)
4. select "y" to configure as a single-page web app
5. run the following commands
      1. npm run build
      2. firebase deploy

Alternatively, you can visit the site I already created below:
* https://urlshortener-8937b.firebaseapp.com/


## App Visualization


