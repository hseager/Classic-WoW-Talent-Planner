let tooltip = {
	props: {
		skill: Object,
		showTooltip: Boolean,
	},
	template: 
	`<div v-if="showTooltip" class="skill-tooltip">
		<h3>{{skill.name}}</h3>
		<p>Rank {{skill.currentRank}}/{{skill.maxRank}}</p>
		<p class="rank-description">{{skill.rankDescription[skill.currentRank-1]}}</p>
		<div v-if="skill.currentRank > 0 && skill.currentRank != skill.maxRank">
			<br/>
			<p>Next rank:</p>
		</div>
		<p class="rank-description">{{skill.rankDescription[skill.currentRank]}}</p>
	</div>`,
};

let skills = {
	props: {
		skill: Object,
		constants: Object,
	},
	data: function(){
		return {
			showTooltip: false,
		}
	},
	template: 
		`<div :class="['skill', skill.enabled ? 'is-enabled' : '']" :style="getGridPosition">
			<div class="skill-icon"
				v-on:click="onIncreaseSkillRank"
				v-on:click.right.prevent="onDecreaseSkillRank"
				v-on:mouseover="showTooltip = true"
				v-on:mouseout="showTooltip = false">
				<img v-bind:src="getSkillIcon" class="skill-icon-image">
			</div>
			<span class="skill-rank">{{skill.currentRank}}/{{skill.maxRank}}</span>
			<tooltip
				v-bind:skill="skill"
				v-bind:showTooltip="showTooltip"></tooltip>
		</div>`,
	components: {
		tooltip,
	},
	computed:{
		getGridPosition: function(){
			if(typeof this.skill.position !== 'undefined'){
				return {
					gridRowStart: this.skill.position[0],
					gridColumnStart: this.skill.position[1],
				}
			}
		},
		getSkillIcon: function(){
			if(typeof this.skill.icon !== 'undefined'){
				return this.constants.imageDirectory + this.constants.skillIconDirectory + this.skill.icon;
			}
		}
	},
	methods: {
		onIncreaseSkillRank: function(){
			if(this.skill.enabled){
				if(this.skill.currentRank < this.skill.maxRank){
					this.skill.currentRank++
					this.$parent.$emit('decreaseClassSkillPoints');
					this.$parent.$emit('increaseRequiredLevel');
				}
			}
		},
		onDecreaseSkillRank: function(){
			if(this.skill.currentRank >= 1){
				this.skill.currentRank--;
				this.$parent.$emit('increaseClassSkillPoints');
				this.$parent.$emit('decreaseRequiredLevel');
			}
		},
	},
};

let talentTree = {
	props: {
		className: String,
		tree: Object,
		constants: Object,
	},
	template: 
	`<div>
		<h3>{{tree.name}}</h3>
		<div class="talent-tree" :style="getTalentBackgroundImage">
			<skills
				v-for="skill in tree.skills"
				v-bind:skill="skill"
				v-bind:key="skill.id"
				v-bind:constants="constants">
			></skills>
		</div>
	</div>`,
	components: {
		skills
	},
	computed: {
		getTalentBackgroundImage: function(){
			let backgroundImageUrl = this.constants.imageDirectory + this.constants.backgroundDirectory + 'background-' + this.className + '-' + this.tree.name.replace(' ','-').toLowerCase() + '.jpg';
			return {
				backgroundImage: `url('${backgroundImageUrl}')`,
				backgroundRepeat: 'no-repeat',
				backgroundSize: 'cover',
			}
		}
	},
};

let classPanel = {
	props: {
		classType: Object,
		constants: Object,
	},
	template:
	`<div class="talent-trees">
		<talent-tree
			v-for="tree in classType.talentTrees"
			v-bind:tree="tree"
			v-bind:key="tree.id"
			v-on:decreaseClassSkillPoints="decreaseClassSkillPoints"
			v-on:increaseClassSkillPoints="increaseClassSkillPoints"
			v-on:decreaseRequiredLevel="decreaseRequiredLevel"
			v-on:increaseRequiredLevel="increaseRequiredLevel"
			v-bind:className="classType.name"
			v-bind:constants="constants"
		></talent-tree>
	</div>`,
	methods: {
		decreaseClassSkillPoints: function(){
			this.classType.skillPoints--;
		},
		increaseClassSkillPoints: function(){
			this.classType.skillPoints++;
		},
		increaseRequiredLevel: function(){
			if(this.classType.requiredLevel == 0)
				this.classType.requiredLevel = 10;
			else
				this.classType.requiredLevel++;
		},
		decreaseRequiredLevel: function(){
			if(this.classType.requiredLevel == 10)
				this.classType.requiredLevel = 0;
			else
				this.classType.requiredLevel--;
		},
	},
	components: {
		talentTree
	}
};

let classList = {
	props: {
		constants: Object,		
		classType: Object,
		currentClass: Number
	},
	data: function(){
		return {
			classIconImage: this.constants.imageDirectory + this.constants.classIconDirectory + 'icon-' + this.classType.name + '.jpg',
		}
	},
	template: 
	`<li v-on:click="onClassSelect" v-bind:class="{ active: currentClass === classType.id }">
		<img v-bind:src="classIconImage">
	</li>`,
	methods: {
		onClassSelect: function(){
			this.$emit('change-class');
		}
	}
};

var app = new Vue({
	el: '#talent-calculator',
	data: talentData,
	components: {
		classList,
		classPanel
	},
	template: 
	`<div>
		<strong>Skills points: {{classes[currentClass].skillPoints}}</strong>
		<strong>Required level: {{classes[currentClass].requiredLevel}}</strong>
		<ul class="class-list">
			<class-list
				v-for="classType in classes"
				v-bind:classType="classType"
				v-bind:key="classType.id"
				v-on:change-class="currentClass = classType.id"
				v-bind:constants="constants"
				v-bind:currentClass="currentClass"
			></class-list>
		</ul>
		<class-panel
			v-bind:class-type="classes[currentClass]"
			v-bind:constants="constants"
		></class-panel>
	</div>`,
});