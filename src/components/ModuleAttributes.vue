<template>
  <div class="container-attributes">
    <div class="attributes">
      <b-form>
        <b-form-group
          label-size="sm"
          label-for="num-employees"
          :label="$t('attributes.num_employees')"
        >
          <b-form-input
            id="num-employees"
            size="sm"
            type="number"
            min="0"
            v-model="numEmployees"
          />
        </b-form-group>
        <b-form-group
          label-size="sm"
          label-for="cost"
          :label="$t('attributes.cost')"
        >
          <b-form-input
            id="cost"
            size="sm"
            type="number"
            min="0"
            step="0.01"
            v-model="cost"
          />
        </b-form-group>
        <b-form-group
          label-size="sm"
          label-for="duration"
          :label="$t('attributes.duration')"
        >
          <b-form-input
            id="duration"
            size="sm"
            placeholder="HH:MM"
            v-model="duration"
          />
        </b-form-group>
        <b-form-group
          label-size="sm"
          v-for="(attribute, key, index) in custom"
          :key="key"
        >
          <template slot="label" label-for="`custom${index}`">
            <font-awesome-icon
              icon="minus-circle"
              class="text-danger attribute-remove-icon"
              @click="removeCustomAttribute(key)"
            />
            {{ $t('attributes.custom', [index + 1]) }}
          </template>
          <b-form-input
            id="`custom${index}`"
            size="sm"
            placeholder="Beschreibung"
            v-model="attribute.key"
          />
          <b-form-textarea
            size="sm"
            placeholder="Wert"
            v-model="attribute.value"
            :rows="3"
            :max-rows="6"
          />
        </b-form-group>
      </b-form>
    </div>
    <div class="repository-actions">
      <b-button-group size="sm">
        <b-button @click="addCustomAttribute">
          <font-awesome-icon icon="plus" />
        </b-button>
      </b-button-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModuleAttributes',
  data() {
    return {
      numEmployees: 0,
      cost: 0,
      duration: '',
      custom: {}
    }
  },
  methods: {
    addCustomAttribute: function() {
      let max = Math.max(0, ...Object.keys(this.custom));
      this.$set(this.custom, max + 1, {
        key: '',
        value: ''
      })
    },
    removeCustomAttribute: function(id) {
      this.$delete(this.custom, id);
    }
  }
}
</script>

<style scoped>
textarea {
  margin-top: calc(0.25rem + 1px);
}
.attribute-remove-icon {
  cursor: pointer;
}
.container-attributes {
  width: 13rem;
  display: flex;
  flex-direction: column;
  border-left: 2px solid rgba(68, 68, 68, 0.25);
}
.attributes {
  padding: 5px;
  overflow-y: auto;
  flex: 1;
}
.repository-actions > div {
  display: flex;
}
.repository-actions > div > button {
  flex: 1;
  border-radius: 0rem !important;
}
</style>
