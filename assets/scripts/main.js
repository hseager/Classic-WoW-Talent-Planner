let tooltip = {
	props: {
		skill: Object,
		showTooltip: Boolean,
		treeName: String,
	},
	template: 
	`<div v-if="showTooltip" class="skill-tooltip">
		<h3>{{skill.name}}</h3>
		<p class="rank-description">{{skill.rankDescription[skill.currentRank-1]}}</p>
		<div v-if="this.skill.requirements && !this.skill.enabled">
			<p class="skill-requirement" v-if="skill.requirements.skill">Requires {{skill.requirements.skill.skillPoints}} points in {{ getRequiredSkillName }} </p>
			<p class="skill-requirement" v-if="skill.requirements.specPoints">Requires {{skill.requirements.specPoints}} points in {{treeName}} talents</p>
		</div>
		<div v-if="hasNextRank">
			<br/>
			<p>Next rank:</p>
		</div>
		<p class="rank-description" v-html="skill.rankDescription[skill.currentRank]"></p>
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
		className: String,
		currentSkillTier: Number,
		availableSkillPoints: Number,
	},
	data: function(){
		return {
			showTooltip: false,
		}
	},
	template: 
		`<div :class="['skill', { 'is-enabled': skill.enabled }, { 'is-max-rank': skill.currentRank == skill.maxRank }, skillRequirementArrow]" :style="getGridPosition">
			<div class="skill-icon"
				v-on:click="onIncreaseSkillRank"
				v-on:click.right.prevent="onDecreaseSkillRank"
				v-on:mouseover="showTooltip = true"
				v-on:mouseout="showTooltip = false">
				<img v-bind:src="skillIcon" class="skill-icon-image">
			</div>
			<span class="skill-rank"
				v-on:click="onIncreaseSkillRank"
				v-on:click.right.prevent="onDecreaseSkillRank"
				v-on:mouseover="showTooltip = true"
				v-on:mouseout="showTooltip = false">{{skill.currentRank}}/{{skill.maxRank}}</span>
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
		skillRequirementArrow: function(){
			if(this.skill.requirements && this.skill.requirements.skill){
				let requiredSkill = this.getSkill(this.skill.requirements.skill.id),
					cssClassName = [],
					arrowYDistance = this.skill.position[0] - requiredSkill.position[0],
					arrowXDistance = this.skill.position[1] - requiredSkill.position[1];

				if(arrowYDistance == 1){
					cssClassName = ['down-arrow'];
				} else if(arrowYDistance == 2){
					cssClassName = ['down-arrow','medium-arrow'];
				} else if(arrowYDistance == 3){
					cssClassName = ['down-arrow','large-arrow'];
				}

				if(arrowXDistance == 1){
					cssClassName = ['side-arrow'];
				}

				if(arrowYDistance == 1 && arrowXDistance == 1){
					cssClassName = ['corner-arrow'];
				}

				return cssClassName;
			}
		},
		skillIcon: function(){
			return 	this.constants.imageDirectory + 
					this.constants.skillIconDirectory + 
					this.className + '/' + 
					this.tree.name
						.replace(' ','-')
						.toLowerCase() + '/' + 
					this.getImageFileName(this.skill.name);
		},
	},
	methods: {
		onIncreaseSkillRank: function(){
			if(this.skill.enabled && this.availableSkillPoints > 0){
				if(this.skill.currentRank < this.skill.maxRank){
					this.skill.currentRank++
					this.$parent.$emit('decreaseAvailableSkillPoints');
					this.$parent.$emit('increaseRequiredLevel');
					this.$emit('increaseTreeSkillPoints');
					this.$emit('increaseCurrentSkillTier', this.skill.position[0]);
					this.checkSkillRequirements();
				}
			}
		},
		onDecreaseSkillRank: function(){
			if(this.skill.currentRank >= 1){
				if(this.isValidDecrease()){
					this.skill.currentRank--;
					this.$parent.$emit('increaseAvailableSkillPoints');
					this.$parent.$emit('decreaseRequiredLevel');
					this.$emit('decreaseTreeSkillPoints');
					this.$emit('decreaseCurrentSkillTier', this.skill.position[0]);
					this.checkSkillRequirements();
				}
			}
		},
		checkSkillRequirements: function(){
			this.tree.skills.forEach((skill) => {
				if(skill.requirements){
					if(skill.requirements.specPoints && skill.requirements.skill){
						if(this.tree.skillPoints >= skill.requirements.specPoints){
							let requiredSkill = this.getSkill(skill.requirements.skill.id);
							if(requiredSkill.currentRank == skill.requirements.skill.skillPoints){
								skill.enabled = true;
							} else{
								skill.enabled = false;
							}
						} else {
							skill.enabled = false;
						}
					} else if(skill.requirements.specPoints){
						if(this.tree.skillPoints >= skill.requirements.specPoints){
							skill.enabled = true;
						} else {
							skill.enabled = false;
						}
					} else if(skill.requirements.skill){
						let requiredSkill = this.getSkill(skill.requirements.skill.id);
						if(requiredSkill.currentRank == skill.requirements.skill.skillPoints){
							skill.enabled = true;
						} else{
							skill.enabled = false;
						}
					}
				}
			});
		},
		getSkill: function(id){
			return this.tree.skills[id];
		},
		isValidDecrease: function(){
			if(this.hasAdjacentSkillRequirement())
				return false;

			if(this.skill.position[0] == this.currentSkillTier)
				return true;
			else 
				return false;
		},
		hasAdjacentSkillRequirement: function(){
			let adjacentSkill = this.getSkill(this.skill.id + 1);
			if(adjacentSkill && adjacentSkill.requirements && adjacentSkill.requirements.skill){
				return adjacentSkill.requirements.skill.id == this.skill.id && adjacentSkill.currentRank > 0;
			} else {
				return false;
			}
		}
	},
};

let talentTree = {
	props: {
		className: String,
		tree: Object,
		constants: Object,
		availableSkillPoints: Number,
	},
	data: function(){
		return {
			currentSkillTier: 0,
		}
	},
	template: 
	`<div class="talent-tree-container">
		<h3 class="talent-tree-title">{{tree.name}} ({{tree.skillPoints}})</h3>
		<div class="talent-tree" :style="getTreeBackgroundImage">
			<skill
				v-for="skill in tree.skills"
				v-bind:skill="skill"
				v-bind:key="skill.id"
				v-bind:constants="constants"
				v-bind:tree="tree"
				v-bind:className="className"
				v-bind:currentSkillTier="currentSkillTier"
				v-bind:availableSkillPoints="availableSkillPoints"
				v-on:increaseTreeSkillPoints="onIncreaseTreeSkillPoints"
				v-on:decreaseTreeSkillPoints="onDecreaseTreeSkillPoints"
				v-on:increaseCurrentSkillTier="onIncreaseCurrentSkillTier"
				v-on:decreaseCurrentSkillTier="onDecreaseCurrentSkillTier">
			></skill>
		</div>
	</div>`,
	components: {
		skill
	},
	computed: {
		getTreeBackgroundImage: function(){
			let backgroundImageUrl = 	this.constants.imageDirectory + 
										this.constants.backgroundDirectory + 'background-' + 
										this.className + '-' + 
										this.getImageFileName(this.tree.name);
			return {
				backgroundImage: `url('${backgroundImageUrl}')`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
				backgroundPosition: 'center',
			}
		},
	},
	methods: {
		onIncreaseTreeSkillPoints: function(){
			this.tree.skillPoints++;
		},
		onDecreaseTreeSkillPoints: function(){
			this.tree.skillPoints--;
		},
		onIncreaseCurrentSkillTier: function(tier){
			if(tier > this.currentSkillTier)
				this.currentSkillTier = tier;
		},
		onDecreaseCurrentSkillTier: function(tier){
			let totalTierSkillPoints = this.getTotalTierSkillPoints(tier);
			if(totalTierSkillPoints == 0)
				this.currentSkillTier = tier - 1;
		},
		getTotalTierSkillPoints: function(tier){
			let tierSkillPoints = 0;
			this.tree.skills.forEach((skill) => {
				if(skill.position[0] == tier){
					tierSkillPoints = tierSkillPoints + skill.currentRank;
				}
			});
			return tierSkillPoints;
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
			v-bind:availableSkillPoints="classType.availableSkillPoints"
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