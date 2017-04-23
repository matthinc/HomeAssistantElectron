const {remote} = require('electron')

function connect () {
  let url = document.getElementById('url-input').value
  remote.getCurrentWindow().connect(url)
}
