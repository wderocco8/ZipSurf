# ZipSurf

## Overview
This is a project I made over the summer in order to develop some fundamental skills in web development, primarily **React** (Vite-React), **HTML**, **CSS**, **Firebase**, and various **APIs**. 

## Features

Firebase Authentication:

TinyURL API:

Firebase Cloud Firestore storage:

Google Docs API:

Styling:
* 

## How to Run Locally
1. git clone https://github.com/wderocco8/ZipSurf.git
2. cd ZipSurf
3. create free developer account with [TinyURL](https://tinyurl.com/app/register) (copy api token into .env file)
4. run the following command
4.1 npm i && npm run dev
5. Open the application using the provided link (note: the Google Docs API will only work if "127.0.0.1" is replaced with "localhost" due to constraints on authorized javascript origins)

## Online Deployment
For this project, I used Firebase Hosting to deploy my site,  To try deploying it yourself, you can simply use the folder that you downloaded above and follow these steps:

1. open root of project directory (cd ZipSurf)
2. run the following commands
      ~ firebase login
      ~ firebase init
2. select "Hosting: Configure files for Firebase Hosting and (optionally) set up GitHub Action deploys"
3. type "dist" public directory name (since we are using Vite-React)
4. select "y" to configure as a single-page web app
5. run the following commands
      ~ npm run build
      ~ firebase deploy

Alternatively, you can visit the site I already created below:
* https://urlshortener-8937b.firebaseapp.com/


## App Visualization


