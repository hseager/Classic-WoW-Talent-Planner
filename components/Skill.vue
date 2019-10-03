<template>
    <div :class="['skill',
    { 'is-enabled': skill.enabled },
        { 'is-max-rank': skill.currentRank == skillData.maxRank },
        { 'is-faded': skill.faded },
        skillRequirementArrow]"
        :style="getGridPosition"
        ref="skill">
        <div class="skill-icon"
            v-on:click.prevent="onIncreaseSkillRank"
            v-on:contextmenu.prevent="onDecreaseSkillRank"
            v-on:mouseenter.prevent="onShowTooltip"
            v-on:mouseleave.prevent="onHideTooltip">
            <img v-bind:src="skillIcon" class="skill-icon-image">
            <button v-if="showTooltip && isMobile() && isValidDecrease" v-on:click.stop="onDecreaseSkillRank" class="skill-mobile-button skill-mobile-button-decrease">-</button>
            <button v-if="showTooltip && isMobile() && isValidDecrease" v-on:click.stop="onIncreaseSkillRank" class="skill-mobile-button skill-mobile-button-increase">+</button>
        </div>
        <span class="skill-rank"
            v-on:click.prevent="onIncreaseSkillRank"
            v-on:contextmenu.prevent="onDecreaseSkillRank"
            v-on:mouseenter.prevent="onShowTooltip"
            v-on:mouseleave.prevent="onHideTooltip">{{skill.currentRank}}/{{skillData.maxRank}}</span>
        <tooltip
            v-bind:skillData="skillData"
            v-bind:showTooltip="showTooltip"
            v-bind:tooltipPosition="tooltipPosition"
            v-bind:isValidDecrease="isValidDecrease"
            v-bind:treeName="tree.name"></tooltip>
    </div>
</template>
<script>
import { config } from '../includes/Config.js';
import tooltip from './Tooltip';
import { mapGetters } from 'vuex';

export default {
    name: 'skill',
    components: {
        tooltip
    },
    props: {
        skillData: Object,
        tree: Object,
        className: String
    },
    data () {
        return {
            showTooltip: false,
            tooltipPosition: {
                'left': '100%'
            }
        };
    },
    mounted () {
        this.$root.$on('highlightSkill', (skillOnTree) => {
            if (skillOnTree === this.skill) {
                this.showTooltip = true;
            } else {
                this.skill.faded = true;
            }
        });
        this.$root.$on('unHighlightSkills', () => {
            if (this.availableSkillPoints === 0) {
                if (this.skill.currentRank === 0) {
                    this.skill.faded = true;
                } else {
                    this.skill.faded = false;
                }
            } else {
                this.skill.faded = false;
            }
            this.showTooltip = false;
        });
    },
    computed: {
        ...mapGetters({
            availableSkillPoints: 'classes/availableSkillPoints',
            requiredLevel: 'classes/requiredLevel',
            getTreeById: 'talentTrees/getTreeById',
            getSkillById: 'skills/getSkillById'
        }),
        skill () {
            return this.getSkillById(this.skillData.id);
        },
        currentTalentTree () {
            return this.getTreeById(this.tree.id);
        },
        currentSkillTier () {
            return this.currentTalentTree.currentSkillTier;
        },
        getGridPosition () {
            if (typeof this.skillData.position !== 'undefined') {
                return {
                    gridRowStart: this.skillData.position[0],
                    gridColumnStart: this.skillData.position[1]
                };
            } else {
                return false;
            }
        },
        skillRequirementArrow () {
            if (this.skillData.requirements && this.skillData.requirements.skill) {
                let requiredSkill = this.getSkill(this.skillData.requirements.skill.id);
                let cssClassName = [];
                let arrowYDistance = this.skillData.position[0] - requiredSkill.position[0];
                let arrowXDistance = this.skillData.position[1] - requiredSkill.position[1];

                if (arrowYDistance === 1) {
                    cssClassName = ['down-arrow'];
                } else if (arrowYDistance === 2) {
                    cssClassName = ['down-arrow', 'medium-arrow'];
                } else if (arrowYDistance === 3) {
                    cssClassName = ['down-arrow', 'large-arrow'];
                }

                if (arrowXDistance === 1) {
                    cssClassName = ['side-arrow'];
                }

                if (arrowYDistance === 1 && arrowXDistance === 1) {
                    cssClassName = ['corner-arrow'];
                }

                return cssClassName;
            } else {
                return false;
            }
        },
        skillIcon () {
            return config.imageDirectory +
                    config.skillIconDirectory +
                    this.className.toLowerCase() + '/' +
                    this.tree.name
                        .replace(' ', '-')
                        .toLowerCase() + '/' +
                    this.getImageFileName(this.skillData.name);
        },
        isValidDecrease () {
            if (this.skill.currentRank === 0) {
                return false;
            }
            if (this.hasAdjacentSkillRequirement()) {
                return false;
            }
            if (this.skillData.position[0] === this.currentSkillTier) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        onIncreaseSkillRank () {
            if (this.skill.enabled && this.availableSkillPoints > 0) {
                if (this.skill.currentRank < this.skillData.maxRank) {
                    this.$store.commit({
                        type: 'skills/setCurrentRank',
                        skillId: this.skill.id,
                        currentRank: this.skill.currentRank + 1
                    });
                    this.$store.commit('classes/setAvailableSkillPoints', this.availableSkillPoints - 1);
                    this.$store.commit('classes/setRequiredLevel', this.requiredLevel + 1);
                    this.$store.commit({
                        type: 'talentTrees/setSkillPoints',
                        treeId: this.tree.id,
                        skillPoints: this.currentTalentTree.skillPoints + 1
                    });
                    this.$store.dispatch({
                        type: 'talentTrees/increaseCurrentSkillTier',
                        treeId: this.tree.id,
                        skillTier: this.skillData.position[0]
                    });
                    this.$store.commit({
                        type: 'classes/addSkillToTalentPath',
                        treeId: this.tree.id,
                        skillId: this.skillData.id,
                        skillIcon: this.skillIcon
                    });
                    this.$store.commit({
                        type: 'builds/setCurrentBuild',
                        buildId: null
                    });
                    this.checkSkillRequirements();
                }
            }
        },
        onDecreaseSkillRank () {
            if (this.isValidDecrease) {
                this.$store.commit({
                    type: 'skills/setCurrentRank',
                    skillId: this.skill.id,
                    currentRank: this.skill.currentRank - 1
                });
                this.$store.commit('classes/setAvailableSkillPoints', this.availableSkillPoints + 1);
                this.$store.commit('classes/setRequiredLevel', this.requiredLevel - 1);
                this.$store.commit({
                    type: 'builds/setCurrentBuild',
                    buildId: null
                });
                this.$store.commit({
                    type: 'talentTrees/setSkillPoints',
                    treeId: this.tree.id,
                    skillPoints: this.currentTalentTree.skillPoints - 1
                });
                this.$store.commit({
                    type: 'classes/removeSkillFromTalentPath',
                    treeId: this.tree.id,
                    skillId: this.skillData.id
                });
                this.$store.dispatch({
                    type: 'talentTrees/decreaseCurrentSkillTier',
                    tree: this.tree,
                    skillTier: this.skillData.position[0]
                });
                this.checkSkillRequirements();
                if (this.skill.currentRank === 0 && this.isMobile()) {
                    this.showTooltip = false;
                }
            }
        },
        checkSkillRequirements () {
            this.tree.skills.forEach((skill) => {
                if (skill.requirements) {
                    let skillStore = this.getSkillById(skill.id);
                    if (skill.requirements.specPoints && skill.requirements.skill) {
                        if (this.currentTalentTree.skillPoints >= skill.requirements.specPoints) {
                            let requiredSkill = this.getSkillById(skill.requirements.skill.id);
                            if (requiredSkill.currentRank === skill.requirements.skill.skillPoints) {
                                skillStore.enabled = true;
                            } else {
                                skillStore.enabled = false;
                            }
                        } else {
                            skillStore.enabled = false;
                        }
                    } else if (skill.requirements.specPoints) {
                        if (this.currentTalentTree.skillPoints >= skill.requirements.specPoints) {
                            skillStore.enabled = true;
                        } else {
                            skillStore.enabled = false;
                        }
                    } else if (skill.requirements.skill) {
                        let requiredSkill = this.getSkillById(skill.requirements.skill.id);
                        if (requiredSkill.currentRank === skill.requirements.skill.skillPoints) {
                            skillStore.enabled = true;
                        } else {
                            skillStore.enabled = false;
                        }
                    }
                }
            });
        },
        getSkill (id) {
            return this.tree.skills.find(skill => { return skill.id === id; });
        },
        hasAdjacentSkillRequirement () {
            let adjacentSkillData = this.getSkill(this.skill.id + 1);
            if (adjacentSkillData && adjacentSkillData.requirements && adjacentSkillData.requirements.skill) {
                const adjacentSkill = this.getSkillById(adjacentSkillData.id);
                return adjacentSkillData.requirements.skill.id === this.skill.id && adjacentSkill.currentRank > 0;
            } else {
                return false;
            }
        },
        onShowTooltip () {
            this.showTooltip = true;
            let positionLeft = this.$refs['skill'].getBoundingClientRect().left;
            let windowWidth = window.innerWidth;
            let distanceFromRightOfScreen = windowWidth - positionLeft;
            let tooltipWidth = 360;
            if (this.isMobile()) {
                this.tooltipPosition = { 'left': -positionLeft + (windowWidth - tooltipWidth) / 2 + 'px' };
            } else {
                if (distanceFromRightOfScreen < (tooltipWidth + 80)) {
                    this.tooltipPosition = { 'left': 'initial', 'right': '100%' };
                } else {
                    this.tooltipPosition = { 'left': 100 + '%' };
                }
            }
        },
        onHideTooltip () {
            this.showTooltip = false;
        }
    }
};
</script>
