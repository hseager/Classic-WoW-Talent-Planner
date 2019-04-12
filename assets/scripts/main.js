let talentData = {
	"currentClass": 0,
	"classes": [
		{ 
			"id": 0, 
			"name": "hunter", 
			"skillPoints": 51, 
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Beast Mastery",
					"skills": [
						{ 
							"id": 0, 
							"name": "Improved Aspect of the Hawk", 
							"maxRank": 5, 
							"currentRank": 0
						},
						{ 
							"id": 1,
							"name": "Endurance Training",
							"maxRank": 5,
							"currentRank": 0
						}
					]
				},
				{ 
					"id": 1,
					"name": "Markmanship",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Concussive Shot",
							"maxRank": 5,
							"currentRank": 0
						},
						{ 
							"id": 1, 
							"name": "Efficiency", 
							"maxRank": 5, 
							"currentRank": 0
						}
					]
				},
				{ 
					"id": 2,
					"name": "Survival"
				}
			]
		},
		{ 
			"id": 1, 
			"name": "rogue", 
			"skillPoints": 51, 
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Assassination",
					"skills": [
						{ 
							"id": 0, 
							"name": "Improved Eviscerate", 
							"maxRank": 5, 
							"currentRank": 0
						},
					]
				},
				{ 
					"id": 1,
					"name": "Combat",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Gouge",
							"maxRank": 5,
							"currentRank": 0
						},
					]
				},
				{ 
					"id": 2,
					"name": "Subtlety"
				}
			]
		},
		{ 
			"id": 2, 
			"name": "mage", 
			"skillPoints": 51, 
			"talentTrees": [
				{ 
					"id": 0,
					"name": "Arcane",
					"skills": [
						{ 
							"id": 0, 
							"name": "Arcane Subtlety", 
							"maxRank": 2, 
							"currentRank": 0
						},
					]
				},
				{ 
					"id": 1,
					"name": "Fire",
					"skills": [
						{ 
							"id": 0,
							"name": "Improved Fireball",
							"maxRank": 5,
							"currentRank": 0
						},
					]
				},
				{ 
					"id": 2,
					"name": "Frost"
				}
			]
		}
	]
};

Vue.component('class-list', {
	props: ['classType'],
	template: `<li><button v-on:click="$emit('change-class')">{{classType.name}}</button></li>`
});

Vue.component('class-panel', {
	props: ['classType'],
	template: 
	`<div class="talent-trees">
		<strong>Skills points: {{classType.skillPoints}}</strong>
		<talent-tree 
			v-for="tree in classType.talentTrees"
			v-bind:tree="tree"
			v-bind:key="tree.id"
			v-on:decreaseClassSkillPoints="decreaseClassSkillPoints(classType)"
			v-on:increaseClassSkillPoints="increaseClassSkillPoints(classType)"
		></talent-tree>
	</div>`,
	methods: {
		decreaseClassSkillPoints: function(classType){
			classType.skillPoints--;
		},
		increaseClassSkillPoints: function(classType){
			classType.skillPoints++;
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
				this.$parent.$emit('decreaseClassSkillPoints');
			}
		},
		onDecreaseSkillRank: function(skill){
			if(skill.currentRank >= 1){
				skill.currentRank--;
				this.$parent.$emit('increaseClassSkillPoints');
			}
		}
	}
});

var app = new Vue({
	el: '#talent-calculator',
	template: 
	`<div>
		<ul>
			<class-list
				v-for="classType in classes"
				v-bind:classType="classType"
				v-bind:key="classType.id"
				v-on:change-class="currentClass = classType.id"
			></class-list>
		</ul>
		<class-panel
			v-bind:class-type="classes[currentClass]"
		></class-panel>
	</div>`,
	data: talentData,
});