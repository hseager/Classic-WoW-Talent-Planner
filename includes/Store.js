import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const builds = {
    namespaced: true,
    state: {
        currentBuildId: null
    },
    mutations: {
        setCurrentBuild (state, payload) {
            state.currentBuildId = payload.buildId;
        }
    },
    actions: {
        loadBuild ({ commit }, build) {
            return new Promise((resolve) => {
                commit('classes/setCurrentClass', build.classId, { root: true });
                commit('classes/setAvailableSkillPoints', build.availableSkillPoints, { root: true });
                commit('classes/setRequiredLevel', build.requiredLevel, { root: true });
                resolve();
            });
        }
    }
};

const classes = {
    namespaced: true,
    state: {
        currentClassId: 0,
        classes: [
            {
                availableSkillPoints: 51,
                requiredLevel: 0
            },
            {
                availableSkillPoints: 51,
                requiredLevel: 0
            },
            {
                availableSkillPoints: 51,
                requiredLevel: 0
            },
            {
                availableSkillPoints: 51,
                requiredLevel: 0
            },
            {
                availableSkillPoints: 51,
                requiredLevel: 0
            },
            {
                availableSkillPoints: 51,
                requiredLevel: 0
            },
            {
                availableSkillPoints: 51,
                requiredLevel: 0
            },
            {
                availableSkillPoints: 51,
                requiredLevel: 0
            },
            {
                availableSkillPoints: 51,
                requiredLevel: 0
            }
        ]
    },
    getters: {
        currentClass: state => {
            return state.classes[state.currentClassId];
        },
        availableSkillPoints: (state, getters) => {
            return getters.currentClass.availableSkillPoints;
        },
        requiredLevel: (state, getters) => {
            return getters.currentClass.requiredLevel;
        }
    },
    mutations: {
        setCurrentClass (state, classId) {
            state.currentClassId = classId;
        },
        setAvailableSkillPoints (state, skillPoints) {
            state.classes[state.currentClassId].availableSkillPoints = skillPoints;
        },
        setRequiredLevel (state, requiredLevel) {
            let currentRequiredLevel = state.classes[state.currentClassId].requiredLevel;
            if (currentRequiredLevel < requiredLevel) {
                if (requiredLevel < 10) {
                    state.classes[state.currentClassId].requiredLevel = 10;
                    return;
                }
            } else {
                if (requiredLevel < 10) {
                    state.classes[state.currentClassId].requiredLevel = 0;
                    return;
                }
            }
            state.classes[state.currentClassId].requiredLevel = requiredLevel;
        }
    }
};

export const store = new Vuex.Store({
    modules: {
        builds,
        classes
    }
});
