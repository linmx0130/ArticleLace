const electron = require('electron')
// Module to control application life.
const app = electron.app
const ipcMain = electron.ipcMain
const Menu = electron.Menu
const dialog = electron.dialog
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const fs = require('fs')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let articleData

function loadArticlesData(){
    var articleDataJson = fs.readFileSync('articles.json');
    articleData = JSON.parse(articleDataJson);
}
function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 600, height: 600})
  mainWindow.webContents.openDevTools()
  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  Menu.setApplicationMenu(null);
  loadArticlesData();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

ipcMain.on('asynchronous-message', (event, arg) => {
    if (arg ==='exit'){
        dialog.showMessageBox(
        mainWindow,
            {
                'buttons':['Yes', 'Cancel'], 
                'title':'ArticleLace', 
                'message': 'Are you sure to exit ArticleLace?',
                'cancelId': 1
            },
        (response)=>{
            if (response===0){
                app.quit();
            }
        });
    }
        if (arg === 'load-article-notes'){
        event.sender.send('asyn-articles-data', articleData);
    }
})

ipcMain.on('new-article-save',(event, arg)=> {
    var articleItem = arg;
    var articleId = arg['id'];
    articleItem.id=undefined;
    if (articleId ===-1){
        articleData.articles.push(articleItem);
    }else{
        articleData.articles[articleId] = articleItem;
    }
    fs.writeFile('articles.json',JSON.stringify(articleData), (err)=>{
        if (err) throw err;
        event.sender.send("asynchronous-reply", "save-success");
    });
});
