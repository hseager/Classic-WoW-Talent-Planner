let tooltip = {
	props: {
		skill: Object,
		showTooltip: Boolean,
		treeName: String,
	},
	template: 
	`<div v-if="showTooltip" class="skill-tooltip">
		<h3>{{skill.name}}</h3>
		<p>Rank {{skill.currentRank}}/{{skill.maxRank}}</p>
		<p class="rank-description">{{skill.rankDescription[skill.currentRank-1]}}</p>
		<div v-if="this.skill.requirements && !this.skill.enabled">
			<p class="skill-requirement" v-if="skill.requirements.skill">Requires {{skill.requirements.skill.skillPoints}} points in {{ getRequiredSkillName }} </p>
			<p class="skill-requirement" v-if="skill.requirements.specPoints">Requires {{skill.requirements.specPoints}} points in {{treeName}} talents</p>
		</div>
		<div v-if="hasNextRank">
			<br/>
			<p>Next rank:</p>
		</div>
		<p class="rank-description">{{skill.rankDescription[skill.currentRank]}}</p>
	</div>`,
	computed: {
		hasNextRank: function(){
			return this.skill.currentRank > 0 && this.skill.currentRank != this.skill.maxRank
		},
		getRequiredSkillName: function(){
			return this.$parent.getSkill(this.skill.requirements.skill.id).name;
		}
	},
};

let skill = {
	props: {
		constants: Object,
		skill: Object,
		tree: Object,
	},
	data: function(){
		return {
			showTooltip: false,
		}
	},
	template: 
		`<div :class="['skill', { 'is-enabled': skill.enabled }, skillRequirementArrow]" :style="getGridPosition">
			<div class="skill-icon"
				v-on:click="onIncreaseSkillRank"
				v-on:click.right.prevent="onDecreaseSkillRank"
				v-on:mouseover="showTooltip = true"
				v-on:mouseout="showTooltip = false">
				<img v-bind:src="getSkillIcon" class="skill-icon-image">
			</div>
			<span class="skill-rank">{{skill.currentRank}}/{{skill.maxRank}}</span>
			<tooltip
				v-bind:skill="skill"
				v-bind:showTooltip="showTooltip"
				v-bind:treeName="tree.name"></tooltip>
		</div>`,
	components: {
		tooltip,
	},
	computed:{
		getGridPosition: function(){
			if(typeof this.skill.position !== 'undefined'){
				return {
					gridRowStart: this.skill.position[0],
					gridColumnStart: this.skill.position[1],
				}
			}
		},
		getSkillIcon: function(){
			if(typeof this.skill.icon !== 'undefined'){
				return this.constants.imageDirectory + this.constants.skillIconDirectory + this.skill.icon;
			}
		},
		skillRequirementArrow: function(){
			if(this.skill.requirements && this.skill.requirements.skill){

				let requiredSkill = this.getSkill(this.skill.requirements.skill.id),
					cssClassName = '',
					arrowDistance = this.skill.position[0] - requiredSkill.position[0];

				if(arrowDistance == 1){
					cssClassName = 'down-arrow';
				} else if(arrowDistance == 2){
					cssClassName = ['down-arrow','medium-arrow'];
				} else if(arrowDistance == 2){
					cssClassName = ['down-arrow','large-arrow'];
				}

				return cssClassName;
			}
		}
	},
	methods: {
		onIncreaseSkillRank: function(){
			if(this.skill.enabled){
				if(this.skill.currentRank < this.skill.maxRank){
					this.skill.currentRank++
					this.$parent.$emit('decreaseAvailableSkillPoints');
					this.$parent.$emit('increaseRequiredLevel');
					this.$emit('increaseTreeSkillPoints');
					this.checkSkillRequirements();
				}
			}
		},
		onDecreaseSkillRank: function(){
			if(this.skill.currentRank >= 1){
				this.skill.currentRank--;
				this.$parent.$emit('increaseAvailableSkillPoints');
				this.$parent.$emit('decreaseRequiredLevel');
				this.$emit('decreaseTreeSkillPoints', 1);
				this.checkSkillRequirements();
			}
		},
		checkSkillRequirements: function(){
			let treeSkillPoints = this.tree.skillPoints;
			this.tree.skills.forEach(function(skill){
				if(skill.requirements){
					if(skill.requirements.specPoints){
						if(treeSkillPoints >= skill.requirements.specPoints){
							skill.enabled = true;
						} else {
							skill.enabled = false;
						}
					}
				}
			});
		},
		getSkill: function(id){
			return this.tree.skills[id];
		}
	},
};

let talentTree = {
	props: {
		className: String,
		tree: Object,
		constants: Object,
	},
	template: 
	`<div>
		<h3>{{tree.name}} ({{tree.skillPoints}})</h3>
		<div class="talent-tree" :style="getTreeBackgroundImage">
			<skill
				v-for="skill in tree.skills"
				v-bind:skill="skill"
				v-bind:key="skill.id"
				v-bind:constants="constants"
				v-bind:tree="tree"
				v-on:increaseTreeSkillPoints="onIncreaseTreeSkillPoints"
				v-on:decreaseTreeSkillPoints="onDecreaseTreeSkillPoints">
			></skill>
		</div>
	</div>`,
	components: {
		skill
	},
	computed: {
		getTreeBackgroundImage: function(){
			let backgroundImageUrl = this.constants.imageDirectory + this.constants.backgroundDirectory + 'background-' + this.className + '-' + this.tree.name.replace(' ','-').toLowerCase() + '.jpg';
			return {
				backgroundImage: `url('${backgroundImageUrl}')`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
			}
		},
	},
	methods: {
		onIncreaseTreeSkillPoints: function(){
			this.tree.skillPoints++;
		},
		onDecreaseTreeSkillPoints: function(amount){
			this.tree.skillPoints = this.tree.skillPoints - amount;
		}
	}
};

let classPanel = {
	props: {
		classType: Object,
		constants: Object,
	},
	template:
	`<div class="talent-trees">
		<talent-tree
			v-for="tree in classType.talentTrees"
			v-bind:tree="tree"
			v-bind:key="tree.id"
			v-on:decreaseAvailableSkillPoints="decreaseAvailableSkillPoints"
			v-on:increaseAvailableSkillPoints="increaseAvailableSkillPoints"
			v-on:decreaseRequiredLevel="decreaseRequiredLevel"
			v-on:increaseRequiredLevel="increaseRequiredLevel"
			v-bind:className="classType.name"
			v-bind:constants="constants"
		></talent-tree>
	</div>`,
	methods: {
		decreaseAvailableSkillPoints: function(){
			this.classType.availableSkillPoints--;
		},
		increaseAvailableSkillPoints: function(){
			this.classType.availableSkillPoints++;
		},
		increaseRequiredLevel: function(){
			if(this.classType.requiredLevel == 0)
				this.classType.requiredLevel = 10;
			else
				this.classType.requiredLevel++;
		},
		decreaseRequiredLevel: function(){
			if(this.classType.requiredLevel == 10)
				this.classType.requiredLevel = 0;
			else
				this.classType.requiredLevel--;
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
	data: function(){
		return {
			classIconImage: this.constants.imageDirectory + this.constants.classIconDirectory + 'icon-' + this.classType.name + '.jpg',
		}
	},
	template: 
	`<li v-on:click="onClassSelect" v-bind:class="{ active: currentClass === classType.id }">
		<img v-bind:src="classIconImage">
	</li>`,
	methods: {
		onClassSelect: function(){
			this.$emit('change-class');
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
		<ul class="class-list">
			<class-list
				v-for="classType in classes"
				v-bind:classType="classType"
				v-bind:key="classType.id"
				v-on:change-class="currentClass = classType.id"
				v-bind:constants="constants"
				v-bind:currentClass="currentClass"
			></class-list>
		</ul>
		<strong>Skills points: {{classes[currentClass].availableSkillPoints}}</strong><br/>
		<strong>Required level: {{classes[currentClass].requiredLevel}}</strong>
		<class-panel
			v-bind:class-type="classes[currentClass]"
			v-bind:constants="constants"
		></class-panel>
	</div>`,
});