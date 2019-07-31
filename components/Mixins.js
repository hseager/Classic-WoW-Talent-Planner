import Vue from "vue";

Vue.mixin({
	methods: {
		getImageFileName: name => name.replace("'", "")
			.replace(":", "")
			.replace(/ /g, "-")
			.replace("(", "")
			.replace(")", "")
			.toLowerCase() + ".jpg",
		isMobile: function () {
			const windowWidth = window.innerWidth;
			if (windowWidth <= 700)
				return true;
			else
				return false;
		}
	}
});