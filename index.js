const { app, BrowserWindow, Menu, dialog, shell, Tray } = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const storage = require('electron-json-storage')
const { autoUpdater } = require('electron-updater')

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

      if (data.save_dimensions && data.width && data.height) {
        browserWindow.setContentSize(data.width, data.height, false)
        if (data.xpos && data.ypos) {
          browserWindow.setPosition(data.xpos, data.ypos)
        }
      }

      TrayInit(Tray, Menu, data.url, data.password)

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

    let w = browserWindow.getBounds().width
    let h = browserWindow.getBounds().height
    let x = browserWindow.getPosition()[0]
    let y = browserWindow.getPosition()[1]

    storage.get('config', (err, data) => {
      data.width = w
      data.height = h
      data.xpos = x
      data.ypos = y
      storage.set('config', data)
    })
  })

  //Dont update in dev mode
  if (process.mainModule.filename.indexOf('app.asar') !== -1) {

    //Check for updates
    setTimeout(function () {
      autoUpdater.checkForUpdates()
    }, 2000)
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
        }},
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

/*
  Auto update stuff
 */

autoUpdater.on('update-available', (d) => {
  dialog.showMessageBox({buttons: ['Yes', 'No'], message: 'An update is available! Do you want to download it?'}, (c) => {
    shell.openExternal('https://github.com/matthinc/HomeAssistantElectron/releases/latest')
  })
})
