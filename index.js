const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const storage = require('electron-json-storage')
const config = require(path.join(__dirname, '/config.js'))

var win

function createWindow () {
  win = new BrowserWindow({
    height: config.size.height,
    icon: 'assets/icon.ico',
    kiosk: config.kiosk,
    title: config.title,
    titleBarStyle: 'hidden',
    width: config.size.width
  })

  win.url = config.url
  win.os = os.platform()
  win.password = ''

    // Show connect-view if config.url is undefined
  if (config.url) {
    win.url = config.url
    win.password = config.password
    load('index.html')
  } else {
        // Try to load config from json file
    storage.get('config', (err, data) => {
      if (!err && data.url) {
        win.url = data.url
        win.password = data.password
        load('index.html')
      } else {
                // show connect-view if config was not found in the json
        load('connect.html')
      }
    })
  }

  win.connect = (url, password) => {
    win.url = url
    win.password = password
    storage.set('config', { url, password })
    load('index.html')
  }

  win.on('closed', () => {
    win = null
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
  if (win === null) {
    createWindow()
  }
})

/**
 * Create the application menu
 */
function createMenu () {
  let menuTemplate = [{
    label: 'Go',
    submenu: [{
      label: 'States',
      click: () => {
        if (win.url) {
          setPage('states')
        }
      }
    },
    {
      label: 'History',
      click: () => {
        if (win.url) {
          setPage('history')
        }
      }
    },
    {
      label: 'Map',
      click: () => {
        if (win.url) {
          setPage('map')
        }
      }
    },
    {
      label: 'Services',
      click: () => {
        if (win.url) {
          setPage('dev-service')
        }
      }
    }
    ]
  },
  {
    label: 'Edit',
    submenu: [{
      role: 'copy'
    },
    {
      role: 'selectall'
    },
    {
      role: 'paste'
    }
    ]
  },

  {
    label: 'Developer',
    submenu: [{
      role: 'toggledevtools'
    },
    {
      label: 'Reset configuration',
      click: () => {
        storage.set('config', {})
      }
    }
    ]
  }
  ]
        // Mac default menu
  if (os.platform() === 'darwin') {
    menuTemplate.unshift({
      label: 'Home Assistant',
      submenu: [{
        role: 'about'
      },
      {
        role: 'quit'
      }
      ]
    })
  }
  const menu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(menu)
}

function load (html) {
  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src', html),
    protocol: 'file:',
    slashes: true
  }))
}

function setPage (page) {
  win.webContents.send('change', { page })
}
