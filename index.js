import Vue from 'vue';
import App from './components/App.vue';

Vue.mixin({
	methods: {
		getImageFileName: name => 	name.replace("'","")
										.replace(':','')
										.replace(/ /g,'-')
										.replace('(','')
										.replace(')','')
										.toLowerCase() + '.jpg',
	}
});

new Vue({
	el: '#app',
	render: h => h(App),
});