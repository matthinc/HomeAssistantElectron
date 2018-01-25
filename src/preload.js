/**
 * This file will be injected in the home-assistant webview
 */

const {remote, ipcRenderer} = require('electron')

// Login with password, after finished loading
function login () {
  var password = remote.getCurrentWindow().settings.password()
  var notifications = remote.getCurrentWindow().settings.notifications()
    document.querySelector('home-assistant').shadowRoot.querySelector('login-form').password = password
    document.querySelector('home-assistant').shadowRoot.querySelector('login-form').validatePassword()
    let interval = setInterval(() => {
      
      let main = document.querySelector('home-assistant').shadowRoot.querySelector('home-assistant-main')
      if (main) {
        // Main view loaded
        if (remote.getCurrentWindow().settings.toolbar()) {
          // Always show toolbar
          main.shadowRoot.querySelector('#drawer')
          .querySelector('iron-pages')
          .querySelector('partial-cards')
          .shadowRoot.querySelector('ha-app-layout')
          .querySelector('app-header')
          .removeAttribute('condenses')
        }
        // Get color
        let hass = document.querySelector('home-assistant')
        remote.getCurrentWindow().setColor(getComputedStyle(hass).getPropertyValue('--primary-color'))

        var observer = new MutationObserver(function (mutations) {
          remote.getCurrentWindow().setColor(getComputedStyle(main).getPropertyValue('--primary-color'))
        })
        observer.observe(hass, { attributes: true, attributeFilter: ['style'] })
        clearInterval(interval)
      }
    }, 100)

  if (notifications) {
    getNotifications()
  }
}

// Display native notifications
var lastNotification = ''

function getNotifications () {
  var notification = document
      .querySelector('home-assistant').shadowRoot
      .querySelector('notification-manager').shadowRoot
      .querySelector('paper-toast')

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutationRecord) {
      var message = notification.shadowRoot.querySelector('#label').innerHTML
      if (message != lastNotification && remote.getCurrentWindow().settings.notifications()) {
        notification.style.display = 'none'
        new Notification('Home Assistant', {body: message})
      }
      lastNotification = message
    })
  })
  observer.observe(notification, { attributes: true, attributeFilter: ['style'] })
}

// Change page (states,history, ...)
function setPage (page) {
  document
    .querySelector('home-assistant').shadowRoot
    .querySelector('home-assistant-main').shadowRoot
    .querySelector('paper-drawer-panel')
    .querySelector('ha-sidebar')
    .selectPanel(page)
}

ipcRenderer.on('change', (event, data) => {
  setPage(data.page)
})

ipcRenderer.on('reload', (event, data) => {
  location.reload()
})

window.onload = login
