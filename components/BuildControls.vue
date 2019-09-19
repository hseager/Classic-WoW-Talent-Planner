<template>
    <div>
        <div class="build-controls"
            v-if="builds.length > 0">
            <h2 class="build-title">Builds</h2>
            <ul class="build-list">
                <li :class="['build-list-item', { 'active': build.id == currentBuildId }]"
                    v-for="build in builds"
                    :key="build.id"
                    v-on:click="selectBuild(build.id)">
                    {{build.name}}
                    <span class="build-delete"
                        v-on:click.stop="deleteBuild(build.id)">X</span>
                </li>
            </ul>
        </div>
        <div class="talent-actions">
            <button class="button" v-on:click.stop="saveBuilds">Save Build</button>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex';

export default {
    name: 'build-controls',
    props: {
        currentClassData: Object
    },
    computed: {
        ...mapGetters({
            availableSkillPoints: 'classes/availableSkillPoints',
            requiredLevel: 'classes/requiredLevel',
            talentPath: 'classes/talentPath',
            getTreeById: 'talentTrees/getTreeById'
        }),
        ...mapState({
            currentClassId: state => state.classes.currentClassId,
            currentBuildId: state => state.builds.currentBuildId
        })
    },
    data () {
        return {
            builds: []
        };
    },
    mounted () {
        let localBuilds = window.localStorage.getItem('builds');
        if (localBuilds != null) {
            this.builds = JSON.parse(localBuilds);
        }
    },
    methods: {
        saveBuilds () {
            let newBuild = this.createNewBuild();
            this.builds.push(newBuild);
            window.localStorage.setItem('builds', JSON.stringify(this.builds));
        },
        createNewBuild () {
            let talentTrees = [];
            let buildName = this.currentClassData.name + ' - ' +
                            this.getTreeById(this.currentClassData.talentTrees[0].id).skillPoints + '/' +
                            this.getTreeById(this.currentClassData.talentTrees[1].id).skillPoints + '/' +
                            this.getTreeById(this.currentClassData.talentTrees[2].id).skillPoints;
            let buildTalentPath = [...this.talentPath];

            this.currentClassData.talentTrees.forEach(tree => {
                const currentTalentTree = this.getTreeById(tree.id);
                if (currentTalentTree.skillPoints > 0) {
                    let skills = [];
                    tree.skills.forEach(skill => {
                        if (skill.currentRank > 0) {
                            skills.push({
                                skillId: skill.id,
                                currentRank: skill.currentRank
                            });
                        }
                    });
                    talentTrees.push({
                        id: tree.id,
                        skillPoints: currentTalentTree.skillPoints,
                        currentSkillTier: currentTalentTree.currentSkillTier,
                        skills
                    });
                }
            });
            let newBuild = {
                id: this.getNewBuildId(),
                name: buildName,
                classId: this.currentClassId,
                availableSkillPoints: this.availableSkillPoints,
                requiredLevel: this.requiredLevel,
                talentPath: buildTalentPath,
                talentTrees
            };
            return newBuild;
        },
        getNewBuildId () {
            if (this.builds.length > 0) {
                let buildId = 0;
                this.builds.forEach(build => {
                    if (build.id >= buildId) {
                        buildId = build.id + 1;
                    }
                });
                return buildId;
            } else {
                return 0;
            }
        },
        selectBuild (buildId) {
            if (this.currentBuildId !== buildId) {
                this.$store.commit({
                    type: 'builds/setCurrentBuild',
                    buildId
                });
                this.loadBuild(buildId);
            }
        },
        loadBuild (buildId) {
            this.resetTrees();
            let build = this.builds.find(build => build.id === buildId);
            this.$store.dispatch('builds/loadBuild', build).then(() => {
                build.talentTrees.forEach(talentTree => {
                    let dataTree = this.currentClassData.talentTrees.find(tree => tree.id === talentTree.id);
                    talentTree.skills.forEach(skill => {
                        let dataSkill = dataTree.skills.find(dataSkill => dataSkill.id === skill.skillId);
                        dataSkill.currentRank = skill.currentRank;
                        dataSkill.enabled = true;
                    });
                });
            });
        },
        resetTrees () {
            this.$store.commit({
                type: 'classes/setTalentPath',
                talentPath: []
            });
            this.currentClassData.talentTrees.forEach(tree => {
                this.$store.commit({
                    type: 'talentTrees/setSkillPoints',
                    treeId: tree.id,
                    skillPoints: 0
                });
                this.$store.commit({
                    type: 'talentTrees/setCurrentSkillTier',
                    treeId: tree.id,
                    currentSkillTier: 0
                });
                tree.skills.forEach(skill => {
                    skill.currentRank = 0;
                    if (skill.requirements) {
                        skill.enabled = false;
                    }
                });
            });
        },
        deleteBuild (buildId) {
            this.builds = this.builds.filter(build => build.id !== buildId);
            window.localStorage.setItem('builds', JSON.stringify(this.builds));
        }
    }
};
</script>
