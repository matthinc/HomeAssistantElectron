const {remote, ipcRenderer, shell} = require('electron')

window.onload = () => {
  let frame = document.getElementById('content_frame')
  frame.src = remote.getCurrentWindow().settings.get('url')

    // Remove HTML titlebar on Windows/Linux
  let titlebar = document.getElementById('titlebar')
  if (remote.getCurrentWindow().os !== 'darwin') {
    titlebar.parentNode.removeChild(titlebar)
  } else {
    titlebar.style.backgroundColor = remote.getCurrentWindow().settings.get('color','#03A9F4')
  }

  frame.addEventListener('new-window', (event) => {
    shell.openExternal(event.url)
    event.preventDefault()
  })
}

ipcRenderer.on('load', (event, data) => {
  let frame = document.getElementById('content_frame')
  frame.src = data.url
})

ipcRenderer.on('colorChange', (event, data) => {
  let titlebar = document.getElementById('titlebar')
  titlebar.style.backgroundColor = data.color
})

ipcRenderer.on('change', (event, data) => {
  let frame = document.getElementById('content_frame')
  frame.send('change', data)
})

ipcRenderer.on('reload', (event, data) => {
  let frame = document.getElementById('content_frame')
  frame.send('reload', data)
})
