const { app, BrowserWindow, Menu, dialog, shell, Tray } = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const settings = require('electron-settings')
const TrayInit = require('./tray')

var browserWindow

/*
var menubar = require('menubar')
var mb = menubar({
  dir: './Menubar/dist/',
  width: 600,
  height: 300
})
*/

console.log(app.getAppPath() + '/Menubar/dist')

/* mb.on('ready', function ready () {
  console.log('app is ready')
}) */

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

  if (settings.has('url')) {
    load('index.html')
    if (!settings.has('tray') || settings.get('tray')) {
      TrayInit(settings.get('url'), settings.get('password'), settings.get('sensors_in_tray', false))
    }
  } else {
    load('connect.html')
  }

  if (settings.has('width') && settings.has('height')) {
    browserWindow.setContentSize(settings.get('width'), settings.get('height'), false)
  }

  if (settings.has('xpos') && settings.has('ypos')) {
    browserWindow.setPosition(settings.get('xpos'), settings.get('ypos'))
  }

  createMenu()

  browserWindow.connect = (url, password) => {
    browserWindow.url = url
    browserWindow.password = password
    settings.set('url', url)
    settings.set('password', password)
    load('index.html')
    if (!settings.has('tray') || settings.get('tray')) {
      TrayInit(settings.get('url'), settings.get('password'), settings.get('sensors_in_tray', false))
    }
  }

  browserWindow.saveSettings = (notifications, dimensions, tray, kiosk, sit, toolbar) => {
    settings.set('notifications', notifications)
    settings.set('save_dimensions', dimensions)
    settings.set('tray', tray)
    settings.set('kiosk', kiosk)
    settings.set('sensors_in_tray', sit)
    settings.set('toolbar_always', toolbar)
    if (settings.has('url')) {
      load('index.html')
      TrayInit(settings.get('url'), settings.get('password'), settings.get('sensors_in_tray', false))
    } else {
      load('connect.html')
    }
  }

  browserWindow.setColor = (color) => {
    browserWindow.webContents.send('colorChange', {color})
  }

  browserWindow.reset = () => {
    settings.deleteAll()
    app.quit()
  }

  browserWindow.on('closed', () => {
    browserWindow = null
  })

  browserWindow.on('close', () => {
    settings.set('xpos', browserWindow.getPosition()[0])
    settings.set('ypos', browserWindow.getPosition()[1])
    settings.set('width', browserWindow.getBounds().width)
    settings.set('height', browserWindow.getBounds().height)
  })
}

app.on('ready', createWindow)

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
  let menuTemplate = [{
    label: 'Go',
    submenu: [
      {label: 'States', accelerator: 'Cmd+1', click: () => setPage('states')},
      {label: 'History', accelerator: 'Cmd+2', click: () => setPage('history')},
      {label: 'Map', accelerator: 'Cmd+3', click: () => setPage('map')},
      {label: 'Configuration', accelerator: 'Cmd+4', click: () => setPage('config')},
      {label: 'Services', accelerator: 'Cmd+5', click: () => setPage('dev-service')},
      {type: 'separator'},
      {label: 'Preferences...', click: () => load('settings.html')}
    ]}, {
      label: 'Edit',
      submenu: [{role: 'copy'}, {role: 'selectall'}, {role: 'paste'}]}, {
        label: 'Developer',
        submenu: [
      {role: 'toggledevtools'},
      {label: 'Reload', accelerator: 'Cmd+Shift+R', click: () => browserWindow.webContents.send('reload', {})}]}]
        // Mac default menu
  if (os.platform() === 'darwin') {
    menuTemplate.unshift({
      label: 'Home Assistant',
      submenu: [
        {role: 'about'},
        {role: 'quit'}]})
  }
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

function load (html) {
  browserWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src', html),
    protocol: 'file:',
    slashes: true
  }))
}

function setPage (page) {
  browserWindow.webContents.send('change', { page })
}
