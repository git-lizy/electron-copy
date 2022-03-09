var Electron = require("electron");
var ipcRenderer = Electron.ipcRenderer

function send(channel, param) {
  ipcRenderer.send(channel, param)
}

function registerEvent() {

}