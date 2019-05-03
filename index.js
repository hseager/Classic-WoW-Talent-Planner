import Vue from 'vue'
import App from './components/App.vue'
import './components/Mixins.js'
import './assets/css/global.scss'

new Vue({
	el: '#app',
	render: h => h(App),
});