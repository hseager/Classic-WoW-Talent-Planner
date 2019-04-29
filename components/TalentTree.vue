<template>
	<div class="talent-tree-container">
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
			</skill>
		</div>
	</div>
</template>
<script>
	import skill from './Skill';
	export default {
		name: 'talent-tree',
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
	}
</script>
<style lang="scss">
	.talent-tree-container{ margin:0 20px 0 0; }
	.talent-trees{ display: flex; margin:20px 0; flex-wrap: wrap; }
	.talent-tree{ width: 350px; min-height: 450px; padding:20px; background:#333; display: grid; grid-template-columns: repeat(4, 25%); grid-template-rows: repeat(7, 1fr); border: 1px solid #666; }
	.talent-tree-title{ text-align:center; font-size: 20px; margin:0 0 10px; }
</style>