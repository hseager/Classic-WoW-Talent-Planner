<template>
	<div>
		<img src="../public/images/wow-classic-logo.png" class="logo" />
		<h1 class="main-title">Talent Calculator</h1>
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
		<class-panel
			v-bind:class-type="classes[currentClass]"
			v-bind:constants="constants"
		></class-panel>
		<div class="talent-info">
			<p class="talent-info-stat">Skill points: {{classes[currentClass].availableSkillPoints}}</p>
			<p class="talent-info-stat">Required level: {{classes[currentClass].requiredLevel}}</p>
			<button class="button" v-on:click="resetTalentTrees()">Reset</button>
		</div>
	</div>
</template>
<script>
	import talentData from '../assets/data/talent-data.json';
	import classList from './ClassList';
	import classPanel from './ClassPanel';

	export default {
		components: {
			classList,
			classPanel
		},
		data(){
			return talentData;
		},
		methods: {
			resetTalentTrees: function(){
				let currentClass = talentData.classes[this.currentClass];
				currentClass.availableSkillPoints = 51;
				currentClass.requiredLevel = 0;
				currentClass.talentTrees.forEach(tree => {
					tree.skillPoints = 0;
					tree.skills.forEach(skill => {
						skill.currentRank = 0;
						if(skill.requirements)
						 	skill.enabled = false;
					});
				});
			}
		}
	}
</script>