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
                commit('classes/setTalentPath', build.talentPath, { root: true });
                build.talentTrees.forEach(tree => {
                    commit('talentTrees/setSkillPoints', { treeId: tree.id, skillPoints: tree.skillPoints }, { root: true });
                });
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
                id: 0,
                availableSkillPoints: 51,
                requiredLevel: 0,
                talentPath: []
            },
            {
                id: 1,
                availableSkillPoints: 51,
                requiredLevel: 0,
                talentPath: []
            },
            {
                id: 2,
                availableSkillPoints: 51,
                requiredLevel: 0,
                talentPath: []
            },
            {
                id: 3,
                availableSkillPoints: 51,
                requiredLevel: 0,
                talentPath: []
            },
            {
                id: 4,
                availableSkillPoints: 51,
                requiredLevel: 0,
                talentPath: []
            },
            {
                id: 5,
                availableSkillPoints: 51,
                requiredLevel: 0,
                talentPath: []
            },
            {
                id: 6,
                availableSkillPoints: 51,
                requiredLevel: 0,
                talentPath: []
            },
            {
                id: 7,
                availableSkillPoints: 51,
                requiredLevel: 0,
                talentPath: []
            },
            {
                id: 8,
                availableSkillPoints: 51,
                requiredLevel: 0,
                talentPath: []
            }
        ]
    },
    getters: {
        currentClass: state => {
            return state.classes.find(classType => classType.id === state.currentClassId);
        },
        availableSkillPoints: (state, getters) => {
            return getters.currentClass.availableSkillPoints;
        },
        requiredLevel: (state, getters) => {
            return getters.currentClass.requiredLevel;
        },
        talentPath: (state, getters) => {
            return getters.currentClass.talentPath;
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
        },
        setTalentPath (state, talentPath) {
            state.classes[state.currentClassId].talentPath = talentPath;
        },
        addSkillToTalentPath (state, payload) {
            state.classes[state.currentClassId].talentPath.push({
                treeId: payload.treeId,
                skillId: payload.skillId,
                skillIcon: payload.skillIcon,
                faded: false
            });
        },
        removeSkillFromTalentPath (state, payload) {
            let skillIndex = state.classes[state.currentClassId].talentPath.findIndex((talentPathItem) => {
                return talentPathItem.treeId === payload.treeId && talentPathItem.skillId === payload.skillId;
            });
            if (skillIndex > -1) {
                state.classes[state.currentClassId].talentPath.splice(skillIndex, 1);
            }
        },
        removeTreeFromTalentPath (state, payload) {
            state.classes[state.currentClassId].talentPath = state.classes[state.currentClassId].talentPath.filter((talentPathItem) => {
                return talentPathItem.treeId !== payload.treeId;
            });
        }
    }
};

const talentTrees = {
    namespaced: true,
    state: {
        talentTrees: [
            {
                id: 0,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 1,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 2,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 3,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 4,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 5,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 6,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 7,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 8,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 9,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 10,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 11,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 12,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 13,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 14,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 15,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 16,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 17,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 18,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 19,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 20,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 21,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 22,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 23,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 24,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 25,
                skillPoints: 0,
                currentSkillTier: 0
            },
            {
                id: 26,
                skillPoints: 0,
                currentSkillTier: 0
            }
        ]
    },
    getters: {
        getTreeById: (state) => (treeId) => {
            return state.talentTrees.find(tree => tree.id === treeId);
        }
    },
    mutations: {
        setSkillPoints (state, payload) {
            const tree = state.talentTrees.find(tree => tree.id === payload.treeId);
            tree.skillPoints = payload.skillPoints;
        }
    }
};

export const store = new Vuex.Store({
    modules: {
        builds,
        classes,
        talentTrees
    }
});
