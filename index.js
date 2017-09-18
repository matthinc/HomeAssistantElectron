const { app, BrowserWindow, Menu, dialog, shell, Tray } = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const settings = require('electron-settings')
const TrayInit = require('./tray')

var browserWindow

function createWindow () {
  browserWindow = new BrowserWindow({
    height: 600,
    icon: 'assets/icon.ico',
    kiosk: false,
    title: 'Home Assistant',
    titleBarStyle: 'hidden',
    width: 800
  })

  browserWindow.url = settings.has('url')? settings.get('url'): 'null'
  browserWindow.os = os.platform()
  browserWindow.password = settings.has('password')? settings.get('password'): ''
  browserWindow.notifications = settings.has('notifications')? settings.get('notifications'): false
  browserWindow.save_dimensions = settings.has('save_dimensnions')? settings.get('save_dimensnions'): false

  if (settings.has('url')) {
    load('index.html')
    TrayInit(settings.get('url'), settings.get('password'))
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
    TrayInit(settings.get('url'), settings.get('password'))
  }

  browserWindow.saveSettings = () => {
    if (settings.has('url')) {
      load('index.html')
    } else {
      load('connect.html')
    }
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
      {label: 'States', accelerator: 'Cmd+S', click: () => setPage('states')},
      {label: 'History', accelerator: 'Cmd+H', click: () => setPage('history')},
      {label: 'Map', accelerator: 'Cmd+Alt+M', click: () => setPage('map')},
      {label: 'Services', accelerator: 'Cmd+Alt+S', click: () => setPage('dev-service')}
    ]
  },
  {
    label: 'Edit',
    submenu: [
      {role: 'copy'},
      {role: 'selectall'},
      {role: 'paste'}
    ]
  },
  {
    label: 'Developer',
    submenu: [
      {role: 'toggledevtools'},
      {label: 'Reload', accelerator: 'Cmd+Shift+R', click: () => browserWindow.webContents.send('reload', {})}
    ]
  }
  ]
        // Mac default menu
  if (os.platform() === 'darwin') {
    menuTemplate.unshift({
      label: 'Home Assistant',
      submenu: [
        {role: 'about'},
        {role: 'quit'},
        {label: 'Preferences...', click: () => load('settings.html')}
      ]
    })
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
