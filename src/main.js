/*
 * @Author: zoufengfan
 * @Date: 2022-06-10 10:07:51
 * @LastEditTime: 2022-08-03 09:41:49
 * @LastEditors: zoufengfan
 */
import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import ProElement from "./components/index";
import "element-ui/lib/theme-chalk/index.css";

Vue.use(ElementUI, { size: "small" });
Vue.use(ProElement);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
