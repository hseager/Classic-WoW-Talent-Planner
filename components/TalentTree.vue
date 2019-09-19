<template>
    <div class="talent-tree-panel">
        <h3 class="talent-tree-title">{{tree.name}} <span class="talent-tree-points">({{currentTalentTree.skillPoints}})</span></h3>
        <div class="talent-tree" :style="getTreeBackgroundImage">
            <skill
                v-for="skill in tree.skills"
                v-bind:skill="skill"
                v-bind:key="skill.id"
                v-bind:tree="tree"
                v-bind:className="className">
            </skill>
        </div>
        <span class="talent-tree-reset" v-on:click="resetTalentTree">Reset</span>
    </div>
</template>
<script>
import { config } from '../includes/Config.js';
import { mapGetters } from 'vuex';
import skill from './Skill';

export default {
    name: 'talent-tree',
    props: {
        className: String,
        tree: Object
    },
    components: {
        skill
    },
    computed: {
        ...mapGetters({
            availableSkillPoints: 'classes/availableSkillPoints',
            requiredLevel: 'classes/requiredLevel',
            getTreeById: 'talentTrees/getTreeById'
        }),
        getTreeBackgroundImage () {
            let backgroundImageUrl = config.imageDirectory +
                                        config.backgroundDirectory + 'background-' +
                                        this.className.toLowerCase() + '-' +
                                        this.getImageFileName(this.tree.name);
            return {
                backgroundImage: `url('${backgroundImageUrl}')`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            };
        },
        currentTalentTree () {
            return this.getTreeById(this.tree.id);
        }
    },
    methods: {
        resetTalentTree () {
            if (this.currentTalentTree.skillPoints > 0) {
                this.$store.commit('classes/setAvailableSkillPoints', this.availableSkillPoints + this.currentTalentTree.skillPoints);
                this.$store.commit('classes/setRequiredLevel', this.requiredLevel - this.currentTalentTree.skillPoints);
                this.$store.commit({
                    type: 'talentTrees/setSkillPoints',
                    treeId: this.tree.id,
                    skillPoints: 0
                });
                this.$store.commit({
                    type: 'talentTrees/setCurrentSkillTier',
                    treeId: this.tree.id,
                    currentSkillTier: 0
                });
                this.$store.commit({
                    type: 'classes/removeTreeFromTalentPath',
                    treeId: this.tree.id
                });
                this.$store.commit({
                    type: 'builds/setCurrentBuild',
                    buildId: null
                });
                this.tree.skills.forEach((skill) => {
                    skill.currentRank = 0;
                    if (skill.requirements) {
                        skill.enabled = false;
                    }
                });
            }
        }
    }
};
</script>
