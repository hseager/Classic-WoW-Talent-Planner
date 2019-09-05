<template>
	<ul class="class-list">
		<li v-for="classType in classes" 
			:key="classType.id"
			v-on:click.prevent="changeClass(classType.id)"
			v-bind:class="{ active: currentClassId === classType.id }">
			<img v-bind:src="getClassIconImage(classType.name)">
			<span v-if="currentClassId === classType.id" class="class-list-name">{{classType.name}}</span>
		</li>
	</ul>
</template>
<script>
	import { config } from '../includes/Config.js';
	export default {
		name: 'class-list',
		props: {
			classes: Array,
		},
		computed: {
			currentClassId(){
				return this.$store.state.currentClassId;
			}
		},
		methods: {
			changeClass(classId){
				this.$store.commit({
					type: 'changeClass',
					classId: classId
				});
			},
			getClassIconImage(className){
				return 	config.imageDirectory + 
						config.classIconDirectory +
						'icon-' +
						className.toLowerCase() + '.jpg';
			}
		}
	}
</script>