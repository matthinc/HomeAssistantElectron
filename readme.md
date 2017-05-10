Home Assistant Electron app
===========================

The Home Assistant Electron app is based on [Electron](https://electron.atom.io/) and let you use the Home Assistant frontend in a single window like a desktop application. 

You can find the first releases [here](https://github.com/matthinc/HomeAssistantElectron/releases).

![](https://abload.de/img/home_assistantsfu4h.png)


## 1) Install dependencies


    $ npm install

## 2) Configure

Open `config.js` and change anything you like.

## 3) Test it


    $ npm test


## 4) Build


    $ npm run-script build_mac

    $ npm run-script build_windows

    $ npm run-script build_linux

If the build process is successfully finished then you will find the AppImage in the folder `dist`. 

## 5) Run it!

Eg. on a Linux-based system:

    $ ./dist/home_assistant_electron-0.2.0-x86_64.AppImage
