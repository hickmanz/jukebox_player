// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')

const path = require('path');
const url = require('url');
const fs = require('fs');
const isDev = require('electron-is-dev');

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

function createWindow () {
  const win = new BrowserWindow({
    webPreferences: {
      plugins: true
    }
  });
  win.webContents.on('did-finish-load', ()=>{
    win.show();
    win.focus();
  });
  //win.loadURL('https://shaka-player-demo.appspot.com/');
  
  win.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true
    }))
    if (isDev) {
      win.webContents.openDevTools()
    }
}

//app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('widevine-ready', (version) => {
  console.log('Widevine ' + version + ' is ready to be used!');
  createWindow()
});
app.on('widevine-update-pending', (currentVersion, pendingVersion) => {
  console.log('Widevine ' + currentVersion + ' is ready to be upgraded to ' + pendingVersion + '!');
});
app.on('widevine-error', (error) => {
  console.log('Widevine installation encounterted an error: ' + error);
  //process.exit(1)
});
app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
