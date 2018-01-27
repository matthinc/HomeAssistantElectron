module.exports =  function (darwin, load, setPage) {
     var menu = [{
          label: 'Go',
          submenu: [
               { label: 'States', accelerator: 'Cmd+1', click: () => setPage('states') },
               { label: 'History', accelerator: 'Cmd+2', click: () => setPage('history') },
               { label: 'Map', accelerator: 'Cmd+3', click: () => setPage('map') },
               { label: 'Configuration', accelerator: 'Cmd+4', click: () => setPage('config') },
               { label: 'Services', accelerator: 'Cmd+5', click: () => setPage('dev-service') },
               { type: 'separator' },
               { label: 'Preferences...', click: () => load('settings.html') }
          ]
     }, {
          label: 'Edit',
          submenu: [{ role: 'copy' }, { role: 'selectall' }, { role: 'paste' }]
     }, {
          label: 'Developer',
          submenu: [
               { role: 'toggledevtools' },
               { label: 'Reload', accelerator: 'Cmd+Shift+R', click: () => browserWindow.webContents.send('reload', {}) }]
     }]
     // Mac default menu
     if (darwin) {
          menu.unshift({
               label: 'Home Assistant',
               submenu: [
                    { role: 'about' },
                    { role: 'quit' }]
          })
     }

     return menu
}