import Vue from "vue";
import Vuesax from "vuesax";
import VueTextareaAutosize from "vue-textarea-autosize";
import App from "../components/App.vue";
import "../components/Mixins.js";
import "../assets/css/global.scss";
import "vuesax/dist/vuesax.css";
import "material-icons/iconfont/material-icons.css";

Vue.use(Vuesax);
Vue.use(VueTextareaAutosize);

new Vue({
	el: "#app",
	render: h => h(App),
});
