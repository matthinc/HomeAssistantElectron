const { remote } = require('electron')

function connect () {
  let url = document.getElementById('url-input').value
  let password = document.getElementById('password-input').value
  remote.getCurrentWindow().connect(url, password)
}

window.onload = () => {
  document.getElementById('password-input').onfocus = () => {
    document.querySelector('p.warning').style.visibility = 'visible'
  }
}
