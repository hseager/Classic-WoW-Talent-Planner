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
				</li>
			</ul>
		</div>
		<div class="talent-actions">
			<button class="button" v-on:click="saveBuilds">Save Build</button>
		</div>
	</div>
</template>
<script>
	export default {
		name: 'build-controls',
		props: {
			currentClass: Object,
		},
		computed: {
			currentBuildId(){
				return this.$store.state.currentBuildId;
			},
			currentClassStore(){
				return this.$store.state.classes[this.$store.state.currentClassId];
			},
			availableSkillPoints(){
				return this.currentClassStore.availableSkillPoints;
			},
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
					classId: this.currentClass.id,
					availableSkillPoints: this.availableSkillPoints,
					requiredLevel: this.currentClass.requiredLevel,
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
				this.$store.commit({
					type: 'setCurrentBuild',
					buildId
				});
				this.loadBuild(buildId);
			},
			loadBuild(buildId){
				let build = this.builds.filter(build => build.id == buildId)[0];
				this.$store.commit('setCurrentClass', build.classId);
				this.$store.commit('setAvailableSkillPoints', build.availableSkillPoints);
			}
		}
	}
</script>