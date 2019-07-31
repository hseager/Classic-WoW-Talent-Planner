<template>
  <div
    :class="['skill', 
		{ 'is-enabled': skill.enabled }, 
		{ 'is-max-rank': skill.currentRank == skill.maxRank }, 
		{ 'is-faded': skill.faded },
		skillRequirementArrow]"
    :style="getGridPosition"
    ref="skill"
  >
    <div
      class="skill-icon"
      v-on:click.prevent="onIncreaseSkillRank"
      v-on:contextmenu.prevent="onDecreaseSkillRank"
      v-on:mouseenter.prevent="onShowTooltip"
      v-on:mouseleave.prevent="onHideTooltip"
    >
      <img v-bind:src="skillIcon" class="skill-icon-image" />
      <button
        v-if="showTooltip && isMobile() && isValidDecrease"
        v-on:click.stop="onDecreaseSkillRank"
        class="skill-mobile-button skill-mobile-button-decrease"
      >-</button>
      <button
        v-if="showTooltip && isMobile() && isValidDecrease"
        v-on:click.stop="onIncreaseSkillRank"
        class="skill-mobile-button skill-mobile-button-increase"
      >+</button>
    </div>
    <span
      class="skill-rank"
      v-on:click.prevent="onIncreaseSkillRank"
      v-on:contextmenu.prevent="onDecreaseSkillRank"
      v-on:mouseenter.prevent="onShowTooltip"
      v-on:mouseleave.prevent="onHideTooltip"
    >{{skill.currentRank}}/{{skill.maxRank}}</span>
    <tooltip
      v-bind:skill="skill"
      v-bind:showTooltip="showTooltip"
      v-bind:tooltipPosition="tooltipPosition"
      v-bind:isValidDecrease="isValidDecrease"
      v-bind:treeName="tree.name"
      v-bind:requiredLevel="requiredLevel"
    ></tooltip>
  </div>
</template>
<script>
import tooltip from "./Tooltip";
export default {
  name: "skill",
  props: {
    constants: Object,
    skill: Object,
    tree: Object,
    className: String,
    currentSkillTier: Number,
    availableSkillPoints: Number,
    requiredLevel: Number
  },
  data: function() {
    return {
      showTooltip: false,
      tooltipPosition: {
        left: "100%"
      }
    };
  },
  components: {
    tooltip
  },
  mounted: function() {
    this.$root.$on("highlightSkill", skillOnTree => {
      if (skillOnTree == this.skill) {
        this.showTooltip = true;
      } else {
        this.skill.faded = true;
      }
    });
    this.$root.$on("unHighlightSkills", () => {
      if (this.availableSkillPoints == 0) {
        if (this.skill.currentRank == 0) {
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
    getGridPosition: function() {
      if (typeof this.skill.position !== "undefined") {
        return {
          gridRowStart: this.skill.position[0],
          gridColumnStart: this.skill.position[1]
        };
      }
    },
    skillRequirementArrow: function() {
      if (this.skill.requirements && this.skill.requirements.skill) {
        let requiredSkill = this.getSkill(this.skill.requirements.skill.id),
          cssClassName = [],
          arrowYDistance = this.skill.position[0] - requiredSkill.position[0],
          arrowXDistance = this.skill.position[1] - requiredSkill.position[1];

        if (arrowYDistance == 1) {
          cssClassName = ["down-arrow"];
        } else if (arrowYDistance == 2) {
          cssClassName = ["down-arrow", "medium-arrow"];
        } else if (arrowYDistance == 3) {
          cssClassName = ["down-arrow", "large-arrow"];
        }

        if (arrowXDistance == 1) {
          cssClassName = ["side-arrow"];
        }

        if (arrowYDistance == 1 && arrowXDistance == 1) {
          cssClassName = ["corner-arrow"];
        }

        return cssClassName;
      }
    },
    skillIcon: function() {
      return (
        this.constants.imageDirectory +
        this.constants.skillIconDirectory +
        this.className.toLowerCase() +
        "/" +
        this.tree.name.replace(" ", "-").toLowerCase() +
        "/" +
        this.getImageFileName(this.skill.name)
      );
    },
    isValidDecrease: function() {
      if (this.skill.currentRank == 0) return false;

      if (this.hasAdjacentSkillRequirement()) return false;

      if (this.skill.position[0] == this.currentSkillTier) return true;
      else return false;
    }
  },
  methods: {
    onIncreaseSkillRank: function() {
      if (this.skill.enabled && this.availableSkillPoints > 0) {
        if (this.skill.currentRank < this.skill.maxRank) {
          this.skill.currentRank++;
          this.$parent.$emit("decreaseAvailableSkillPoints");
          this.$parent.$emit("increaseRequiredLevel");
          this.$parent.$emit(
            "addToTalentPath",
            this.tree.id,
            this.skill.id,
            this.skillIcon
          );
          this.$emit("increaseTreeSkillPoints");
          this.$emit("increaseCurrentSkillTier", this.skill.position[0]);
          this.checkSkillRequirements();
        }
      }
    },
    onDecreaseSkillRank: function() {
      if (this.isValidDecrease) {
        this.skill.currentRank--;
        this.$parent.$emit("increaseAvailableSkillPoints", 1);
        this.$parent.$emit("decreaseRequiredLevel", 1);
        this.$parent.$emit(
          "removeSkillFromTalentPath",
          this.tree.id,
          this.skill.id
        );
        this.$emit("decreaseTreeSkillPoints");
        this.$emit("decreaseCurrentSkillTier", this.skill.position[0]);
        this.checkSkillRequirements();

        if (this.skill.currentRank == 0 && this.isMobile()) {
          this.showTooltip = false;
        }
      }
    },
    checkSkillRequirements: function() {
      this.tree.skills.forEach(skill => {
        if (skill.requirements) {
          if (skill.requirements.specPoints && skill.requirements.skill) {
            if (this.tree.skillPoints >= skill.requirements.specPoints) {
              let requiredSkill = this.getSkill(skill.requirements.skill.id);
              if (
                requiredSkill.currentRank ==
                skill.requirements.skill.skillPoints
              ) {
                skill.enabled = true;
              } else {
                skill.enabled = false;
              }
            } else {
              skill.enabled = false;
            }
          } else if (skill.requirements.specPoints) {
            if (this.tree.skillPoints >= skill.requirements.specPoints) {
              skill.enabled = true;
            } else {
              skill.enabled = false;
            }
          } else if (skill.requirements.skill) {
            let requiredSkill = this.getSkill(skill.requirements.skill.id);
            if (
              requiredSkill.currentRank == skill.requirements.skill.skillPoints
            ) {
              skill.enabled = true;
            } else {
              skill.enabled = false;
            }
          }
        }
      });
    },
    getSkill: function(id) {
      return this.tree.skills[id];
    },
    hasAdjacentSkillRequirement: function() {
      let adjacentSkill = this.getSkill(this.skill.id + 1);
      if (
        adjacentSkill &&
        adjacentSkill.requirements &&
        adjacentSkill.requirements.skill
      ) {
        return (
          adjacentSkill.requirements.skill.id == this.skill.id &&
          adjacentSkill.currentRank > 0
        );
      } else {
        return false;
      }
    },
    onShowTooltip: function() {
      this.showTooltip = true;
      let positionLeft = this.$refs["skill"].getBoundingClientRect().left;
      let windowWidth = window.innerWidth;
      let distanceFromRightOfScreen = windowWidth - positionLeft;
      let tooltipWidth = 360;
      if (this.isMobile()) {
        this.tooltipPosition = {
          left: -positionLeft + (windowWidth - tooltipWidth) / 2 + "px"
        };
      } else {
        if (distanceFromRightOfScreen < tooltipWidth + 80) {
          this.tooltipPosition = { left: "initial", right: "100%" };
        } else {
          this.tooltipPosition = { left: 100 + "%" };
        }
      }
    },
    onHideTooltip: function() {
      this.showTooltip = false;
    }
  }
};
</script>