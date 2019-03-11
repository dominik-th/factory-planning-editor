<template>
  <div class="floating-action-button">
    <font-awesome-icon :icon="icon" />
  </div>
</template>

<script>
export default {
  name: 'FloatingActionButton',
  props: {
    // any fontawesome icon title
    icon: {
      type: String,
      default: 'bars'
    }
  }
};
</script>

<style scoped>
.floating-action-button {
  background-color: #40a73f;
  color: #fff;
  box-shadow: 2px 2px 4px #999;
  width: 50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border-radius: 25px;
  position: absolute;
  top: 20px;
  left: 20px;
  cursor: pointer;
  transition: all linear 0.1s;
}
.floating-action-button:hover {
  background-color: #007206;
}
</style>
