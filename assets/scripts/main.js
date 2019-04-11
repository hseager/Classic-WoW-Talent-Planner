Vue.component('class-selection', {
	props: ['klass'],
	template: `<li><button v-on:click="$emit('change-class')">{{klass.name}}</button></li>`
});

Vue.component('talent-tree', {
	props: ['tree'],
	template: 
	`<div class="talent-tree">
		<h3>{{tree.name}}</h3>
		<skills
			v-for="skill in tree.skills"
			v-bind:skill="skill"
			v-bind:key="skill.id"
			v-on:increase-skill-rank="onIncreaseSkillRank(skill)"
			v-on:decrease-skill-rank="onDecreaseSkillRank(skill)">
		></skills>
	</div>`,
	methods: {
		onIncreaseSkillRank: function(skill){
			if(skill.currentRank < skill.maxRank)
				skill.currentRank++
				this.talentTrees[this.currentClass].skillPoints--;
		},
		onDecreaseSkillRank: function(skill){
			if(skill.currentRank >= 1)
				skill.currentRank--;
				this.talentTrees[this.currentClass].skillPoints++;
		}
	}
});
 
Vue.component('skills', {
	props: ['skill'],
	template: 
		`<div class="skill"
			v-on:click="$emit('increase-skill-rank')"
			v-on:click.right.prevent="$emit('decrease-skill-rank')">
			{{skill.name}}: {{skill.currentRank}}
		</div>`
});

var app = new Vue({
	el: '#app',
	data: {
		currentClass: 'Hunter',
		classes: [
			{ id: 0, name: 'Hunter' },
			{ id: 1, name: 'Rogue' },
			{ id: 2, name: 'Mage' },
		],
		talentTrees: {
			Hunter: {
				skillPoints: 51,
				specs : [
					{ id: 0, name: 'Beast Mastery', skills: [
						{ id: 0, name: 'Improved Aspect of the Hawk', maxRank: 5, currentRank: 0 },
						{ id: 1, name: 'Endurance Training', maxRank: 5, currentRank: 0 }
					] },
					{ id: 1, name: 'Markmanship' },
					{ id: 2, name: 'Survival' }
				],
			},
			Rogue: [
				{ id: 0, name: 'Assassination' },
				{ id: 1, name: 'Combat' },
				{ id: 2, name: 'Subtlety' }
			],
			Mage: [
				{ id: 0, name: 'Arcane' },
				{ id: 1, name: 'Fire' },
				{ id: 2, name: 'Frost' }
			],
		},
	},
});