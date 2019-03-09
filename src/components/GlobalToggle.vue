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
      set(value) {
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
