const remote = require('electron').remote

window.onload =() => {
    var frame = document.getElementById('content_frame')
    frame.src = remote.getCurrentWindow().url

    //Remove HTML titlebar on Windows/Linux
    var titlebar = document.getElementById('titlebar')
    if (remote.getCurrentWindow().os != 'darwin') {
        titlebar.parentNode.removeChild(titlebar)
    }
}