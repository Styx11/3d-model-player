# Vue3-election-boilerplate
> election boilerplate with vue3

## 技术栈选型
* Vue, Vue-Router, Vuex
* Ant-Design-Vue
* TypeScript
* Electron
* Less

## 文件结构
```sh
.
├── LICENSE
├── README.md
├── bld                    # 主进程代码编译文件
├── dist                   # 渲染进程编译文件（从 views/dist 复制过来的）
├── electron-builder.yml   # 用于 electron-builder 打包（packing）的配置文件
├── package.json
├── release-builds         # electron-builder 打包应用后的资源存放路径
├── scripts
│   └── build.js           # 应用打包预处理脚本（包括主/渲染进程代码的编译）
├── src                    # 主进程代码存放路径
├── tsconfig.json
├── views                  # 渲染进程代码存放路径
│   ├── README.md
│   ├── babel.config.js
│   ├── config             # webpack 配置
│   ├── dist
│   ├── env                # 环境文件
│   ├── package.json
│   ├── public
│   ├── scripts
│   ├── src                # 渲染进程代码
│   ├── test               # Jest 测试相关
│   ├── tsconfig.json
│   └── yarn.lock
└── yarn.lock
```
## Build
因为一个 Electron 应用分为**主进程**和**渲染进程**两部分，所以项目的开发模式和应用的打包也需要两部分的配置

### before script
运行以下脚本构建项目环境
```sh
# 主进程
yarn

# 渲染进程
cd views && yarn
```
### 开发模式
1. 首先，我们需要先在一个 shell 进程中使用 webpack 运行渲染进程的开发模式
```sh
yarn dev:view
```
2. 接着我们才可以开启另一个 shell 进程运行主进程的开发模式，这会开启一个 electron 应用并加载渲染进程的内容。开发模式中主进程将处于 electron-reload 的监听下，当根目录下文件发生变动时，这个应用将会刷新。注意，electron-reload 只会刷新应用的`webContents`，其他涉及到初始化的代码仍需我们重启应用。
```sh
yarn dev
```
### 生产环境构建
根据不同的系统我们可以运行不同的打包（packing）脚本，electron-builder 会将所有打包后的应用资源存放在`/release-builds`文件夹下，你可以在那里找到应用的安装包
```sh
# macOS
build:mac

# windows
build:win
```
#### 发生了什么？
生产环境应用的构建本质上分为这么几个部分：
1. 首先执行以下代码运行预构建脚本，这个脚本会清理旧文件，然后分别执行主进程和渲染进程的编译脚本创建它们的生产环境代码，并将它们移动到 electron-builder 需要它们在的位置。
```sh
node ./scripts/build.js
```
2. 之后执行 electron-builder 的打包命令并提供它所需要的配置文件，该文件涉及到应用打包的详细信息
```sh
# macOS
electron-builder --mac --config electron-builder.yml

# windows
electron-builder --x64 --win --config electron-builder.yml
```
3. 最后我们可以在`/release-builds`文件夹下找到所需的应用资源
## LICENSE
MIT.