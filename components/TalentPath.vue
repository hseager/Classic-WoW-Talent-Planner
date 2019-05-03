<template>
	<div class="talent-path">
		<table class="talent-path-table">
			<tbody>
				<tr>
					<th></th>
					<th v-for="n in 34" v-if="n > 9" :key="n">{{n}}</th>
				</tr>
				<tr>
					<td></td>
					<td v-for="(talent, index) in talentPath" v-if="index <= 24">
						{{talent.treeId}} - {{talent.skillId}}<br/>
						<img :src="talent.skillIcon" class="talent-path-skill-icon"/>
					</td>
				</tr>
				<tr>
					<th v-for="n in 60" v-if="n > 34" :key="n">{{n}}</th>
				</tr>
				<tr>
					<td v-for="(talent, index) in talentPath" v-if="index > 24">{{talent.treeId}} - {{talent.skillId}}</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>
<script>
	export default {
		name: 'talent-path',
		props: {
			talentPath: Array,
		},
	}
</script>