# NeteaseCloudMusicImitation（仿网易云音乐 web 客户端）

## 技术选型

后端：[网易云音乐 API](https://github.com/Binaryify/NeteaseCloudMusicApi 'Binaryify/NeteaseCloudMusicApi')
前端：webpack 4.0+, Vue 2.6+, Vue Router 3.3+, Vuex 3.5+, axios
图标库：[iconfont](https://www.iconfont.cn) 以及 网易云音乐的图片资源
UI 库：未使用第三方 UI 组件库

## 如何开始

1. 运行网易云后端服务 详情请参考[网易云音乐 API](https://github.com/Binaryify/NeteaseCloudMusicApi 'Binaryify/NeteaseCloudMusicApi')

2. 克隆本项目到本地

```bash
git clone git@github.com:naroul/NeteaseCloudMusicImitation.git
```

3. 安装依赖

```bash
cd 项目所在目录

npm install
```

4. 打包

```bash
npm run build
```

5. 运行项目

```bash
npm run dev
```

## 实现功能

### 音乐板块

**核心：**
音乐播放器（基本实现网易云 web 客户端的音乐播放功能）

_ 音乐播放、暂停功能
_ 音乐进度条、缓冲条和进度操作
_ 音量操作
_ 歌词同步滚动、高亮
_ 播放歌曲、播放列表操作
_ 播放模式设置

**组成：**

1. 网易云音乐主页、歌手、歌单、音乐、排行榜等首页及各详情页（支持评论和点赞，评论支持分页）
2. 搜索功能

### 用户板块

**注：在此项目中的登录需使用真实的网易云账号，并且在此项目中所有的用户操作都会对真实网易云音乐的账户产生影响，如登录、删除、评论、转发、更改用户信息等，都会对真实的网易云账户产生影响。**

**组成：**

- 用户登录(拼图验证)、登出
- 用户主页、等级页
- 用户动态、关注、粉丝（支持关注、取关、私信、评论等），数据多时，支持懒加载和下拉加载
- 用户信息页（支持更改用户信息）

## 实现的 自定义 UI 组件 及插件

说明：本项目并未使用第三方 UI 库，而是尝试使用 Vue 的自定义组件及插件的知识实现项目所需的东西，部分实现通用性不高，与本项目功能有耦合，还需后续改进。

** UI 组件 **

- 滚动条组件（Scroll） 原生浏览器的滚动条样式不一，并且不方便对页面（或组件）进行滚动操作。该组件会在元素（需要滚动的）内自动生成与滚动内容成比例高度的滚动条，支持监听滚动事件，支持通过 Props 改变滚动条位置并自动滚动内容

- 悬浮弹窗(PopOver) 支持点击触发浮窗，并且在点击浮窗之外元素时关闭浮窗

- 分页（Pagination） 传入分页总数即可完成页码的展示，抛出页码改变事件

- 编辑框（EditBox） 支持编辑并监听字数的合法性

- 下拉选择组件（DropList） 支持点击下拉框后自动展开下拉选择列表，选择后下拉列表收起

其它简单组件还有按钮、输入框、搜索框、弹窗、跳转标签等（详情请看 ui 目录）

** 插件 **

- 提示（Toast） 支持成功、失败、普通三种提示风格，显示后自动消失，显示时间可通过参数控制

- 下拉加载（DropLoad） 大量数据时，一次性加载完成数据影响性能和用户体验，通过自定义指令 v-dropload 绑定滚动元素实现下拉加载功能

## 项目目录结构

NeteaseCloudMusicImitation
├─ .babelrc                             // babel配置文件（只影响本项目代码）
├─ .gitignore                           
├─ README.md
├─ babel.config.json                    // babel配置文件（影响整个项目代码，包括node_modules）
├─ favicon.ico
├─ index.html                           // 项目入口文件
├─ package-lock.json
├─ package.json
├─ src
│    ├─ App.vue                         // 根组件
│    ├─ apis                            // 请求相关代码
│    │    ├─ artist                         
│    │    ├─ comment
│    │    ├─ config.js                      // 请求相关的配置
│    │    ├─ header
│    │    ├─ login
│    │    ├─ playlist
│    │    ├─ recommend
│    │    ├─ search
│    │    ├─ singer
│    │    ├─ song
│    │    ├─ toplist
│    │    └─ user
│    ├─ assets                          // 静态资源（字体图标、图片、全局样式）
│    │    ├─ fonts
│    │    ├─ images
│    │    └─ scss
│    ├─ components                      // 功能组件（页面的组成部分）
│    │    ├─ Banner                         // 轮播图
│    │    ├─ BtnFollow                      // 关注按钮
│    │    ├─ BtnSendMsg                     // 私信按钮
│    │    ├─ Comment                        // 评论
│    │    ├─ Event                          // 动态
│    │    ├─ Gallery                        // 画廊
│    │    ├─ Header                         // 顶部组件
│    │    ├─ Loading                        // 加载组件
│    │    ├─ Login                          // 登录组件
│    │    ├─ Pagination                     // 分页
│    │    ├─ Player                         // 播放器内核
│    │    ├─ PlaylistSummary                // 歌单概要展示
│    │    ├─ Profile                        // 个人简介
│    │    ├─ PuzzleVerify                   // 拼图验证
│    │    ├─ Resume                         // 用户简介
│    │    ├─ Search                         // 搜索组件
│    │    ├─ SongList                       // 歌曲列表
│    │    ├─ SongRecord                     // 听歌记录
│    │    └─ ToplistSummary                 // 排行榜概要展示
│    ├─ main.js                         // webpack打包入口文件
│    ├─ mixins                          // mixins 存放公用属性和方法的调用方式，以便组件直接使用
│    │    └─ index.js
│    ├─ pages                           // 页面
│    │    ├─ Home                           // 主页
│    │    ├─ Music                          // 音乐相关页面
│    │    ├─ NotFound                       // 404页面
│    │    └─ User                           // 用户相关页面
│    ├─ plugins                         // 插件库
│    │    ├─ DropLoad                       // 下拉加载插件
│    │    └─ Toast                          // 提示插件
│    ├─ router                          // 路由
│    │    └─ index.js
│    ├─ store                           // 公共状态管理仓库
│    │    ├─ actions.js                     // 批量或异步操作状态
│    │    ├─ getters.js                     // 获取公共状态
│    │    ├─ index.js                       // 注册并抛出Vuex的store实例
│    │    ├─ mutations.js                   // 操作状态
│    │    └─ state.js                       // 公共状态声明和存放
│    ├─ ui                              // UI组件库
│    │    ├─ Dialog                         // 弹窗
│    │    ├─ DropList                       // 下拉列表
│    │    ├─ EditBox                        // 编辑框
│    │    ├─ LinkLabel                      // 跳转标签
│    │    ├─ MyButton                       // 自定义按钮
│    │    ├─ MyInput                        // 自定义输入框
│    │    ├─ PopOver                        // 悬浮弹窗
│    │    ├─ Scroll                         // 滚动条
│    │    └─ SearchBox                      // 搜索框
│    └─ util                            // 工具函数库
│           ├─ binarySearch                 // 二分法查询函数（数组）
│           ├─ debounce                     // 防抖
│           ├─ fix                          // 设置小数位
│           ├─ formatLyric                  // 格式化歌词数据
│           ├─ formatMsToDate               // 毫秒转化日期
│           ├─ formatMsToDuration           // 毫秒转化时长
│           ├─ formatMsToMinStr             // 毫秒转化分钟的字符串
│           ├─ formatMsToYears              // 毫秒转化成年描述
│           ├─ formatPlayCount              // 计算播放量
│           ├─ getRandomInt                 // 获取随机整数
│           ├─ isChildOfNodeById            // 根据id判断是否位子节点
│           └─ timer                        // 高级定时器
└─ webpack.config.js                    // webpack配置文件