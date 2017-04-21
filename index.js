const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const config = require(__dirname + '/config.js')

var win = undefined

function createWindow () {

  win = new BrowserWindow({
      height: config.size.height,
      icon: 'assets/icon.ico',
      kiosk: config.kiosk,
      title: config.title,
      titleBarStyle: 'hidden',
      width: config.size.width,
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src', 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.url = config.url
  win.os  = os.platform()

  win.on('closed', () => {
    win = null
  })

  if (config.menu) {
   create_menu()
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
function create_menu() {
  let menu_template = [
      {
        label: 'Go',
        submenu: [
          {
            label: 'States',
            click: () => {
              win.webContents.send('load', {url: config.url + '/states'})
            }
          },
          {
            label: 'History',
            click: () => {
              win.webContents.send('load', {url: config.url + '/history'})
            }
          },
          {
            label: 'Map',
            click: () => {
              win.webContents.send('load', {url: config.url + '/map'})
            }
          },
          {
            label: 'Services',
            click: () => {
              win.webContents.send('load', {url: config.url + '/dev-service'})
            }
          }
        ]
      },
      {
        label: 'Developer',
        submenu: [
          {role: 'toggledevtools'}
        ]
      }
    ]
    // Mac default menu
    if (os.platform() == 'darwin') {
      menu_template.unshift(
        {
          label: 'Home Assistant',
          submenu: [
            {
              role: 'about'
            },
            {
              role: 'quit'
            }
          ]
      })
    }
    const menu = Menu.buildFromTemplate(menu_template)
    Menu.setApplicationMenu(menu)
}