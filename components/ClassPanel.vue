<template>
	<div :class="['talent-trees', { 'is-max-level' : this.currentClass.requiredLevel == 60 }]">
		<talent-tree
			v-for="tree in currentClass.talentTrees"
			v-bind:tree="tree"
			v-bind:key="tree.id"
			v-bind:className="currentClass.name"
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
		computed: {
			requiredLevel(){
				return this.$store.state.classes[this.$store.state.currentClassId].requiredLevel;
			}
		},
		methods: {
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
				if(this.requiredLevel == 60){
					this.currentClass.talentTrees.forEach(tree => {
						tree.skills.forEach(skill => {
							if(skill.currentRank == 0){
								skill.faded = true;
							}
						});
					});
				} else if(this.requiredLevel == 59){
					this.currentClass.talentTrees.forEach(tree => {
						tree.skills.forEach(skill => {
							skill.faded = false;
						});
					});
				}
			}
		},
	}
</script>