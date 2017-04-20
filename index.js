const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')
const os = require('os')
const config = require(__dirname + '/config.js')

var win = undefined

function createWindow () {

  win = new BrowserWindow({
      height: config.size.height,
      icon: 'assets/icon.png',
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
