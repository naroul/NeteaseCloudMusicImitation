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

#### 组成：

1. 网易云音乐主页、歌手、歌单、音乐、排行榜等首页及各详情页（支持评论和点赞，评论支持分页）

2. 搜索功能


### 用户板块

**注：在此项目中的登录需使用真实的网易云账号，并且在此项目中所有的用户操作都会对真实网易云音乐的账户产生影响，如登录、删除、评论、转发、更改用户信息等，都会对真实的网易云账户产生影响。**

#### 组成：

- 用户登录(拼图验证)、登出
- 用户主页、等级页
- 用户动态、关注、粉丝（支持关注、取关、私信、评论等），数据多时，支持懒加载和下拉加载
- 用户信息页（支持更改用户信息）


## 自定义 UI 组件 及插件

本项目并未使用第三方 UI 库，而是尝试使用 Vue 的自定义组件及插件的知识实现项目所需的东西，部分实现通用性不高，与本项目功能有耦合，还需后续改进。

#### UI 组件

- 滚动条组件（Scroll） 原生浏览器的滚动条样式不一，并且不方便对页面（或组件）进行滚动操作。该组件会在元素（需要滚动的）内自动生成与滚动内容成比例高度的滚动条，支持监听滚动事件，支持通过 Props 改变滚动条位置并自动滚动内容

- 悬浮弹窗(PopOver) 支持点击触发浮窗，并且在点击浮窗之外元素时关闭浮窗

- 分页（Pagination） 传入分页总数即可完成页码的展示，抛出页码改变事件

- 编辑框（EditBox） 支持编辑并监听字数的合法性

- 下拉选择组件（DropList） 支持点击下拉框后自动展开下拉选择列表，选择后下拉列表收起

其它简单组件还有按钮、输入框、搜索框、弹窗、跳转标签等（详情请看 ui 目录）

#### 插件

- 提示（Toast） 支持成功、失败、普通三种提示风格，显示后自动消失，显示时间可通过参数控制

- 下拉加载（DropLoad） 大量数据时，一次性加载完成数据影响性能和用户体验，通过自定义指令 v-dropload 绑定滚动元素实现下拉加载功能


## 项目目录结构

NeteaseCloudMusicImitation  
├─ .babelrc                                      
├─ .gitignore                           
├─ README.md  
├─ babel.config.json                     
├─ favicon.ico  
├─ index.html                            
├─ package-lock.json  
├─ package.json  
├─ src  
│    ├─ App.vue                           
│    ├─ apis                             
│    │    ├─ artist                           
│    │    ├─ comment  
│    │    ├─ config.js                        
│    │    ├─ header    
│    │    ├─ login  
│    │    ├─ playlist  
│    │    ├─ recommend  
│    │    ├─ search  
│    │    ├─ singer    
│    │    ├─ song   
│    │    ├─ toplist  
│    │    └─ user  
│    ├─ assets                            
│    │    ├─ fonts  
│    │    ├─ images  
│    │    └─ scss  
│    ├─ components                      
│    │    ├─ Banner                          
│    │    ├─ BtnFollow                      
│    │    ├─ BtnSendMsg                    
│    │    ├─ Comment                         
│    │    ├─ Event                            
│    │    ├─ Gallery                         
│    │    ├─ Header                           
│    │    ├─ Loading                        
│    │    ├─ Login                           
│    │    ├─ Pagination                     
│    │    ├─ Player                        
│    │    ├─ PlaylistSummary                 
│    │    ├─ Profile                       
│    │    ├─ PuzzleVerify                   
│    │    ├─ Resume                        
│    │    ├─ Search                         
│    │    ├─ SongList                      
│    │    ├─ SongRecord                   
│    │    └─ ToplistSummary                 
│    ├─ main.js                          
│    ├─ mixins                            
│    │    └─ index.js  
│    ├─ pages                           
│    │    ├─ Home                            
│    │    ├─ Music                          
│    │    ├─ NotFound                       
│    │    └─ User                            
│    ├─ plugins                           
│    │    ├─ DropLoad                        
│    │    └─ Toast                            
│    ├─ router                          
│    │    └─ index.js  
│    ├─ store                             
│    │    ├─ actions.js                      
│    │    ├─ getters.js                     
│    │    ├─ index.js                         
│    │    ├─ mutations.js                     
│    │    └─ state.js                        
│    ├─ ui                               
│    │    ├─ Dialog                           
│    │    ├─ DropList                        
│    │    ├─ EditBox                        
│    │    ├─ LinkLabel                       
│    │    ├─ MyButton                         
│    │    ├─ MyInput                         
│    │    ├─ PopOver                         
│    │    ├─ Scroll                         
│    │    └─ SearchBox                      
│    └─ util                            
│           ├─ binarySearch                  
│           ├─ debounce                       
│           ├─ fix                           
│           ├─ formatLyric                   
│           ├─ formatMsToDate                
│           ├─ formatMsToDuration            
│           ├─ formatMsToMinStr              
│           ├─ formatMsToYears                
│           ├─ formatPlayCount               
│           ├─ getRandomInt                   
│           ├─ isChildOfNodeById              
│           └─ timer                         
└─ webpack.config.js                     