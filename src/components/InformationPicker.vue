<template>
  <div class="information-picker">
    <b-input-group>
      <b-input-group
        class="mb-3"
        size="sm"
      >
        <b-form-input
          :placeholder="placeholder"
          v-model="query"
          :state="!isBlacklisted"
          @focus.native="focus = true"
          @blur.native="focus = false"
        />
        <b-list-group
          class="dropdown-list"
          size="sm"
          :class="{ hidden: (filteredInformation.length === 0) || (!focus && !hover) }"
          @mouseover="hover = true"
          @mouseout="hover = false"
        >
          <li
            v-for="information in filteredInformation.slice(0,5)"
            :key="information.id"
            @click="$emit('add-information', information.id)"
          >
            <a class="dropdown-item">{{ information.name }}</a>
          </li>
        </b-list-group>
        <b-input-group-append>
          <b-btn
            size="sm"
            :variant="isBlacklisted ? 'danger' : 'success'"
            @click="isBlacklisted ? null : $emit('create-information', query)"
          >
            Add
          </b-btn>
        </b-input-group-append>
      </b-input-group>
    </b-input-group>
  </div>
</template>

<script>
export default {
  name: 'InformationPicker',
  props: {
    pool: {
      type: Array,
      default: () => []
    },
    blacklist: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      query: '',
      focus: false,
      hover: false
    }
  },
  computed: {
    filteredInformation() {
      // todo: better search
      if (this.query.length === 0) return [];
      return this.pool.filter((ele) => {
        return ele.name.toLowerCase().indexOf(this.query.trim().toLowerCase()) >= 0
      });
    },
    isBlacklisted() {
      return this.blacklist.findIndex((ele) => {
        return ele.toLowerCase() === this.query.trim().toLowerCase();
      }) >= 0;
    }
  },
  mounted() {
    this.$on('create-information', function() {
      this.query = '';
    });
  }
}
</script>

<style scoped>
.information-picker {
  padding: 1.25em 0em .2em 0em;
}
.dropdown-list {
  position: absolute;
  top: 100%;
  width: 100%;
  left: 0;
  z-index: 1000;
  display: block;
  float: left;
  min-width: 10rem;
  padding: .5rem 0;
  margin: .175rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0,0,0,.15);
  border-radius: .25rem;
}
.dropdown-list.hidden {
  display: none;
}
</style>
