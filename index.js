const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const storage = require('electron-json-storage')

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

  browserWindow.url = 'null'
  browserWindow.os = os.platform()
  browserWindow.password = ''
  browserWindow.notifications = true
  browserWindow.save_dimensions = false

  storage.get('config', (err, data) => {
    if (!err && data.url) {
      browserWindow.url = data.url
      browserWindow.password = data.password
      browserWindow.save_dimensions = data.save_dimensions
      browserWindow.notifications = data.notifications

      if (data.save_dimensions) {
        browserWindow.setContentSize(data.width, data.height, false)
      }

      load('index.html')
    } else {
      load('connect.html')
    }
    createMenu()
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
    let height = browserWindow.getBounds().height

    storage.get('config', (err, data) => {
      data.width = width
      data.height = height
      storage.set('config', data)
    })
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
      {label: 'Reset configuration', click: () => storage.set('config', {})},
      {label: 'Reload', click: () => browserWindow.webContents.send('reload', {})}
    ]
  },
  {
    label: 'Settings',
    submenu: [
      {label: 'Save window dimensions',
        checked: browserWindow.save_dimensions,
        type: 'checkbox',
        click: () => {
          storage.get('config', (err, data) => {
            browserWindow.save_dimensions = !browserWindow.save_dimensions
            data.save_dimensions = browserWindow.save_dimensions
            storage.set('config', data)
          })
        }},
      {label: 'Desktop notifications',
        checked: browserWindow.notifications,
        type: 'checkbox',
        click: () => {
          storage.get('config', (err, data) => {
            browserWindow.notifications = !browserWindow.notifications
            data.notifications = browserWindow.notifications
            storage.set('config', data)
          })
        }}
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
