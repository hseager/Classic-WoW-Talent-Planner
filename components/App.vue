<template>
	<div>
		<main>
			<img src="../public/images/wow-classic-logo.png" class="logo" />
			<h1 class="main-title">Talent Planner</h1>
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
			<div class="talent-toolbar">
				<div class="talent-info">
					<p class="talent-info-stat">Skill points: {{data.classes[data.currentClass].availableSkillPoints}}</p>
					<p class="talent-info-stat">Required level: {{data.classes[data.currentClass].requiredLevel}}</p>
				</div>
			</div>
			<class-panel
				v-bind:class-type="data.classes[data.currentClass]"
				v-bind:constants="data.constants"
			></class-panel>
			<talent-path
				v-bind:currentClass="data.classes[data.currentClass]"
			></talent-path>
			<div class="talent-actions">
				<button class="button" v-on:click="saveTalentTrees">Save</button>
			</div>
		</main>
		<footer>
			<ul>
				<li><a href="https://github.com/hseager/Classic-WoW-Talent-Planner" target="_blank"><img src="images/github-logo.png" /></a></li>
			</ul>
		</footer>
	</div>
</template>
<script>
	import talentData from '../assets/data/talent-data.json';
	import classList from './ClassList';
	import classPanel from './ClassPanel';
	import talentPath from './TalentPath';

	export default {
		components: {
			classList,
			classPanel,
			talentPath
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
		methods: {
			saveTalentTrees: function(){
				window.localStorage.setItem('talent-data', JSON.stringify(this.data));
			},
		}
	}
</script>