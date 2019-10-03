<template>
    <div v-if="showTooltip && !skill.faded" :class="['tooltip']" :style="tooltipPosition">
        <h3 class="tooltip-skill-name">{{skillData.name}}</h3>
        <p class="tooltip-rank-description" v-html="getSkillDescription(skill.currentRank - 1)"></p>
        <div v-if="this.skillData.requirements && !this.skill.enabled">
            <p class="tooltip-requirement" v-if="skillData.requirements.skill">Requires {{skillData.requirements.skill.skillPoints}} points in {{ requiredSkillName }}</p>
            <p class="tooltip-requirement" v-if="skillData.requirements.specPoints">Requires {{skillData.requirements.specPoints}} points in {{treeName}} talents</p>
        </div>
        <div v-if="hasNextRank">
            <p class="tooltip-next-rank">Next rank:</p>
        </div>
        <p class="tooltip-rank-description" v-html="getSkillDescription(skill.currentRank)"></p>
        <div v-if="isValidDecrease">
            <p v-if="!isMobile()" class="tooltip-mobile-message">Right click talent to remove</p>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    name: 'tooltip',
    props: {
        skillData: Object,
        showTooltip: Boolean,
        tooltipPosition: Object,
        treeName: String,
        isValidDecrease: Boolean
    },
    computed: {
        ...mapGetters({
            requiredLevel: 'classes/requiredLevel',
            getSkillById: 'skills/getSkillById'
        }),
        hasNextRank () {
            return this.skill.currentRank > 0 && this.skill.currentRank !== this.skillData.maxRank;
        },
        requiredSkillName () {
            return this.$parent.getSkill(this.skillData.requirements.skill.id).name;
        },
        skill () {
            return this.getSkillById(this.skillData.id);
        }
    },
    methods: {
        getSkillDescription (rank) {
            if (this.skillData.name === 'Serrated Blades') {
                return this.calculateSerratedBladesValues(rank);
            } else {
                return this.skillData.rankDescription[rank];
            }
        },
        calculateSerratedBladesValues (rank) {
            let armorTimesValue = this.skillData.rankData[rank];
            let armorValue = Math.ceil(armorTimesValue * (this.requiredLevel === 0 ? 10 : this.requiredLevel));
            if (this.skillData.rankDescription[rank]) {
                return this.skillData.rankDescription[rank].replace('{value}', armorValue);
            }
        }
    }
};
</script>
