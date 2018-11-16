<template>
  <div class="navigation">
    <b-navbar type="dark" variant="dark">
      <b-navbar-nav class="ml-auto">
        <b-nav-form>
          <b-button variant="outline-primary">
            <font-awesome-icon icon="upload" />
            Import JSON
          </b-button>
          <b-button variant="outline-success">
            <font-awesome-icon icon="save" />
            Export JSON
          </b-button>
          <b-button variant="outline-success">
            <font-awesome-icon icon="table" />
            Export Excel
          </b-button>
        </b-nav-form>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'NavBar'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.btn {
  margin-left: .5rem;
}
</style>
