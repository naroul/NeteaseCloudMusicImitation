# PopOver 弹出框组件

使用该组件的方法：

1. 一定要传入具名插槽 reference 对应的 template 作为触发元素。
2. 可以传入 content props 作为纯文字内容。当传入了默认插槽对应的元素时，content 会被无视。

---

代码示例：

```js
<PopOver class="pop-del" v-if="isUuId && !isChild">
  <template v-slot:reference>
    <div class="arw-del" title="动态管理"></div>
  </template>
  <span>aaaa</span>
</PopOver>
```

---

该组件的缺陷：

1. 目前触发方式只实现了 click。
2. 弹出框的位置目前固定为触发元素的下方，右边框对齐。

---
