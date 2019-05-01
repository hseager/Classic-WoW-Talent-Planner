<template>
	<div>
		<img src="../public/images/wow-classic-logo.png" class="logo" />
		<h1 class="main-title">Talent Calculator</h1>
		<ul class="class-list">
			<class-list
				v-for="classType in data.classes"
				v-bind:classType="classType"
				v-bind:key="classType.id"
				v-on:change-class="data.currentClass = classType.id"
				v-bind:constants="data.constants"
				v-bind:currentClass="data.currentClass"
			></class-list>
		</ul>
		<class-panel
			v-bind:class-type="data.classes[data.currentClass]"
			v-bind:constants="data.constants"
		></class-panel>
		<div class="talent-toolbar">
			<div class="talent-info">
				<p class="talent-info-stat">Skill points: {{data.classes[data.currentClass].availableSkillPoints}}</p>
				<p class="talent-info-stat">Required level: {{data.classes[data.currentClass].requiredLevel}}</p>
			</div>
			<div class="talent-actions">
				<button class="button" v-on:click="saveTalentTrees()">Save</button>
				<button class="button" v-on:click="resetTalentTrees()">Reset</button>
			</div>
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
			return {
				data: talentData
			}
		},
		mounted(){
			let localData = window.localStorage.getItem('talent-data');
			if(localData != null){
				this.data = JSON.parse(localData);
			}
		},
		watch: {
			currentClass(){
				alert(123);
			},
			deep: true
		},
		methods: {
			resetTalentTrees: function(){
				let currentClass = this.data.classes[this.data.currentClass];
				currentClass.availableSkillPoints = 51;
				currentClass.requiredLevel = 0;
				currentClass.talentTrees.forEach(tree => {
					tree.skillPoints = 0;
					tree.skills.forEach(skill => {
						skill.currentRank = 0;
						if(skill.requirements){
							skill.enabled = false;
						}
					});
				});
			},
			saveTalentTrees: function(){
				window.localStorage.setItem('talent-data', JSON.stringify(this.data));
			},
		}
	}
</script>