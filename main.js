'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
var dialog = electron.dialog;
const ipcMain = electron.ipcMain;
const Tray = electron.Tray;
const Menu = electron.Menu;

const Childprocess = require('child_process');
const path = require('path');
const http = require('http');
//var server = require('./server/server');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,//开启remote模块
    },
    title: '文件复制',
    // icon: 'app/assets/icon.png',
  });

  mainWindow.loadFile('index.html');
  //mainWindow.loadURL('file://' + __dirname + '/index.html');

  mainWindow.webContents.on('did-finish-load', function () {
    var session = electron.session.defaultSession;
    session.cookies.get({}, function (error, cookies) {
      mainWindow.webContents.send('cookie', cookies);
    });
  });

  //mainWindow.webContents.openDevTools();

  ipcMain.on('open-dialog', function (event, param) {
    dialog.showOpenDialog(mainWindow, {
      properties: [param.property]
    }).then((result) => {
      console.log(result);
      if (!result.canceled) {// 如果有选中
        // 发送选择的对象给子进程
        event.sender.send('selectedItem', { files: result.filePaths, opertion: param.opertion })
      }
    }).catch(
      err => console.log('openDialog：' + err)
    )
  })



  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // server.listen(11015, function () {
  //   console.log('cloud music server listening on port 11015...')
  // });

  ipcMain.on('hideapp', function (e) {
    mainWindow.hide();
    e.sender.send('hided');
  });

  ipcMain.on('minimize', function (e) {
    mainWindow.minimize();
    e.sender.send('minimize');
  });

  ipcMain.on('maximize', function (e) {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
    e.sender.send('maximize');
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('removecookie', function (e, url, name) {
  var session = electron.session.fromPartition();
  session.cookies.remove(url, name, function () {
    console.log('remove', url, name);
    e.returnValue = 'OK';
  });
});