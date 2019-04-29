<template>
	<div :class="['skill', { 'is-enabled': skill.enabled }, { 'is-max-rank': skill.currentRank == skill.maxRank }, skillRequirementArrow]" :style="getGridPosition">
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
	</div>
</template>
<script>
	import tooltip from './Tooltip';
	export default {
		name: 'talent-tree',
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
	}
</script>
<style lang="scss">
	.skill{ position: relative; margin: 10px; padding:1px; border:2px solid transparent; border-radius: 5px; border-bottom:none; }
	.skill-icon{ width:100%; overflow:hidden; border: 2px solid #6b6b6c; border-radius: 5px; border-top-color: #c7c9cb; border-bottom-color: #46474a; box-shadow:0 1px 5px #000; }
	.skill-rank{ position: absolute; bottom: -8px; right: -15px; background: #000; border-radius: 3px; padding: 2px 6px; cursor: default; border-radius: 5px; }
	.skill-icon-image{ filter: grayscale(100%); width: 100%; }

	.skill.is-enabled{ cursor:pointer; border-color: #16ba17; background:#000; }
	.skill.is-max-rank{ border-color: #ffd100; }
	.skill.is-enabled .skill-icon-image{ filter: grayscale(0); }
	.skill.is-enabled .skill-rank{ cursor: pointer; }
</style>