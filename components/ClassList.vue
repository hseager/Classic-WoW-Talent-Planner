<template>
	<li v-on:click.prevent="onClassSelect" v-bind:class="{ active: currentClass === classType.id }">
		<img v-bind:src="classIconImage">
		<span v-if="currentClass === classType.id" class="class-list-name">{{classType.name}}</span>
	</li>
</template>
<script>
	import { config } from './Config.js';
	export default {
		name: 'class-list',
		props: {
			classType: Object,
			currentClass: Number
		},
		data: function(){
			return {
				classIconImage: config.imageDirectory + config.classIconDirectory + 'icon-' + this.classType.name.toLowerCase() + '.jpg',
			}
		},
		methods: {
			onClassSelect: function(){
				this.$emit('change-class');
			}
		}
	}
</script>