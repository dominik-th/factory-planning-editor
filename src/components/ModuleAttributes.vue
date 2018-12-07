<template>
  <div class="container-repository">
    <div class="repository-filter">
      <input type="text" class="form-control form-control-sm" id="repository-filter-textbox" placeholder="Filter...">
    </div>
    <div class="repository-components">

    </div>
    <div class="repository-actions">
      <div class="btn-group btn-group-sm" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-secondary"><i class="fas fa-plus"></i></button>
        <button type="button" class="btn btn-secondary action-component-edit"><i class="fas fa-pen"></i> Edit</button>
        <button type="button" class="btn btn-secondary"><i class="fas fa-minus"></i></button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ModelRepository',
  mounted() {
  },
  methods: {
    addModule: function(evt) {
      this.$root.$emit('addModule', 'payload');
      this.$store.commit('ADD_PLANNING_MODULE', {
        id: Math.random(),
        text: 'abc'
      });
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.repository-components {
  flex: 1;
  border-top: 1px solid rgba(68, 68, 68, 0.25);
  border-bottom: 1px solid rgba(68, 68, 68, 0.25);
  overflow-y: scroll;
}
.repository-actions > div {
  display: flex;
}
.repository-actions > div > button{
  border-radius: 0rem !important;
}
.action-component-edit {
  flex: 1 !important;
}
.repository-component {
  border: 1px solid #999;
  border-radius: 1rem;
  text-align: center;
  min-height: 5rem;
  vertical-align: middle;
  margin: 1.25rem .5rem 1.25rem .5rem;
}
.repository-component.selected {
  background-color: rgba(0, 255, 0, .2);
}
.component-title {
  font-weight: bold;
}
.component-info {
  font-size: .7rem;
}
</style>
