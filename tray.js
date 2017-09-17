const Client = require('node-rest-client').Client

var client = new Client()

module.exports = function(Tray, Menu, hass, password) {
    let tray = new Tray('assets/tray.png')

    client.get(hass + `/api/states?api_password=${password}`, (data,res) => {

        /**
         * Switchtes
         */
        let switches = data.filter(state => state.entity_id.startsWith('switch.'))
        .map(item => {
            return {
                label: (item.attributes.friendly_name != undefined?item.attributes.friendly_name: item.entity_id),
                click() {
                    //Call 'toggle' service
                    client.post(hass +`/api/services/switch/toggle`,
                        {headers: {'x-ha-access': password,'Content-Type': 'application/json'},data: {entity_id: item.entity_id,}
                        },(data, res) => {})
                }
            }
        })

        /**
         * Lights
         */
        let lights = data.filter(state => state.entity_id.startsWith('light.'))
        .map(item => {
            return {
                label: (item.attributes.friendly_name != undefined?item.attributes.friendly_name: item.entity_id),
                click() {
                    //Call 'toggle' service
                    client.post(hass +`/api/services/light/toggle`,
                        {headers: {'x-ha-access': password,'Content-Type': 'application/json'},data: {entity_id: item.entity_id,}
                        },(data, res) => {})
                }
            }
        })

        /*
         * Sensors
         */
        let sensors = data.filter(state => state.entity_id.startsWith('sensor.'))
        .map(item => {
            return {
                label: (item.attributes.friendly_name != undefined?item.attributes.friendly_name: item.entity_id)
                     + ': ' + item.state +
                     (item.attributes.unit_of_measurement?item.attributes.unit_of_measurement:''),
                enabled: false
            }
        })

        /*
         * Scenes
         */
        let scenes = data.filter(state => state.entity_id.startsWith('scene.'))
        .map(item => {
            return {
                label: (item.attributes.friendly_name != undefined?item.attributes.friendly_name: item.entity_id),
                click() {
                    //Call 'toggle' service
                    client.post(hass +`/api/services/scene/turn_on`,
                        {headers: {'x-ha-access': password,'Content-Type': 'application/json'},data: {entity_id: item.entity_id,}
                        },(data, res) => {})
                }
            }
        })

        let items = [
            ...sensors,
            {label: 'Switches', submenu: switches},
            {label: 'Lights', submenu: lights},
            {label: 'Scenes', submenu: scenes}
        ]

        let menu = Menu.buildFromTemplate(items)
        tray.setContextMenu(menu)
    })
}


