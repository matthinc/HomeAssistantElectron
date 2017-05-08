/**
 * This file will be injected in the home-assistant webview
 */

const remote = require('electron').remote

// Login with password, after finished loading
function login () {
  var password = remote.getCurrentWindow().password
  if (password) {
    document.querySelector('home-assistant').shadowRoot.querySelector('login-form').password = password
    document.querySelector('home-assistant').shadowRoot.querySelector('login-form').validatePassword()
  }
}

window.onload = login
