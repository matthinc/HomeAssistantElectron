const {remote} = require('electron')

window.onload = () => {
  let data = remote.getCurrentWindow()
  document.querySelector('#in_url').value = data.settings.get('url')
  document.querySelector('#in_dimw').value = data.settings.get('width')
  document.querySelector('#in_dimh').value = data.settings.get('height')
  document.querySelector('#in_kiosk').value = data.settings.get('kiosk')
}
