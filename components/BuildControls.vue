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
	import { mapGetters } from 'vuex';
	import { mapState } from 'vuex';

	export default {
		name: 'build-controls',
		props: {
			currentClass: Object,
		},
		computed: {
			...mapGetters([
				'availableSkillPoints',
				'requiredLevel'
			]),
			...mapState({
				currentClassId: state => state.currentClassId,
				currentBuildId: state => state.currentBuildId,
			}),
		},
		data(){
			return {
				builds: []
			}
		},
		mounted(){
			let localBuilds = window.localStorage.getItem('builds');
			if(localBuilds != null){
				this.builds = JSON.parse(localBuilds);
			}
		},
		methods: {
			saveBuilds(){
				let newBuild = this.createNewBuild();
				this.builds.push(newBuild);
				window.localStorage.setItem('builds', JSON.stringify(this.builds));
			},
			createNewBuild(){
				let talentTrees = [];
				let buildName = this.currentClass.name + ' - ' + 
								this.currentClass.talentTrees[0].skillPoints + '/' +
								this.currentClass.talentTrees[1].skillPoints + '/' +
								this.currentClass.talentTrees[2].skillPoints;
				let talentPath = [...this.currentClass.talentPath];

				this.currentClass.talentTrees.forEach(tree => {
					if(tree.skillPoints > 0){
						let skills = [];
						tree.skills.forEach(skill => {
							if(skill.currentRank > 0){
								skills.push({
									skillId: skill.id,
									currentRank: skill.currentRank,
								});
							}
						});
						talentTrees.push({
							treeId: tree.id,
							skillPoints: tree.skillPoints,
							currentSkillTier: tree.currentSkillTier,
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
					talentPath,
					talentTrees
				};
				return newBuild;
			},
			getNewBuildId(){
				if(this.builds.length > 0){
					let buildId = 0;
					this.builds.forEach(build => {
						if(build.id >= buildId){
							buildId = build.id + 1;
						}
					});
					return buildId;
				} else {
					return 0;
				}
			},
			selectBuild(buildId){
				if(this.currentBuildId != buildId){
					this.$store.commit({
						type: 'setCurrentBuild',
						buildId
					});
					this.loadBuild(buildId);
				}
			},
			loadBuild(buildId){
				let build = this.builds.filter(build => build.id == buildId)[0];
				this.resetTrees();
				this.$store.dispatch('loadBuild', build).then(() => {
					this.currentClass.talentPath = build.talentPath;
					build.talentTrees.forEach(talentTree => {
						let dataTree = this.currentClass.talentTrees.filter(tree => tree.id == talentTree.treeId)[0];
						dataTree.skillPoints = talentTree.skillPoints;
						dataTree.currentSkillTier = talentTree.currentSkillTier;
						talentTree.skills.forEach(skill => {
							let dataSkill = dataTree.skills.filter(dataSkill => dataSkill.id == skill.skillId)[0];
							dataSkill.currentRank = skill.currentRank;
							dataSkill.enabled = true;
						});
					});
				});
			},
			resetTrees(){
				this.currentClass.talentPath = [];
				this.currentClass.talentTrees.forEach(tree => {
					tree.skillPoints = 0;
					tree.currentSkillTier = 0;
					tree.skills.forEach(skill => {
						skill.currentRank = 0;
						if(skill.requirements){
							skill.enabled = false;
						}
					});
				});
			},
			deleteBuild(buildId){
				this.builds = this.builds.filter(build => build.id != buildId);
				window.localStorage.setItem('builds', JSON.stringify(this.builds));
			}
		}
	}
</script>