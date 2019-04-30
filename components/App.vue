<template>
	<div>
		<img src="../public/images/wow-classic-logo.png" class="logo" />
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
			<p>Skill points: {{classes[currentClass].availableSkillPoints}}</p>
			<p>Required level: {{classes[currentClass].requiredLevel}}</p>
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
			return talentData
		} 
	}
</script>