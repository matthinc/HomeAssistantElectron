const {remote} = require('electron')

window.onload = () => {
  let data = remote.getCurrentWindow()
  document.querySelector('#in_url').value = data.url
  document.querySelector('#in_dimw').value = data.dimensions.width
  document.querySelector('#in_dimh').value = data.dimensions.height
  document.querySelector('#in_kiosk').value = data.kiosk
}
