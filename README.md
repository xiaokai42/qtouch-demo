# Q Touch Developer

> Q Touch 智慧城市治理平台<br/>
> 后台单页面管理系统

## Start 开始

- 克隆或者下载这个仓库

- 进入项目目录安装依赖（推荐使用 yarn 进行管理）

```bash
yarn install
```

## Run 启动

```bash
# serve with hot reload at localhost:80
yarn serve
```

## Develop 开发

- 请按照 docs -> ts_code_guide 示例进行组件开发

## Build 打包

```bash
yarn build
```

## 项目结构

```
|-- docs
|   |-- ts_code_stye.md                                     // 此项目内部组件开发规范示例
|   |-- vue_code_stye.md                                    // Vue原生代码规范
|-- public
|   |-- index.html                                          // vue 入口页面
|   |-- favicon.ico                                         // 项目icon
|-- src
|   |-- api                                                 // 项目api接口层
|       |-- modules                                         // 各模块api接口地址文件
|       |-- axios.ts                                        // axios引入、请求配置与拦截
|       |-- code.ts                                         // 接口请求返回值状态码管理
|       |-- url.ts                                          // 各模块接口的总入口，新建模块需在此引入
|       |-- localforage.ts                                  //
|   |-- assets                                              // 本地静态资源
|       |-- images                                          // 图片
|       |-- style                                           // 样式
|       |-- xxx
|   |-- components                                          // 公共组件
|       |-- echarts
|       |-- gaode_map
|       |-- xxx
|   |-- config                                              // 拦截配置
|       |-- index.ts                                        // 入口文件
|       |-- interceptor
|           |-- http.ts                                     // http 拦截
|           |-- router.ts                                   // 路由拦截
|   |-- plugins                                             // 外部插件/组件声明
|       |-- axios_plugin.ts
|       |-- echarts_plugin.ts
|       |-- message_plugin.ts
|   |-- router                                              // vue 路由文件
|       |-- index.ts                                        // 入口
|       |-- routes.ts                                       // 引入项目路由数组
|       |-- modules                                         // 子模块路由文件(新建模块在此新建ts文件声明，并在routes.ts中引入)
|           |-- xxx
|   |-- shims                                                // shims文件(ts 不兼容，需在此声明shims_xxx.d.ts 引入)
|       |-- shims_iview.d.ts
|       |-- shims_js_cookie.d.ts
|       |-- shims_vue.d.ts                                   // vue项目引入ts必备文件
|       |-- shims_tsx.d.ts                                   // vue项目引入ts必备文件
|       |-- xxx
|   |-- store                                                // 状态管理
|       |-- index.ts
|       |-- interface.ts
|       |-- store
|           |-- actions.ts
|           |-- getters.ts
|           |-- mutations.ts
|       |-- modules                                           // 状态模块
|           |-- base
|           |-- xxx
|   |-- utils                                                 // 封装工具类
|       |-- Http.ts                                           // Http，由Axios封装，集成请求头配置与返回值验证
|   |-- views                                                 // vue 页面组件文件
        |-- base                                              // base文件夹，存放通用错误页面、登陆页面、通用页面框架
            |-- about
            |-- error_page
            |-- layout
            |-- login
|       |-- admin                                              // 系统管理员页面文件夹
|           |-- menu_manage                                    // 菜单管理
|           |-- person_manage                                  // 人员管理
|           |-- ...
|       |-- home                                              // 项目首页
|           |-- Home.vue                                      // 首页入口
|           |-- components                                    // 组件
|           |-- buttons                                       // 左下角按钮组
|       |-- xxx                                                // 其他功能模块页面
|   |-- App.vue
|   |-- main.ts                                                // 基础配置
|-- .env                                                       //
|-- .gitignore
|-- bable.config.js
|-- package.json                                               // 插件管理json
|-- postcss.config.js
|-- tsconfig.json
|-- vue.config.js                                               // 项目配置页面(跨域代理由 proxy实现，后端框架完善后，默认保持三类代理: api,admin,open)
|-- yarn.lock
|-- README.md
```

## 详细规则

### 1. 命名规则

1.  文件夹：文件夹名统一用小写，如：layout，如果有多个单词，则使用下划线链接，例如：error_page

2.  Vue 组件命名：以大写字母开头、驼峰式命名，例如： Home.vue，EventPage.vue

3.  TypeScript(ts)文件：以小写字母开头，多个单词已下划线连接，例如：transfer.ts，axios_plugin.ts

4.  md 文档：与 ts 文件名称方式保持一致（readme 除外）

### 2. 代码编写规则：

#### Vue 组件代码风格： 详见[ts_code_guide.md](./docs/ts_code_guide.md)

- Prop: 以小写字母开头，驼峰形式命名，必须声明字段类型

  ```
  @Prop({type: Array || Number || Object})
  xxx!: Array || Number || Object;

  // 若不确定，可定义为any，例如声明高德地图Map
  @Prop({type: Object, required: true})
  map!: any;
  ```

- 调用自定义组件：使用绝对路径"@/xx/xx/Xxx.vue"引入，并在[@Component()]中声明,在 template 中使用小写字母加连接线使用，父组件传值使用小写字母加连接线绑定，例如：

  ```
  <!-- 父组件 -->
  <template>
      <div>
          ...
          <module-template :child-bind-data="childBindData" child-bind-boolean="true">
          </module-template>
      </div>
  </template>
  ...

  <!-- 子组件 -->
  <template>
      ...
  </template>
  <script lang="ts">
  import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
  ...
  @Component
  export default class Xxx extends Vue {
      @Prop({type: Array, required: true})
      childBindData!: any;
      @Prop({type: Boolean, required: true})
      childBindBoolean!: Boolean;
      ...
  }
  </script>
  ```

- methods 方法/函数类：以小写字母开头，驼峰形式命名，若需要传入变量，需声明变量类型(若有语法警告，则统一使用 any 声明)。命名尽量精简，以不超过四个单词(长单词尽量保证在三个单词以内)为宜，例如：

  ```
  handleClick() {
      ...
  }

  getChildrenList(fatherId: any) {
      ...
  }
  ```

- 注释规范

  - 组件功能说明： 在开发组件之前，应在 vue 组件开头表明开发者与组件功能的大致说明，便于后续维护。

  ```html
  <!--
      author: xxx
      descr: xxxxxxx
  -->
  <template> </template>
  ```

  - class 类名：HTML 属性名大小写不敏感，但是 ID 和 class 类名却是区分大小写的，为了保证统一，避免产生不易觉察的错误，所以统一为 **小写加中横线**。

  ```html
  example: 1. card-header 2. nav-menu 3. device-cell-group 4. device-menu 5.
  device-card-container 6. device-tabbar 7. device-tabbar-outter 8.
  device-tabbar-inner 9. menu-footer 10. menu-title 11. menu-content 12.
  menu-item-text 13. menu-item-icon 14. card-img 15. card-cover 16.
  card-img-wrapper
  ```

  常用类名单词：

  包裹层：

  ```html
  1. menu 2. submenu 3. nav 4. subnav 5. group 6. container 7. wrapper
  ```

  项目：

  ```html
  1. item 2. status 3. title 4. content 5. img 6. icon 7. msg 8. video 9. cover
  10. btn
  ```

  - 方法注释： 统一写在语块上方

  ```typescript
  /**
   * 功能说明： 获取部件类型树
   * @author： 彭鑫
   * @param
   * return Array
   */
  function getPartsTypeList() {
    return;
  }
  ```

### 3. 代码提交规范

  build: 主要目的是修改项目构建系统(例如 glup，webpack，rollup 的配置等)的提交<br/>
  ci: 主要目的是修改项目继续集成流程(例如 Travis，Jenkins，GitLab CI，Circle 等)的提交<br/>
  docs: 文档更新<br/>
  feat: 新增功能<br/>
  merge: Merge branch ? of ?<br/>
  fix: bug 修复<br/>
  perf: 性能, 体验优化<br/>
  refactor: 重构代码(既没有新增功能，也没有修复 bug)<br/>
  style: 不影响程序逻辑的代码修改(修改空白字符，格式缩进，补全缺失的分号等，没有改变代码逻辑)<br/>
  test: 新增测试用例或是更新现有测试<br/>
  revert: 回滚某个更早之前的提交<br/>
  chore: 不属于以上类型的其他类型<br/>
  
  
  ```html
  example: 
  build(moment): 新增 moment.js 依赖。 
  feat(项目管理): 新增项目管理，项目质量管理模块。 
  style(Poptip): 优化 Poptip / Tooltip 组件样式，箭头更清晰了。 
  fix(progress): 修复 Progress 纵向时，active 动画方向不正确的 bug。 
  fix(select): 修复 2.14.0 版本中，Select 无法绑定数字 0 的 bug。 
  refactor(table): 重构 table 组件，完全支持键盘可访问性，并修复若干问题。 
  docs(代码规范): 更新前端代码规范文档 
  
  // 括号和冒号统一用英文格式，冒号后面接一个英文空格。
  ```


```angular2
yarn add xxx --dev // 添加开发依赖包
npm install xxx --save --dev


// 在vue.config.js中加入对应的cdn地址

```
