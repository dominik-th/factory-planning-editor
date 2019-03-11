<template>
  <b-form-checkbox
    :key="information.id"
    v-model="checked"
  >
    {{ information.data.name }}
  </b-form-checkbox>
</template>

<script>
export default {
  name: 'GlobalToggle',
  props: {
    information: {
      type: Object
    }
  },
  computed: {
    checked: {
      get() {
        return this.$store.state.informationTypes[this.information.id].global;
      },
      // override setter to automatically inform vuex about changes
      set(value) {
        // vuex timetraveling sets this value so this condition prevents an unnecessary commit
        if (
          value !==
          this.$store.state.informationTypes[this.information.id].global
        ) {
          this.$store.commit('SET_GLOBAL', { id: this.information.id, value });
        }
      }
    }
  }
};
</script>
