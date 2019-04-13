let skills = {
	props: {
		skill: Object
	},
	template: 
		`<div class="skill"
			v-on:click="onIncreaseSkillRank(skill)"
			v-on:click.right.prevent="onDecreaseSkillRank(skill)">
			<p>{{skill.name}}: {{skill.currentRank}}</p>
			<em>{{skill.rankDescription[skill.currentRank-1]}}</em>
			<span>
				<strong v-if="skill.currentRank > 0 && skill.currentRank != 5">Next rank</strong>
				<em>{{skill.rankDescription[skill.currentRank]}}</em>
			</span>
		</div>`,
	methods: {
		onIncreaseSkillRank: function(skill){
			if(skill.currentRank < skill.maxRank){
				skill.currentRank++
				this.$parent.$emit('decreaseClassSkillPoints');
				this.$parent.$emit('increaseRequiredLevel');
			}
		},
		onDecreaseSkillRank: function(skill){
			if(skill.currentRank >= 1){
				skill.currentRank--;
				this.$parent.$emit('increaseClassSkillPoints');
				this.$parent.$emit('decreaseRequiredLevel');
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
			v-on:decreaseRequiredLevel="decreaseRequiredLevel(classType)"
			v-on:increaseRequiredLevel="increaseRequiredLevel(classType)"
		></talent-tree>
	</div>`,
	methods: {
		decreaseClassSkillPoints: function(classType){
			classType.skillPoints--;
		},
		increaseClassSkillPoints: function(classType){
			classType.skillPoints++;
		},
		increaseRequiredLevel: function(classType){
			if(classType.requiredLevel == 0)
				classType.requiredLevel = 10;
			else
				classType.requiredLevel++;
		},
		decreaseRequiredLevel: function(classType){
			if(classType.requiredLevel == 10)
				classType.requiredLevel = 0
			else
				classType.requiredLevel--;
		},
	},
	components: {
		talentTree
	}
};

let classList = {
	props: {
		constants: Object,		
		classType: Object,
		currentClass: Number
	},
	data(){
		return {
			iconHoverCheck: false
		}
	},
	template: 
	`<li>
		<img 
			v-on:click="$emit('change-class')"
			v-on:mouseover="iconHoverCheck = true"
			v-on:mouseout="iconHoverCheck = false"
			v-bind:src="setClassIcon(classType, iconHoverCheck, constants, currentClass)"
		>
		<button v-on:click="$emit('change-class')">{{classType.name}}</button>
	</li>`,
	methods: {
		setClassIcon: function(classType, iconHoverCheck, constants, currentClass){
			if(currentClass == classType.id){
				return constants.imageDirectory + classType.iconHover;
			}
			return iconHoverCheck ? constants.imageDirectory + classType.iconHover : constants.imageDirectory + classType.icon;
		}
	}
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
		<strong>Required level: {{classes[currentClass].requiredLevel}}</strong>
		<ul>
			<class-list
				v-for="classType in classes"
				v-bind:classType="classType"
				v-bind:key="classType.id"
				v-on:change-class="currentClass = classType.id"
				v-bind:constants="constants"
				v-bind:currentClass="currentClass"
			></class-list>
		</ul>
		<class-panel
			v-bind:class-type="classes[currentClass]"
		></class-panel>
	</div>`,
});