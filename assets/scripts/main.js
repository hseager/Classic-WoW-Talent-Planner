Vue.component('class-selection', {
	props: ['klass'],
	template: '<li><button v-on:click="$emit(\'change-class\')">{{klass.name}}</button></li>'
});

Vue.component('talent-tree', {
	props: ['tree'],
	template: '<div class="talent-tree"><h4>{{tree.name}}</h4></div>'
});

var app = new Vue({
	el: '#app',
	data: {
		talentTrees: {
			'Hunter': [
				{ id: 0, name: 'Beast Mastery' },
				{ id: 1, name: 'Markmanship' },
				{ id: 2, name: 'Survival' }
			],
			'Rogue': [
				{ id: 0, name: 'Assassination' },
				{ id: 1, name: 'Combat' },
				{ id: 2, name: 'Subtlety' }
			],
			'Mage': [
				{ id: 0, name: 'Arcane' },
				{ id: 1, name: 'Fire' },
				{ id: 2, name: 'Frost' }
			],
		},
		classes: [
			{ id: 0, name: 'Hunter' },
			{ id: 1, name: 'Rogue' },
			{ id: 2, name: 'Mage' },
		],
		currentClass: 'Hunter'
	}
});