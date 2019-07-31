<template>
  <div :class="['talent-trees', { 'is-max-level' : this.classType.requiredLevel == 60 }]">
    <talent-tree
      v-for="tree in classType.talentTrees"
      v-bind:tree="tree"
      v-bind:key="tree.id"
      v-bind:className="classType.name"
      v-bind:constants="constants"
      v-bind:availableSkillPoints="classType.availableSkillPoints"
      v-bind:requiredLevel="classType.requiredLevel"
      v-on:decreaseAvailableSkillPoints="decreaseAvailableSkillPoints"
      v-on:increaseAvailableSkillPoints="increaseAvailableSkillPoints"
      v-on:decreaseRequiredLevel="decreaseRequiredLevel"
      v-on:increaseRequiredLevel="increaseRequiredLevel"
      v-on:addToTalentPath="onAddToTalentPath"
      v-on:removeSkillFromTalentPath="onRemoveSkillFromTalentPath"
      v-on:removeTreeFromTalentPath="onRemoveTreeFromTalentPath"
    ></talent-tree>
  </div>
</template>
<script>
import talentTree from "./TalentTree";

export default {
  name: "class-panel",
  props: {
    classType: Object,
    constants: Object
  },
  components: {
    talentTree
  },
  methods: {
    decreaseAvailableSkillPoints: function() {
      this.classType.availableSkillPoints--;
    },
    increaseAvailableSkillPoints: function(points) {
      this.classType.availableSkillPoints =
        this.classType.availableSkillPoints + points;
    },
    increaseRequiredLevel: function() {
      if (this.classType.requiredLevel == 0) this.classType.requiredLevel = 10;
      else this.classType.requiredLevel++;

      this.checkMaxLevel();
    },
    decreaseRequiredLevel: function(points) {
      this.classType.requiredLevel = this.classType.requiredLevel - points;
      if (this.classType.requiredLevel < 10) this.classType.requiredLevel = 0;

      this.checkMaxLevel();
    },
    onAddToTalentPath: function(treeId, skillId, skillIcon) {
      this.classType.talentPath.push({
        treeId,
        skillId,
        skillIcon,
        faded: false
      });
    },
    onRemoveSkillFromTalentPath: function(treeId, skillId) {
      let talentPathItemIndex = "";
      this.classType.talentPath.forEach((talentPathItem, i) => {
        if (
          talentPathItem.treeId == treeId &&
          talentPathItem.skillId == skillId
        ) {
          talentPathItemIndex = i;
        }
      });
      if (typeof talentPathItemIndex == "number") {
        this.classType.talentPath.splice(talentPathItemIndex, 1);
      }
    },
    onRemoveTreeFromTalentPath: function(treeId) {
      this.classType.talentPath.forEach((talentPathItem, i) => {
        if (talentPathItem.treeId == treeId) {
          this.classType.talentPath.splice(i, 1);
        }
      });
    },
    checkMaxLevel: function() {
      if (this.classType.requiredLevel == 60) {
        this.classType.talentTrees.forEach(tree => {
          tree.skills.forEach(skill => {
            if (skill.currentRank == 0) {
              skill.faded = true;
            }
          });
        });
      } else if (this.classType.requiredLevel == 59) {
        this.classType.talentTrees.forEach(tree => {
          tree.skills.forEach(skill => {
            skill.faded = false;
          });
        });
      }
    }
  }
};
</script>