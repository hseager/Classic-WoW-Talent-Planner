Vue.component('class-selection', {
	props: ['klass'],
	template: `<li><button v-on:click="$emit('change-class')">{{klass.name}}</button></li>`
});

Vue.component('class-trees', {
	props: ['classTree'],
	template: 
	`<div class="talent-trees">
		<strong>Skills points: {{classTree.skillPoints}}</strong>
		<talent-tree 
			v-for="tree in classTree.specs"
			v-bind:tree="tree"
			v-bind:key="tree.id"
			v-on:decreaseTotalSkillPoints="decreaseTotalSkillPoints(classTree)"
			v-on:increaseTotalSkillPoints="increaseTotalSkillPoints(classTree)"
		></talent-tree>
	</div>`,
	methods: {
		decreaseTotalSkillPoints: function(classTree){
			classTree.skillPoints--;
		},
		increaseTotalSkillPoints: function(classTree){
			classTree.skillPoints++;
		}
	}
});

Vue.component('talent-tree', {
	props: ['tree'],
	template: 
	`<div class="talent-tree">
		<h3>{{tree.name}}</h3>
		<skills
			v-for="skill in tree.skills"
			v-bind:skill="skill"
			v-bind:key="skill.id">
		></skills>
	</div>`,
});
 
Vue.component('skills', {
	props: ['skill'],
	template: 
		`<div class="skill"
			v-on:click="onIncreaseSkillRank(skill)"
			v-on:click.right.prevent="onDecreaseSkillRank(skill)">
			{{skill.name}}: {{skill.currentRank}}
		</div>`,
	methods: {
		onIncreaseSkillRank: function(skill){
			if(skill.currentRank < skill.maxRank){
				skill.currentRank++
				this.$parent.$emit('decreaseTotalSkillPoints');
			}
		},
		onDecreaseSkillRank: function(skill){
			if(skill.currentRank >= 1){
				skill.currentRank--;
				this.$parent.$emit('increaseTotalSkillPoints');
			}
		}
	}
});

var app = new Vue({
	el: '#app',
	data: {
		currentClass: 'hunter',
		classes: [
			{ id: 0, name: 'hunter' },
			{ id: 1, name: 'rogue' },
			{ id: 2, name: 'mage' },
		],
		talentTrees: {
			hunter: {
				skillPoints: 51,
				specs: [
					{ id: 0, name: 'Beast Mastery', skills: [
						{ id: 0, name: 'Improved Aspect of the Hawk', maxRank: 5, currentRank: 0 },
						{ id: 1, name: 'Endurance Training', maxRank: 5, currentRank: 0 }
					] },
					{ id: 1, name: 'Markmanship' },
					{ id: 2, name: 'Survival' }
				]
			},
			rogue: {
				skillPoints: 51,
				specs: [
					{ id: 0, name: 'Assassination' },
					{ id: 1, name: 'Combat' },
					{ id: 2, name: 'Subtlety' }
				]
			},
			mage: {
				skillPoints: 51,
				specs: [
					{ id: 0, name: 'Arcane' },
					{ id: 1, name: 'Fire' },
					{ id: 2, name: 'Frost' }
				]
			} 
		},
	},
});