<template>
    <div class="talent-path">
        <div :class="['talent-path-skill',
            { 'is-faded': talent.faded }]"
            v-for="(talent, index) in currentClassData.talentPath" :key="index"
            v-on:mouseenter.prevent="onTalentPathItemMouseEnter(talent);"
            v-on:mouseleave.prevent="onTalentPathItemMouseLeave">
            <p class="talent-path-level">{{index + 10}}</p>
            <img :src="talent.skillIcon" class="talent-path-skill-icon"/>
        </div>
    </div>
</template>
<script>
export default {
    name: 'talent-path',
    props: {
        currentClassData: Object
    },
    methods: {
        onTalentPathItemMouseEnter (talent) {
            let skillOnTree;
            this.currentClassData.talentTrees.forEach(tree => {
                if (tree.id === talent.treeId) {
                    tree.skills.forEach(skill => {
                        if (skill.id === talent.skillId) {
                            skillOnTree = skill;
                        }
                    });
                }
            });
            this.$root.$emit('highlightSkill', skillOnTree);
            this.currentClassData.talentPath.forEach(talentPathItem => {
                talentPathItem.faded = true;
            });
            talent.faded = false;
        },
        onTalentPathItemMouseLeave () {
            this.currentClassData.talentPath.forEach(talentPathItem => {
                talentPathItem.faded = false;
            });
            this.$root.$emit('unHighlightSkills');
        }
    }
};
</script>
