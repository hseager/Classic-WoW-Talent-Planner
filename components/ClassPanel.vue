<template>
	<div :class="['talent-trees', { 'is-max-level' : this.currentClass.requiredLevel == 60 }]">
		<talent-tree
			v-for="tree in currentClass.talentTrees"
			v-bind:tree="tree"
			v-bind:key="tree.id"
			v-bind:className="currentClass.name"
			v-bind:availableSkillPoints="currentClass.availableSkillPoints"
			v-bind:requiredLevel="currentClass.requiredLevel"
			v-on:decreaseAvailableSkillPoints="onDecreaseAvailableSkillPoints"
			v-on:increaseAvailableSkillPoints="onIncreaseAvailableSkillPoints"
			v-on:decreaseRequiredLevel="onDecreaseRequiredLevel"
			v-on:increaseRequiredLevel="onIncreaseRequiredLevel"
			v-on:addToTalentPath="onAddToTalentPath"
			v-on:removeSkillFromTalentPath="onRemoveSkillFromTalentPath"
			v-on:removeTreeFromTalentPath="onRemoveTreeFromTalentPath"
		></talent-tree>
	</div>
</template>
<script>
	import talentTree from './TalentTree';

	export default {
		name: 'class-panel',
		props: {
			currentClass: Object,
		},
		components: {
			talentTree
		},
		methods: {
			onDecreaseAvailableSkillPoints: function(){
				this.currentClass.availableSkillPoints--;
			},
			onIncreaseAvailableSkillPoints: function(points){
				this.currentClass.availableSkillPoints = this.currentClass.availableSkillPoints + points;
			},
			onIncreaseRequiredLevel: function(){
				if(this.currentClass.requiredLevel == 0)
					this.currentClass.requiredLevel = 10;
				else
					this.currentClass.requiredLevel++;

				this.checkMaxLevel();
			},
			onDecreaseRequiredLevel: function(points){
				this.currentClass.requiredLevel = this.currentClass.requiredLevel - points;
				if(this.currentClass.requiredLevel < 10)
					this.currentClass.requiredLevel = 0;
					
				this.checkMaxLevel();
			},
			onAddToTalentPath: function(treeId, skillId, skillIcon){
				this.currentClass.talentPath.push({treeId, skillId, skillIcon, faded : false});
			},
			onRemoveSkillFromTalentPath: function(treeId, skillId){
				let talentPathItemIndex = '';
				this.currentClass.talentPath.forEach((talentPathItem, i) => {
					if(talentPathItem.treeId == treeId && talentPathItem.skillId == skillId){
						talentPathItemIndex = i;
					}
				});
				if(typeof talentPathItemIndex == 'number'){
					this.currentClass.talentPath.splice(talentPathItemIndex, 1);
				}
			},
			onRemoveTreeFromTalentPath: function(treeId){
				this.currentClass.talentPath.forEach((talentPathItem, i) => {
					if(talentPathItem.treeId == treeId){
						this.currentClass.talentPath.splice(i, 1);
					}
				});
			},
			checkMaxLevel: function(){
				if(this.currentClass.requiredLevel == 60){
					this.currentClass.talentTrees.forEach(tree => {
						tree.skills.forEach(skill => {
							if(skill.currentRank == 0){
								skill.faded = true;
							}
						});
					});
				} else if(this.currentClass.requiredLevel == 59){
					this.classType.talentTrees.forEach(tree => {
						tree.skills.forEach(skill => {
							skill.faded = false;
						});
					});
				}
			}
		},
	}
</script>