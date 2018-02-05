const { app, BrowserWindow, Menu, dialog, shell, Tray } = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const settings = require('./settings')
const TrayInit = require('./tray')
const menuTemplate = require('./menu')

var browserWindow

function createWindow () {
  browserWindow = new BrowserWindow({
    height: 600,
    icon: 'assets/icon.ico',
    kiosk: false, // TODO: Reimplement
    title: 'Home Assistant',
    titleBarStyle: 'hidden',
    width: 800
  })


  browserWindow.os = os.platform()
  browserWindow.settings = settings

  loadHomeAssistantOrLoginPage()

  //Change window dimensions if provided
  if (settings.hasDimensions()) {
    browserWindow.setContentSize(settings.width(), settings.height(), false)
  }

  //Change window position if provided
  if (settings.hasPosition()) {
    browserWindow.setPosition(settings.xpos(), settings.ypos())
  }

  createMenu()

  //Connect to home assistant
  browserWindow.connect = (url, password) => {
    browserWindow.url = url
    browserWindow.password = password
    settings.setUrlAndPassword(url, password)
    loadHomeAssistantOrLoginPage()
  }

  //Save settings and reconnect to home assistant
  browserWindow.reload = () => {
    loadHomeAssistantOrLoginPage()
  }

  //Notifiy UI that the theme color has changed
  browserWindow.setColor = (color) => {
    browserWindow.webContents.send('colorChange', {color})
  }

  //Reset EVERYTHING
  browserWindow.reset = () => {
    settings.deleteAll()
    app.quit()
  }

  browserWindow.log = (msg) => console.log(msg)

  browserWindow.on('closed', () => {
    browserWindow = null
  })

  //Save window bounds on close
  browserWindow.on('close', () => {
    settings.saveWindowBounds(browserWindow.getPosition()[0], browserWindow.getPosition()[1],
      browserWindow.getBounds().width, browserWindow.getBounds().height)
  })
}

app.on('ready', createWindow)

//Just OSX-Stuff
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (browserWindow === null) {
    createWindow()
  }
})

/**
 * Create the application menu
 */
function createMenu () {
  const menu = Menu.buildFromTemplate(menuTemplate(browserWindow, os.platform() === 'darwin', load, setPage))
  Menu.setApplicationMenu(menu)
}

//Load a HTML page
function load (html) {
  browserWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src', html),
    protocol: 'file:',
    slashes: true
  }))
}

//Switch HomeAssistant page (eg. State)
function setPage (page) {
  browserWindow.webContents.send('change', { page })
}

//Load HomeAssistant or configuration view
function loadHomeAssistantOrLoginPage() {
  if (settings.kiosk()) {
    browserWindow.setFullScreen(true)
  }
  if (settings.hasUrl()) {
    load('index.html')
    if (settings.tray()) {
      TrayInit(settings.url(), settings.password(), settings.icon())
    }
  } else {
    load('connect.html')
  }
}