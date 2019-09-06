import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		currentClassId: 0,
		currentBuildId: 0,
	},
	mutations: {
		changeClass(state, payload) {
			state.currentClassId = payload.classId;
		},
		changeBuild(state, payload){
			state.currentBuildId = payload.buildId;
		}
	}
});