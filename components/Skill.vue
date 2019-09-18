<template>
    <div :class="['skill',
    { 'is-enabled': skill.enabled },
        { 'is-max-rank': skill.currentRank == skill.maxRank },
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
            v-on:mouseleave.prevent="onHideTooltip">{{skill.currentRank}}/{{skill.maxRank}}</span>
        <tooltip
            v-bind:skill="skill"
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
        skill: Object,
        tree: Object,
        className: String,
        currentSkillTier: Number
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
            getTreeById: 'talentTrees/getTreeById'
        }),
        currentTalentTree () {
            return this.getTreeById(this.tree.id);
        },
        getGridPosition () {
            if (typeof this.skill.position !== 'undefined') {
                return {
                    gridRowStart: this.skill.position[0],
                    gridColumnStart: this.skill.position[1]
                };
            } else {
                return false;
            }
        },
        skillRequirementArrow () {
            if (this.skill.requirements && this.skill.requirements.skill) {
                let requiredSkill = this.getSkill(this.skill.requirements.skill.id);
                let cssClassName = [];
                let arrowYDistance = this.skill.position[0] - requiredSkill.position[0];
                let arrowXDistance = this.skill.position[1] - requiredSkill.position[1];

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
                    this.getImageFileName(this.skill.name);
        },
        isValidDecrease () {
            if (this.skill.currentRank === 0) {
                return false;
            }

            if (this.hasAdjacentSkillRequirement()) {
                return false;
            }

            if (this.skill.position[0] === this.currentSkillTier) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        onIncreaseSkillRank () {
            if (this.skill.enabled && this.availableSkillPoints > 0) {
                if (this.skill.currentRank < this.skill.maxRank) {
                    this.skill.currentRank++;
                    this.$store.commit('classes/setAvailableSkillPoints', this.availableSkillPoints - 1);
                    this.$store.commit('classes/setRequiredLevel', this.requiredLevel + 1);
                    this.$store.commit({
                        type: 'builds/setCurrentBuild',
                        buildId: null
                    });
                    this.$store.commit({
                        type: 'talentTrees/setSkillPoints',
                        treeId: this.tree.id,
                        skillPoints: this.currentTalentTree.skillPoints + 1
                    });
                    this.$parent.$emit('addToTalentPath', this.tree.id, this.skill.id, this.skillIcon);
                    this.$emit('increaseCurrentSkillTier', this.skill.position[0]);
                    this.checkSkillRequirements();
                }
            }
        },
        onDecreaseSkillRank () {
            if (this.isValidDecrease) {
                this.skill.currentRank--;
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
                this.$parent.$emit('removeSkillFromTalentPath', this.tree.id, this.skill.id);
                this.$emit('decreaseCurrentSkillTier', this.skill.position[0]);
                this.checkSkillRequirements();
                if (this.skill.currentRank === 0 && this.isMobile()) {
                    this.showTooltip = false;
                }
            }
        },
        checkSkillRequirements () {
            this.tree.skills.forEach((skill) => {
                if (skill.requirements) {
                    if (skill.requirements.specPoints && skill.requirements.skill) {
                        if (this.currentTalentTree.skillPoints >= skill.requirements.specPoints) {
                            let requiredSkill = this.getSkill(skill.requirements.skill.id);
                            if (requiredSkill.currentRank === skill.requirements.skill.skillPoints) {
                                skill.enabled = true;
                            } else {
                                skill.enabled = false;
                            }
                        } else {
                            skill.enabled = false;
                        }
                    } else if (skill.requirements.specPoints) {
                        if (this.currentTalentTree.skillPoints >= skill.requirements.specPoints) {
                            skill.enabled = true;
                        } else {
                            skill.enabled = false;
                        }
                    } else if (skill.requirements.skill) {
                        let requiredSkill = this.getSkill(skill.requirements.skill.id);
                        if (requiredSkill.currentRank === skill.requirements.skill.skillPoints) {
                            skill.enabled = true;
                        } else {
                            skill.enabled = false;
                        }
                    }
                }
            });
        },
        getSkill (id) {
            return this.tree.skills[id];
        },
        hasAdjacentSkillRequirement () {
            let adjacentSkill = this.getSkill(this.skill.id + 1);
            if (adjacentSkill && adjacentSkill.requirements && adjacentSkill.requirements.skill) {
                return adjacentSkill.requirements.skill.id === this.skill.id && adjacentSkill.currentRank > 0;
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
