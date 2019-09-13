<template>
    <div class="talent-tree-panel">
        <h3 class="talent-tree-title">{{tree.name}} <span class="talent-tree-points">({{tree.skillPoints}})</span></h3>
        <div class="talent-tree" :style="getTreeBackgroundImage">
            <skill
                v-for="skill in tree.skills"
                v-bind:skill="skill"
                v-bind:key="skill.id"
                v-bind:tree="tree"
                v-bind:className="className"
                v-bind:currentSkillTier="tree.currentSkillTier"
                v-on:increaseTreeSkillPoints="onIncreaseTreeSkillPoints"
                v-on:decreaseTreeSkillPoints="onDecreaseTreeSkillPoints"
                v-on:increaseCurrentSkillTier="onIncreaseCurrentSkillTier"
                v-on:decreaseCurrentSkillTier="onDecreaseCurrentSkillTier">
            </skill>
        </div>
        <span class="talent-tree-reset" v-on:click="resetTalentTree">Reset</span>
    </div>
</template>
<script>
import { config } from '../includes/Config.js';
import skill from './Skill';
import { mapGetters } from 'vuex';

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
        ...mapGetters([
            'availableSkillPoints',
            'requiredLevel'
        ])
    },
    methods: {
        onIncreaseTreeSkillPoints () {
            this.tree.skillPoints++;
        },
        onDecreaseTreeSkillPoints () {
            this.tree.skillPoints--;
        },
        onIncreaseCurrentSkillTier (tier) {
            if (tier > this.tree.currentSkillTier) {
                this.tree.currentSkillTier = tier;
            }
        },
        onDecreaseCurrentSkillTier (tier) {
            let totalTierSkillPoints = this.getTotalTierSkillPoints(tier);
            if (totalTierSkillPoints === 0) {
                this.tree.currentSkillTier = tier - 1;
            }
        },
        getTotalTierSkillPoints (tier) {
            let tierSkillPoints = 0;
            this.tree.skills.forEach((skill) => {
                if (skill.position[0] === tier) {
                    tierSkillPoints = tierSkillPoints + skill.currentRank;
                }
            });
            return tierSkillPoints;
        },
        resetTalentTree () {
            if (this.tree.skillPoints > 0) {
                this.$store.commit('setAvailableSkillPoints', this.availableSkillPoints + this.tree.skillPoints);
                this.$store.commit('setRequiredLevel', this.requiredLevel - this.tree.skillPoints);
                this.$store.commit({
                    type: 'setCurrentBuild',
                    buildId: null
                });
                this.tree.skillPoints = 0;
                this.tree.currentSkillTier = 0;
                this.tree.skills.forEach((skill) => {
                    skill.currentRank = 0;
                    if (skill.requirements) {
                        skill.enabled = false;
                    }
                    this.$emit('removeTreeFromTalentPath', this.tree.id);
                });
            }
        }
    }
};
</script>
