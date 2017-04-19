Create Home Assistant Electron app
==================================


![](https://abload.de/img/screenshot2017-04-17abalow.png)


## 1) Install dependencies


    $ npm install

## 2) Modify HTML file


Open 'index.html' and change this line 

    <iframe src="http://raspi3:8123" frameborder="0">

to your own Home Assistant URL.


If you use a modified Home Assistant design, you can change the titlebar color and background color in the CSS.


## 3) Test it


    $ npm test


## 4) Build


Use [this](https://electron.atom.io/docs/tutorial/application-distribution/) instructions to create your app package.
If you use Mac, you can edit 'Electron.app/Contents/Info.plist' to change the app name in the menu bar

