<template>
    <div :class="['talent-trees', { 'is-max-level' : this.requiredLevel == 60 }]">
        <talent-tree
            v-for="tree in currentClassData.talentTrees"
            v-bind:tree="tree"
            v-bind:key="tree.id"
            v-bind:className="currentClassData.name"
            v-on:addToTalentPath="onAddToTalentPath"
            v-on:removeSkillFromTalentPath="onRemoveSkillFromTalentPath"
            v-on:removeTreeFromTalentPath="onRemoveTreeFromTalentPath"
        ></talent-tree>
    </div>
</template>
<script>
import talentTree from './TalentTree';
import { mapGetters } from 'vuex';

export default {
    name: 'class-panel',
    props: {
        currentClassData: Object
    },
    components: {
        talentTree
    },
    computed: {
        ...mapGetters({
            requiredLevel: 'classes/requiredLevel'
        })
    },
    methods: {
        onAddToTalentPath (treeId, skillId, skillIcon) {
            this.currentClassData.talentPath.push({ treeId, skillId, skillIcon, faded: false });
        },
        onRemoveSkillFromTalentPath (treeId, skillId) {
            let talentPathItemIndex = '';
            this.currentClassData.talentPath.forEach((talentPathItem, i) => {
                if (talentPathItem.treeId === treeId && talentPathItem.skillId === skillId) {
                    talentPathItemIndex = i;
                }
            });
            if (typeof talentPathItemIndex === 'number') {
                this.currentClassData.talentPath.splice(talentPathItemIndex, 1);
            }
        },
        onRemoveTreeFromTalentPath (treeId) {
            this.currentClassData.talentPath.forEach((talentPathItem, i) => {
                if (talentPathItem.treeId === treeId) {
                    this.currentClassData.talentPath.splice(i, 1);
                }
            });
        },
        checkMaxLevel () {
            if (this.requiredLevel === 60) {
                this.currentClassData.talentTrees.forEach(tree => {
                    tree.skills.forEach(skill => {
                        if (skill.currentRank === 0) {
                            skill.faded = true;
                        }
                    });
                });
            } else if (this.requiredLevel === 59) {
                this.currentClassData.talentTrees.forEach(tree => {
                    tree.skills.forEach(skill => {
                        skill.faded = false;
                    });
                });
            }
        }
    }
};
</script>
