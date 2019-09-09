import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		currentClassId: 0,
		currentBuildId: null,
		classes: [
			{
				availableSkillPoints: 51,
				requiredLevel: 0,
			},
			{
				availableSkillPoints: 51,
				requiredLevel: 0,
			},
			{
				availableSkillPoints: 51,
				requiredLevel: 0,
			},
			{
				availableSkillPoints: 51,
				requiredLevel: 0,
			},
			{
				availableSkillPoints: 51,
				requiredLevel: 0,
			},
			{
				availableSkillPoints: 51,
				requiredLevel: 0,
			},
			{
				availableSkillPoints: 51,
				requiredLevel: 0,
			},
			{
				availableSkillPoints: 51,
				requiredLevel: 0,
			},
			{
				availableSkillPoints: 51,
				requiredLevel: 0,
			}
		]
	},
	mutations: {
		setCurrentClass(state, classId){
			state.currentClassId = classId;
		},
		setCurrentBuild(state, payload){
			state.currentBuildId = payload.buildId;
		},
		setAvailableSkillPoints(state, skillPoints){
			state.classes[state.currentClassId].availableSkillPoints = skillPoints;
		}
	}
});