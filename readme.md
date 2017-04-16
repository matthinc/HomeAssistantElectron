Create Home Assistant Electron app
==================================


![](https://abload.de/img/screenshot2017-04-17abalow.png)


## 1) Download electron



    $ sudo npm install electron -g

## 2) Modify HTML file


Open 'index.html' and change this line 

    <iframe src="http://raspi3:8123" width="100%" height="100%" frameborder="0">

to your own Home Assistant URL.


If you use a modified Home Assistant design, you can change the titlebar color and background color in the CSS.


## 3) Change titlebar style (optional)



If you use Windows/Linux or you simple don't like it, you can disable the translucent title bar, by changing

    win = new BrowserWindow({width: 1000, height: 800, titleBarStyle: 'hidden', title: 'Home Assistant'})

to

    win = new BrowserWindow({width: 1000, height: 800, title: 'Home Assistant'})

in 'index.js'


## 4) Test it



Just type 

    $ electron index.js

in your terminal. Make sure, you are in the right working directory.


## 5) Build


Use [this](https://electron.atom.io/docs/tutorial/application-distribution/) instructions to create your app package.
If you use Mac, you can edit 'Electron.app/Contents/Info.plist' to change the app name in the menu bar

