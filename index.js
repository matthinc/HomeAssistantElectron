const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const storage = require('electron-json-storage')
const config = require(path.join(__dirname, '/config.js'))

var browserWindow

function createWindow () {
  browserWindow = new BrowserWindow({
    height: config.size.height,
    icon: 'assets/icon.ico',
    kiosk: config.kiosk,
    title: config.title,
    titleBarStyle: 'hidden',
    width: config.size.width
  })

  browserWindow.url = config.url
  browserWindow.os = os.platform()
  browserWindow.password = ''

    // Show connect-view if config.url is undefined
  if (config.url) {
    browserWindow.url = config.url
    browserWindow.password = config.password
    load('index.html')
  } else {
        // Try to load config from json file
    storage.get('config', (err, data) => {
      if (!err && data.url) {
        browserWindow.url = data.url
        browserWindow.password = data.password
        load('index.html')
      } else {
                // show connect-view if config was not found in the json
        load('connect.html')
      }
    })
  }

  storage.get('window', (err, data) => {
    if (!err && data.width) {
      browserWindow.setContentSize(data.width, data.height, false)
    }
  })

  browserWindow.connect = (url, password) => {
    browserWindow.url = url
    browserWindow.password = password
    storage.set('config', { url, password })
    load('index.html')
  }

  browserWindow.on('closed', () => {
    browserWindow = null
  })

  browserWindow.on('close', () => {
    let width = browserWindow.getBounds().width
    let height = browserWindow.getBounds().width

    storage.set('window', {width, height})
  })

  if (config.menu) {
    createMenu()
  }
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
      {label: 'States', click: () => setPage('states')},
      {label: 'History', click: () => setPage('history')},
      {label: 'Map', click: () => setPage('map')},
      {label: 'Services', click: () => setPage('dev-service')}
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
      {label: 'Reset configuration', click: () => storage.set('config', {})}
    ]
  }
  ]
        // Mac default menu
  if (os.platform() === 'darwin') {
    menuTemplate.unshift({
      label: 'Home Assistant',
      submenu: [
        {role: 'about'},
        {role: 'quit'}
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
