const settings = require('electron-settings')


class Settings {

     hasUrl() {
          return settings.has('url')
     }

     url() {
          return settings.get('url')
     }

     password() {
          return settings.get('password')
     }

     tray() {
          return settings.has('tray') && settings.get('tray')
     }

     notifications() {
          return settings.get('notifications')
     }

     hasDimensions() {
          return settings.has('width') && settings.has('height')
     }

     width() {
          return settings.get('width')
     }

     height() {
          return settings.get('height')
     }

     toolbar() {
          return settings.get('toolbar_always', true)
     }

     kiosk() {
          return settings.get('kiosk')
     }

     hasPosition() {
          return settings.has('xpos') && settings.has('ypos')
     }

     xpos() {
          return settings.get('xpos')
     }

     ypos() {
          return settings.get('ypos')
     }

     color() {
          return settings.get('color', '#03A9F4')
     }

     setUrlAndPassword(url, password) {
          settings.set('url', url)
          settings.set('password', password)
     }

     setSettings(notifications, tray, kiosk, toolbar) {
          settings.set('notifications', notifications)
          settings.set('tray', tray)
          settings.set('kiosk', kiosk)
          settings.set('toolbar_always', toolbar)
     }

     saveWindowBounds(x, y, w, h) {
          settings.set('xpos', x)
          settings.set('ypos', y)
          settings.set('width', w)
          settings.set('height', h)
     }

     deleteAll() {
          settings.deleteAll()
     }

}

module.exports = new Settings()