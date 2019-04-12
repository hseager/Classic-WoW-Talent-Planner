let skills = {
	props: {
		skill: Object
	},
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
};

let talentTree = {
	props: {
		treeName: String,
		treeSkills: Array
	},
	template: 
	`<div class="talent-tree">
		<h3>{{treeName}}</h3>
		<skills
			v-for="skill in treeSkills"
			v-bind:skill="skill"
			v-bind:key="skill.id">
		></skills>
	</div>`,
	components: {
		skills
	}
};

let classPanel = {
	props: {
		classType: Object
	},
	template:
	`<div class="talent-trees">
		<talent-tree 
			v-for="tree in classType.talentTrees"
			v-bind:treeName="tree.name"
			v-bind:treeSkills="tree.skills"
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
	},
	components: {
		talentTree
	}
};

let classList = {
	props: {
		classType: Object
	},
	template: `<li><button v-on:click="$emit('change-class')">{{classType.name}}</button></li>`
};

var app = new Vue({
	el: '#talent-calculator',
	data: talentData,
	components: {
		classList,
		classPanel
	},
	template: 
	`<div>
		<strong>Skills points: {{classes[currentClass].skillPoints}}</strong>
		<strong>Current level: {{classes[currentClass].currentLevel}}</strong>
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
});