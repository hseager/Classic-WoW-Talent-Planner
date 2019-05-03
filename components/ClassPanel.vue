<template>
	<div class="talent-trees">
		<talent-tree
			v-for="tree in classType.talentTrees"
			v-bind:tree="tree"
			v-bind:key="tree.id"
			v-on:decreaseAvailableSkillPoints="decreaseAvailableSkillPoints"
			v-on:increaseAvailableSkillPoints="increaseAvailableSkillPoints"
			v-on:decreaseRequiredLevel="decreaseRequiredLevel"
			v-on:increaseRequiredLevel="increaseRequiredLevel"
			v-on:addToTalentPath="onAddToTalentPath"
			v-bind:className="classType.name"
			v-bind:constants="constants"
			v-bind:availableSkillPoints="classType.availableSkillPoints"
		></talent-tree>
	</div>
</template>
<script>
	import talentTree from './TalentTree';

	export default {
		name: 'class-panel',
		props: {
			classType: Object,
			constants: Object,
		},
		components: {
			talentTree
		},
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
			onAddToTalentPath: function(treeId, skillId, skillIcon){
				this.classType.talentPath.push({treeId, skillId, skillIcon});
			},
			onRemoveFromTalentPath: function(treeId, skillId){
				this.classType.talentPath.push({treeId: treeId, skillId: skillId});
			}
		},
	}
</script>