<template>
	<div>
		<main>
			<img src="../public/images/wow-classic-logo.png" class="logo" />
			<h1 class="main-title">Talent Planner</h1>
			<class-list
				v-bind:classes="data.classes"
			></class-list>
			<div class="talent-toolbar">
				<div class="talent-info">
					<p class="talent-info-stat">Skill points: {{availableSkillPoints}}</p>
					<p class="talent-info-stat">Required level: {{requiredLevel}}</p>
				</div>
			</div>
			<class-panel
				v-bind:currentClass="currentClass"
			></class-panel>
			<talent-path
				v-bind:currentClass="currentClass"
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
			let localData = window.localStorage.getItem('talent-data-1');
			if(localData != null){
				this.data = JSON.parse(localData);
			}
		},
		computed: {
			currentClass(){
				return this.data.classes[this.$store.state.currentClassId];
			},
			availableSkillPoints(){
				return this.currentClass.availableSkillPoints;
			},
			requiredLevel(){
				return this.currentClass.requiredLevel;
			},
		},
		methods: {
			saveTalentTrees(){
				window.localStorage.setItem('talent-data-1', JSON.stringify(this.data));
			}
		}
	}
</script>