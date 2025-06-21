const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const express = require('express');

let mainWindow;

function createWindow() {
    // 创建 Express 服务器（监听 3000 端口）
    const localServer = express();
    const port = 8963;
    const staticPath = path.join(__dirname, 'public'); // 添加这行 
  

// 先配置图片路径
    if (process.env.NODE_ENV === 'development') {
        localServer.use(express.static(path.join(__dirname, 'resources/img')));
    } else {
        const prodImagePath = path.join(process.resourcesPath, 'img');
        localServer.use(express.static(prodImagePath));
    }

    // 最后配置 public 目录
    localServer.use(express.static(staticPath));
    // 监听端口，处理端口占用错误
    const server = localServer.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`Port ${port} is in use!`);
            app.quit();
        }
    });

    // 创建浏览器窗口
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            webSecurity: false // 允许加载本地资源
        },
        show: false // 页面加载完成前先隐藏窗口
    });

    // **应用菜单（全局导航）**
    const menu = Menu.buildFromTemplate([
        {
            label: '导航',
            submenu: [
                {
                    label: '返回',
                    accelerator: 'Alt+Left', // 快捷键 Alt + ←
                    click: () => {
                        if (mainWindow.webContents.canGoBack()) {
                            mainWindow.webContents.goBack();
                        }
                    }
                },
                {
                    label: '前进',
                    accelerator: 'Alt+Right', // 快捷键 Alt + →
                    click: () => {
                        if (mainWindow.webContents.canGoForward()) {
                            mainWindow.webContents.goForward();
                        }
                    }
                },
                { type: 'separator' },
                {
                    label: '重新加载',
                    accelerator: 'CmdOrCtrl+R',
                    role: 'reload'
                },
                // {
                //     label: '开发者工具',
                //     role: 'toggleDevTools'
                // }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);

    // **右键菜单**
    const contextMenuTemplate = [
        { label: '返回', click: () => mainWindow.webContents.goBack() },
        { label: '前进', click: () => mainWindow.webContents.goForward() },
        { type: 'separator' },
        { label: '复制', role: 'copy' },
        { label: '粘贴', role: 'paste' },
        { label: '重新加载', role: 'reload' },
        // { label: '开发者工具', role: 'toggleDevTools' }
    ];
    const contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
    mainWindow.webContents.on('context-menu', () => {
        contextMenu.popup({ window: mainWindow });
    });

    // **加载页面**
    mainWindow.loadURL(`http://localhost:${port}/user.html?notebook=101`)
        .then(() => {
            console.log('Page loaded successfully');
            mainWindow.show();
        })
        .catch(err => {
            console.error('Failed to load page:', err);
            app.quit();
        });

    // 开发工具（调试时使用）
    // mainWindow.webContents.openDevTools();

    // 监听窗口关闭事件
    mainWindow.on('closed', () => {
        server.close(); // 关闭 Express 服务器
        mainWindow = null;
    });
}

// **应用启动**
app.whenReady().then(createWindow);

// **所有窗口关闭时退出应用**
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// **MacOS 重新激活窗口**
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
