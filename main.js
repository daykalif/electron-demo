/**
 * 任何 Electron 应用程序的入口都是 main 文件。
 * 这个文件控制了主进程，它运行在一个完整的Node.js环境中，负责控制您应用的生命周期，显示原生界面，执行特殊操作并管理渲染器进程。
 */

// 在文件头部引入 Node.js 中的 path 模块
const path = require('path')

/**
 * 现在您有了一个页面，将它加载进应用窗口中。 要做到这一点，你需要 两个Electron模块：
 * app 模块，它控制应用程序的事件生命周期。
 * BrowserWindow 模块，它创建和管理应用程序 窗口。
 */
// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow } = require('electron')

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    // 通过预加载脚本从渲染器访问Node.js
    // 要将此脚本附加到渲染器流程，请在你现有的 BrowserWindow 构造器中将路径中的预加载脚本传入 webPreferences.preload 选项。
    webPreferences: {
      /**
       * 这里使用了两个Node.js概念：
          __dirname 字符串指向当前正在执行脚本的路径 (在本例中，它指向你的项目的根文件夹)。
          path.join API 将多个路径联结在一起，创建一个跨平台的路径字符串。
       */
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // 加载 index.html
  mainWindow.loadFile('index.html')

  // 打开开发工具
  mainWindow.webContents.openDevTools()
}

/**
 * 在 Electron 中，只有在 app 模块的 ready 事件被激发后才能创建浏览器窗口。 
 * 您可以通过使用 app.whenReady() API来监听此事件。 
 * 在whenReady()成功后调用createWindow()。
 */

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow()

  // 如果没有窗口打开则打开一个窗口 (macOS)​
  app.on('activate', function() {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

/**
 * 关闭所有窗口时退出应用 (Windows & Linux)​
 */
// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit()
})
