import Vue from 'vue'
import App from './components/App.vue'
import './assets/css/global.scss'

Vue.mixin({
	methods: {
		getImageFileName: name => 	name.replace("'","")
										.replace(':','')
										.replace(/ /g,'-')
										.replace('(','')
										.replace(')','')
										.toLowerCase() + '.jpg',
		isMobile: function(){
			let windowWidth = window.innerWidth;
			if(windowWidth <= 700)
				return true;
			else 
				return false;
		}
	}
});

new Vue({
	el: '#app',
	render: h => h(App),
});