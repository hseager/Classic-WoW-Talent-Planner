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
				v-bind:currentClass="currentClassData"
			></class-panel>
			<talent-path
				v-bind:currentClass="currentClassData"
			></talent-path>
			<build-controls
				v-bind:currentClass="currentClassData"
			></build-controls>
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
	import buildControls from './BuildControls';
	import { mapGetters } from 'vuex';
	import { mapState } from 'vuex';

	export default {
		components: {
			classList,
			classPanel,
			talentPath,
			buildControls
		},
		data(){
			return {
				data: talentData
			}
		},
		computed: {
			currentClassData(){
				return this.data.classes[this.currentClassId];
			},
			...mapGetters([
				'availableSkillPoints',
				'requiredLevel'
			]),
			...mapState({
				currentClassId: state => state.currentClassId
			}),
		}
	}
</script>