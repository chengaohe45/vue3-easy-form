import { createApp } from "vue";
// import vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "ant-design-vue/dist/antd.css";
import { Input, Button, InputNumber } from "ant-design-vue";
// import ant from "ant-design-vue";
import esForm from "@/package/index.js";

var app = createApp(App);
app.use(Input);
app.use(Button);
app.use(InputNumber);
// app.use(ant);

app.use(esForm, {
  rowHeight: 40,
  rowSpace: 20,
  labelWidth: 100,
  offsetLeft: 0,
  offsetRight: 0,
  colon: false,
  direction: "h",
  models: {
    "a-input": "value"
  },
  defaultCom: "a-input", // 如：若用element-ui, 改为el-input
  defaultVal: "", // 对defaultCom这个组件的value设置默认值
  trimDoms: ["input", "textarea", "a-input"], // 数组，空数组会全部清空
  hasConsole: true // 推荐写成动态，编译时不用修改
});

// app.config.warnHandler = function() {
//   // `trace` 是组件的继承关系追踪
// };

app
  .directive("pin", {
    mounted(el, binding) {
      console.log("a123456...");
      el.style.position = "fixed";
      // binding.arg is an argument we pass to directive
      const s = binding.arg || "top";
      el.style[s] = binding.value + "px";
    }
  })
  .use(store)
  .use(router)
  .mount("#app");
window.app = app;
