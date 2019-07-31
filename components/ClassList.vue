<template>
  <li v-on:click.prevent="onClassSelect" v-bind:class="{ active: currentClass === classType.id }">
    <img v-bind:src="classIconImage" />
    <span v-if="currentClass === classType.id" class="class-list-name">{{classType.name}}</span>
  </li>
</template>
<script>
export default {
  name: "class-list",
  props: {
    constants: Object,
    classType: Object,
    currentClass: Number
  },
  data: function() {
    return {
      classIconImage:
        this.constants.imageDirectory +
        this.constants.classIconDirectory +
        "icon-" +
        this.classType.name.toLowerCase() +
        ".jpg"
    };
  },
  methods: {
    onClassSelect: function() {
      this.$emit("change-class");
    }
  }
};
</script>