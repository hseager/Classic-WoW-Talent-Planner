<template>
    <ul class="class-list">
        <li v-for="classType in classes"
            :key="classType.id"
            v-on:click.prevent="setClass(classType.id)"
            v-bind:class="{ active: currentClassId === classType.id }">
            <img v-bind:src="getClassIconImage(classType.name)">
            <span v-if="currentClassId === classType.id" class="class-list-name">{{classType.name}}</span>
        </li>
    </ul>
</template>
<script>
import { config } from '../includes/Config.js';
import { mapState } from 'vuex';

export default {
    name: 'class-list',
    props: {
        classes: Array
    },
    computed: {
        ...mapState({
            currentClassId: state => state.currentClassId
        })
    },
    methods: {
        setClass (classId) {
            this.$store.commit('setCurrentClass', classId);
            this.$store.commit({
                type: 'setCurrentBuild',
                buildId: null
            });
        },
        getClassIconImage (className) {
            return config.imageDirectory +
                    config.classIconDirectory +
                    'icon-' +
                    className.toLowerCase() + '.jpg';
        }
    }
};
</script>
