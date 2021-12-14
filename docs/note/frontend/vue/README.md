---
title: vue
---

## 自定义指令

Vue允许注册自定义指令

**Vue3中指令的变化**

Vue3对指令的生命周期钩子改造了一翻，使其更像和普通组件钩子一般，更加方便可读和记忆

```js
app.directive('directiveName', {
    // 在绑定元素的 attribute 或事件监听器被应用之前调用, 在指令需要附加须要在普通的 v-on 事件监听器前调用的事件监听器时，这很有用
    created() {},
    // 当指令第一次绑定到元素并且在挂载父组件之前调用
    beforeMount() {},
    // 在绑定元素的父组件被挂载后调用
    mounted() {},
    // 在更新包含组件的 VNode 之前调用
    beforeUpdate() {},
    // 在包含组件的 VNode 及其子组件的 VNode 更新后调用
    updated() {},
    // 在卸载绑定元素的父组件之前调用
    beforeUnmount() {},
    // 当指令与元素解除绑定且父组件已卸载时, 只调用一次
    unmounted() {},
});
```

Vue3改造后的生命周期钩子变成了七个

| Vue2 | Vue3 |
| ---- | ---- |
| created | created |
| beforeMount | bind |
| mounted | inserted |
| beforeUpdate | update被移除! |
| updated | componentUpdated |
| beforeUnmount | beforeUnmount |
| unmounted | unmounted |

Example: 自定义一个switch防抖指令

```js
<el-switch
  v-smart="intelligentIp"
  v-model="sw"
  active-color="#13ce66"
  inactive-color="gray"
  active-text="开启"
  inactive-text="关闭"
></el-switch>

<script>
import { ref } from "vue";

export default {
  setup() {
    sw = ref(false)
    const intelligentIp = async () => {
      // 省略
    }
    return {
      sw,
      intelligentIp
    }
  },
  directives: {
    smart: {
      mounted(el, binding) {
        const fn = binding.value
        let timer = null
        el.addEventListener("click", () => {
          if (timer) {
            clearTimeout(timer)
            notifyInfo("智能推荐", "操作太频繁")
          }
          timer = setTimeout(() => fn(), 500)
        })
      }
    }
  }
}
<script>
```

## 生命周期

### 钩子函数

| vue2 | vue3 |
| ---- | ---- |
|beforeCreate|setup|
|created|setup|
|beforeMount|onBeforeMount|
|mounted|onMounted|
|beforeUpdate|onBeforeUpdate|
|updated|onUpdated|
|beforeUnmount|onBeforeUnmount|
|unmounted|onUnmounted|
|errorCaptured|onErrorCaptured|
|renderTracked|onRenderTracked|
|renderTriggered|onRenderTriggered|
|activated|onActivated|
|deactivated|onDeactivated|
