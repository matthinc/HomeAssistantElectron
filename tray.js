const Client = require('node-rest-client').Client
const { app, BrowserWindow, Menu, dialog, shell, Tray } = require('electron')
const path = require('path')
const os = require('os')

var client = new Client()
var activeTray

/**
 * Calls a home assistant service
 * @param {*} hass
 * @param {*} password
 * @param {*} domain
 * @param {*} service
 * @param {*} entity_id
 */
function hassService (hass, password, domain, service, entity_id) {
  client.post(`${hass}/api/services/${domain}/${service}`,
        { headers: { 'x-ha-access': password, 'Content-Type': 'application/json' }, data: { entity_id: entity_id } },
        (data, res) => { })
}

/**
 * get single domain and create best label
 * @param {*} states
 * @param {*} domain
 * @param {*} sensor if true, label contains state and unit
 */
function filterDomain (states, domain, sensor = false) {
  return states
        .filter(state => state.entity_id.startsWith(domain + '.'))
        .map(item => {
          let label = item.attributes.friendly_name
          if (!label) {
            label = item.entity_id
          }
          if (sensor) {
            label += ': ' + item.state
          }
          if (item.attributes.unit_of_measurement) {
            label += item.attributes.unit_of_measurement
          }
          item.label = label
          return item
        })
        .sort((e1, e2) => {
          if (e1.label.toUpperCase() < e2.label.toUpperCase()) {
            return -1
          }
          if (e1.label.toUpperCase() > e2.label.toUpperCase()) {
            return 1
          }
          return 0
        })
}

function createTray (hass, password, icon) {
  if (activeTray) {
    activeTray.destroy()
  }

  // Using @2x for mac-devices prevents some weird retina-issues
  let tray = new Tray(path.join(__dirname, `assets/tray_${icon}${os.platform() === 'darwin' ? '@2x' : ''}.png`))
  activeTray = tray

  client.get(hass + `/api/states?api_password=${password}`, (data, res) => {
    if (data instanceof Buffer) {
      dialog.showErrorBox('Tray error', `Unable to connect to ${hass}/apis/states?api_password=${password}`)
      return
    }

    let switches = filterDomain(data, 'switch').map(item => {
      return {
        label: item.label,
        click () { hassService(hass, password, 'switch', 'toggle', item.entity_id) }
      }
    })

    let lights = filterDomain(data, 'light').map(item => {
      return {
        label: item.label,
        click () { hassService(hass, password, 'light', 'toggle', item.entity_id) }
      }
    })

    let scenes = filterDomain(data, 'scene').map(item => {
      return {
        label: item.label,
        click () { hassService(hass, password, 'scene', 'turn_on', item.entity_id) }
      }
    })

    let items = [
            { label: 'Switches', submenu: switches },
            { label: 'Lights', submenu: lights },
            { label: 'Scenes', submenu: scenes }
    ]

    let menu = Menu.buildFromTemplate(items)
    tray.setContextMenu(menu)
  })
}

module.exports = createTray
