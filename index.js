import Vue from 'vue'
import { store } from './includes/Store.js'
import './includes/Mixins.js'
import App from './components/App.vue'
import './assets/css/global.scss'

new Vue({
	el: '#app',
	store,
	render: h => h(App),
});