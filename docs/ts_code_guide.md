# TypeScript + Vue 页面风格
> Code Style Guide

### 例子

```js
<!--
  author: xxx
  组件说明
-->
<template>
    <div>
    <!-- 组件内容主体 -->
    </div>
</template>
<script lang="ts">
// 引入外部组件与ts
import { Vue, Component, Prop, Model, Watch } from "vue-property-decorator";
import Xxx from "xxx";
...

// const 声明组件内部使用的常量
// 若使用高德地图组件，需要在此声明AMap
const AMap: any = (window as any).AMap;
...

@Component
export default class Xxx extends Vue {
    // 组件 Props 声明
    @Prop({ type: Object, required: true })
    map!: any;
    ...
    
    // 对应 vuex 里的 state
    @State token: string;
    
    // 对应 vuex 里的 action
    @Action initAjax: () => void;
    
    // 对应 vuex 里的 getters
    @Getter load: boolean;

    // 组件内部 data 声明
    xxx: any = "";          // 必须声明类型，若有复杂类型或其他不确定类型，则使用any
    ...

    // computed属性部分
    get inputClass(){
      ...
    }

    // methods 方法类
    xxx() {}
    ...

    // vue 生命周期函数
    beforeCreate() {}
    created() {}
    beforeMount() {}
    mounted() {}
    beforeUpdate() {}
    beforeDestroy() {}

    // vue 监听事件(deep 按照实际需求确定)
    @Watch("xxx", { deep: true})
    setXxx(newVal: any, oldVal: any) {
        xxx;
        ...
    }
}
</script>
<style lang="less" scope>
...
</style>
```
