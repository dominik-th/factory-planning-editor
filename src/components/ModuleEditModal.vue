<template>
  <div>
    <b-modal id="myModal" title="Bootstrap-Vue">
      <p class="my-4">{{ $t("message.hello") }}</p>
    </b-modal>
    <!-- <b-btn v-b-modal.modal1>Launch demo modal</b-btn> -->
  </div>
</template>

<script>
export default {
  name: 'ModuleEditModal',
  props: {
  },
  mounted() {
    console.log(this.$t("message.hello"))
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
