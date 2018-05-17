const settings = require('electron-settings')

/**
 * Modul for loading and storing user preferences and logins
 */
class Settings {
     /**
      * @returns true if settings contain an url
      */
  hasUrl () {
    return settings.has('url')
  }

     /**
      * @returns url
      */
  url () {
    return settings.get('url')
  }

     /**
      * @returns password
      */
  password () {
    return settings.get('password')
  }

     /**
      * @returns true if tray-menu should be shown
      */
  tray () {
    return settings.get('tray', true)
  }

     /**
      * @return true if notifications should be shown
      */
  notifications () {
    return settings.get('notifications')
  }

     /**
      * @return true if window dimensions are saved in the settings
      */
  hasDimensions () {
    return settings.has('width') && settings.has('height')
  }

     /**
      * @returns width
      */
  width () {
    return settings.get('width')
  }

     /**
      * @returns tray icon
      */
  icon () {
    return settings.get('icon', 'Black')
  }

     /**
      * @returns height
      */
  height () {
    return settings.get('height')
  }

     /**
      * @returns true if toolbar should not be hidden
      */
  toolbar () {
    return settings.get('toolbar_always', true)
  }

     /**
      * Set credentials for the Configurator panel
      * @param {*} username
      * @param {*} password
      */
  setConfiguratorCredentials (username, password) {
    settings.set('c_user', username)
    settings.set('c_password', password)
  }

     /**
      * @return Credentials for the Configurator panel
      */
  configuratorCredentials () {
    return {
      username: settings.get('c_user', ''),
      password: settings.get('c_password', '')
    }
  }

     /**
      * @returns true if the app should start in kiosk-mode
      */
  kiosk () {
    return settings.get('kiosk')
  }

     /**
      * @returns true if window postitions are saved in the settings
      */
  hasPosition () {
    return settings.has('xpos') && settings.has('ypos')
  }

     /**
      * @returns window x-position
      */
  xpos () {
    return settings.get('xpos')
  }

     /**
      * @returns window y-position
      */
  ypos () {
    return settings.get('ypos')
  }

     /**
      * @returns last window color
      */
  color () {
    return settings.get('color', '#03A9F4')
  }

     /**
      * Save url and password
      * @param {*} url
      * @param {*} password
      */
  setUrlAndPassword (url, password) {
    settings.set('url', url)
    settings.set('password', password)
  }

     /**
      * Save user preferences
      * @param {*} notifications
      * @param {*} tray
      * @param {*} kiosk
      * @param {*} toolbar
      */
  setSettings (notifications, tray, kiosk, toolbar, icon, c_user, c_password) {
    settings.set('notifications', notifications)
    settings.set('tray', tray)
    settings.set('kiosk', kiosk)
    settings.set('toolbar_always', toolbar)
    settings.set('icon', icon)
    settings.set('c_user', c_user)
    settings.set('c_password', c_password)
  }

     /**
      * Save window position
      * @param {*} x
      * @param {*} y
      * @param {*} w
      * @param {*} h
      */
  saveWindowBounds (x, y, w, h) {
    settings.set('xpos', x)
    settings.set('ypos', y)
    settings.set('width', w)
    settings.set('height', h)
  }

     /**
      * Deletes ALL settings
      */
  deleteAll () {
    settings.deleteAll()
  }
}

module.exports = new Settings()
