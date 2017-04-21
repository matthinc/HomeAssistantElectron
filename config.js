// Your Home Assistant URL/IP address
const url = 'http://raspi3:8123'

// Default window size
const size = {width: 1000, height: 800}

// Run in kiosk mode (fullscreen and window size has no effect)
const kiosk = false

// Window title
const title = 'Home Assistant'

// Show menu
const menu = true

module.exports = {url, size, kiosk, title, menu}
