<template>
	<div v-if="showTooltip && !skill.faded" :class="['tooltip']" :style="tooltipPosition">
		<h3 class="tooltip-skill-name">{{skill.name}}</h3>
		<p class="tooltip-rank-description" v-html="getSkillDescription(skill.currentRank - 1)"></p>
		<div v-if="this.skill.requirements && !this.skill.enabled">
			<p class="tooltip-requirement" v-if="skill.requirements.skill">Requires {{skill.requirements.skill.skillPoints}} points in {{ requiredSkillName }} </p>
			<p class="tooltip-requirement" v-if="skill.requirements.specPoints">Requires {{skill.requirements.specPoints}} points in {{treeName}} talents</p>
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
	export default {
		name: 'tooltip',
		props: {
			skill: Object,
			showTooltip: Boolean,
			tooltipPosition: Object,
			treeName: String,
			isValidDecrease: Boolean,
			requiredLevel: Number,
		},
		computed: {
			hasNextRank: function(){
				return this.skill.currentRank > 0 && this.skill.currentRank != this.skill.maxRank
			},
			requiredSkillName: function(){
				return this.$parent.getSkill(this.skill.requirements.skill.id).name;
			},
		},
		methods: {
			getSkillDescription: function(rank){
				if(this.skill.name == "Serrated Blades"){
					return this.calculateSerratedBladesData(rank);
				} else {
					return this.skill.rankDescription[rank];
				}
			},
			calculateSerratedBladesData: function(rank){
				let armorTimesValue = this.skill.rankData[rank];
				let armorValue = Math.ceil(armorTimesValue * (this.requiredLevel == 0 ? 10 : this.requiredLevel));
				if(this.skill.rankDescription[rank])
					return this.skill.rankDescription[rank].replace('{value}', armorValue);
			}
		}
	}
</script>