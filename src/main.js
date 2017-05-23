const fs = require('fs');
const path = require('path');
const url = require('url')

const electron = require('electron');
const menu = electron.Menu;
const MedleyConfig= require('./config.json');
const shell = require('electron').shell

const autoUpdater = require('electron-updater').autoUpdater;
const BrowserWindow = electron.BrowserWindow
const os = require('os');

const EA = require('electron-analytics')
EA.init("HkWKXmroUx")

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let app;
let dialog = electron.dialog;

const DEVELOPER_MODE=process.env.NODE_ENV==="development"

switch (MedleyConfig.platform) {
    case 'desktop':
        setupDesktopUI();
        break;
    default:
        setupDesktopUI();
        break;
}

function setupDesktopUI(){
    app = electron.app

    app.on('ready', createWindow)

// Quit when all windows are closed.
    app.on('window-all-closed', function () {
        // On OS X it is common for applications and their menu bar
        // to stay active until the user quits explicitly with Cmd + Q
        if (process.platform !== 'darwin') {
            app.quit()
        }
    })

    app.on('activate', function () {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (mainWindow === null) {
            createWindow()

        }
    })

}



function createWindow () {
    // Create the browser window.
    mainWindow = new BrowserWindow({width: 1280, height: 768, icon: path.join(__dirname, 'resources/icon.png')})

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Open the DevTools.
    if(DEVELOPER_MODE){
        mainWindow.webContents.openDevTools();
    }

    mainWindow.webContents.on('did-frame-finish-load', function() {
        //if(!DEVELOPER_MODE) {
            if (os.platform() === 'darwin') {
                menu.setApplicationMenu(menu.buildFromTemplate(require('./electron/menuTemplate')));
            }
            initializeAutoUpdate()
            autoUpdater.checkForUpdates();

        EA.send("window loaded")
        //}
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

function initializeAutoUpdate(){

    autoUpdater.on("update-available", function(event) {
        if (mainWindow) {
            if(os.platform()==='linux'){
                dialog.showMessageBox({
                    type: 'info',
                    buttons: ["OK"],
                    title: "MedleyText",
                    message: 'There is a new version of Medley available.\nPlease go to '
                    + "medleytext.net".link("http://medleytext.net") +' to download it.'
                });
            }else{
                mainWindow.webContents.send('update-message', 'update-available');
            }
        }
    });
    autoUpdater.on("update-downloaded", function(event, releaseNotes, releaseName, releaseDate, updateURL) {
        if (mainWindow) {
            var index=dialog.showMessageBox({
                type: 'info',
                buttons: ["Restart","Later", "Release Notes"],
                title: "MedleyText",
                message: 'The new version has been installed. Restart to apply the update.'
            });

            if(index===0){
                autoUpdater.quitAndInstall();
            } else if(index===1){
                return;
            }else if(index===2){
                shell.openExternal('http://medleytext.net/releases')
            }
        }
    });
    autoUpdater.on("error", function(error) {
        //TODO: adding logging after
    });
}
