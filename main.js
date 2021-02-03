const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
    win = new BrowserWindow({
        webPrefereces: {
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            nodeIntegrationInWorker: true,
            enableRemoteModule: true,
        }, frame: false
    })
    win.webContents.openDevTools();
    win.loadFile('index.html')
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('active', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});
