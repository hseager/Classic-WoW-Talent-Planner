import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export const store = new Vuex.Store({
	state: {
		currentClassId: 0
	},
	mutations: {
		changeClass(state, classId) {
			state.currentClassId = classId;
		}
	}
});