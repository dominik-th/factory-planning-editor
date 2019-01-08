<template>
  <div class="information-picker">
    <b-input-group>
      <b-input-group
        class="mb-3"
        size="sm"
      >
        <b-form-input
          v-model="query"
          :placeholder="placeholder"
          @keyup.enter.native="submit(query)"
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
            @click="submit(query)"
          >
            <font-awesome-icon
              icon="plus"
              class="information-picker-add-icon"
              :class="{ tilted: isBlacklisted }"
            />
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
    };
  },
  computed: {
    filteredInformation() {
      // todo: better search with fuse
      if (this.query.length === 0) return [];
      return this.pool.filter(ele => {
        return (
          ele.name.toLowerCase().indexOf(this.query.trim().toLowerCase()) >= 0
        );
      });
    },
    isBlacklisted() {
      // check if current query is in the (via props given) blacklist
      return (
        this.blacklist.findIndex(ele => {
          return ele.toLowerCase() === this.query.trim().toLowerCase();
        }) >= 0
      );
    }
  },
  mounted() {
    this.$on('create-information', function() {
      this.query = '';
    });
  },
  methods: {
    clear: function() {
      this.query = '';
      this.focus = false;
      this.hover = false;
    },
    submit: async function() {
      // block any empty strings / null values
      if (!this.query.length) {
        return this.$notify({
          type: 'warn',
          text: this.$t('warning.empty_information_type')
        });
      }
      // ignore any submission with blacklistet information
      if (!this.isBlacklisted) {
        // search if the query is identical to one of the information in pool
        for (let information of this.pool) {
          if (information.name.toLowerCase() === this.query) {
            return this.$emit('add-information', information.id);
          }
        }
        // otherwise create a new information for the current query
        this.$emit('create-information', this.query);
      }
    }
  }
};
</script>

<style scoped>
.information-picker {
  padding: 1.25em 0em 0.2em 0em;
}
.information-picker-add-icon {
  transition: all 0.5s;
}
.information-picker-add-icon.tilted {
  transform: rotate(45deg);
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
  padding: 0.5rem 0;
  margin: 0.175rem 0 0;
  font-size: 1rem;
  color: #212529;
  text-align: left;
  list-style: none;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.25rem;
}
.dropdown-list.hidden {
  display: none;
}
.dropdown-item {
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
