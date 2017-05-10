/**
 * This file will be injected in the home-assistant webview
 */

const {remote, ipcRenderer} = require('electron')

// Login with password, after finished loading
function login () {
  var password = remote.getCurrentWindow().password
  if (password) {
    document.querySelector('home-assistant').shadowRoot.querySelector('login-form').password = password
    document.querySelector('home-assistant').shadowRoot.querySelector('login-form').validatePassword()
  }
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

window.onload = login
