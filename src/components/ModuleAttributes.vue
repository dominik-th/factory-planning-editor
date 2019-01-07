<template>
  <transition name="fade">
    <div class="container-attributes" v-if="stateSelectedModelingModule !== null">
      <div class="attributes">
        <b-form>
          <b-form-group
            label-size="sm"
            label-for="num-employees"
            :label="$t('attributes.num_employees')"
          >
            <masked-input
              type="text"
              id="num-employees"
              class="form-control form-control-sm"
              placeholder="1.234"
              v-model="numEmployees"
              :mask="maskMethod3"
              :guide="false"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label-for="cost"
            :label="$t('attributes.cost')"
          >
            <masked-input
              type="text"
              id="cost"
              class="form-control form-control-sm"
              placeholder="1.234,56 €"
              v-model="cost"
              :mask="maskMethod2"
              :guide="false"
            />
          </b-form-group>
          <b-form-group
            label-size="sm"
            label-for="duration"
            :label="$t('attributes.duration')"
          >
            <masked-input
              type="text"
              id="duration"
              class="form-control form-control-sm"
              placeholder="HH:MM"
              v-model="duration"
              :mask="maskMethod"
              :guide="false"
              placeholderChar="#"
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
              v-model="attribute.key"
              :placeholder="$t('attributes.description')"
            />
            <b-form-textarea
              size="sm"
              v-model="attribute.value"
              :placeholder="$t('attributes.value')"
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
  </transition>
</template>
<!-- https://www.smashingmagazine.com/2017/06/designing-efficient-web-forms/ -->
<script>
import { mapGetters } from 'vuex';
import MaskedInput, {conformToMask} from 'vue-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

export default {
  name: 'ModuleAttributes',
  components: {
    MaskedInput
  },
  data() {
    return {
      numEmployees: '',
      cost: '',
      duration: '',
      custom: {}
    }
  },
  computed: {
    ...mapGetters({
      stateSelectedModelingModuleId: 'selectedModelingModuleId',
      stateSelectedModelingModule: 'selectedModelingModule'
    }),
    selectedModule: function() {
      return this.$store.state.modeling.modules[this.stateSelectedModelingModuleId];
    }
  },
  watch: {
    stateSelectedModelingModule: {
      handler: function(module) {
      if (!module) return;
      // when the selected module has changed, pre fill the inputs
      let maskedNumEmployeed = conformToMask(
        module.attributes.numEmployees.toString(),
        this.maskMethod3
      );
      this.numEmployees = maskedNumEmployeed.conformedValue;

      let maskedCost = conformToMask(
        (module.attributes.cost / 100).toString().replace('.', ','),
        this.maskMethod2
      );
      this.cost = maskedCost.conformedValue;

      let hours = Math.floor(module.attributes.duration / 60).toString().padStart(2, '0');
      let minutes = (module.attributes.duration % 60).toString().padStart(2, '0');
      this.duration = `${hours}:${minutes}`

      this.custom = JSON.parse(JSON.stringify(module.attributes.custom));
      },
      immediate: true
    },
    // watch all inputs to auto save any changes if input is valid
    numEmployees: function(value) {
      let parsedValue = parseInt(value.replace('.', ''));
      if (typeof parsedValue === 'number' && !isNaN(parsedValue)) {
        this.saveAttribute('numEmployees', parseInt(value.replace('.', '')));
      }
    },
    cost: function(value) {
      // parse 1.234.456,78 € format
      let cents = parseFloat(value
        // remove thousand separators
        .replace('.', '')
        // use international decimal separator
        .replace(',', '.')
      ) * 100;
      if (typeof cents === 'number' && !isNaN(cents)) {
        this.saveAttribute('cost', cents);
      }
    },
    duration: function(value) {
      // parse HH:MM format
      let parts = value.split(':').map(Number);
      let minutes = parts.length > 1 ? parts[1] : 0;
      minutes += parts[0] * 60;
      if (typeof minutes === 'number' && !isNaN(minutes)) {
        this.saveAttribute('duration', minutes);
      }
    },
    custom: {
      handler: function(value) {
        this.saveAttribute('custom', value);
      },
      deep: true
    }
  },
  methods: {
    maskMethod2: createNumberMask({
      prefix: '',
      suffix: ' €',
      thousandsSeparatorSymbol: '.',
      allowDecimal: true,
      decimalSymbol: ',',
    }),
    maskMethod3: createNumberMask({
      prefix: '',
      suffix: '',
      thousandsSeparatorSymbol: '.'
    }),
    maskMethod: function(raw) {
      let mask = [];
      let parts = raw.replace(/[^\d:]/g, '').split(':');
      for (let i = 0; i < parts[0].length; i++) {
        mask.push(/\d/);
      }
      if (parts[1] && parts[1].length >= 3) mask.push(/\d/);
      mask.push(':', /\d/, /\d/);
      return mask;
    },
    attributeGetter: function(attribute, defaultValue) {
      if (this.selectedModule.attributes[attribute]) {
        return this.selectedModule.attributes[attribute];
      } else {
        return defaultValue;
      }
    },
    attributeSetter: function(value, attribute, parseValue) {
      if (this.selectedModule.attributes[attribute] === parseValue(value)) return;
      this.$store.commit('UPDATE_MODELING_ATTRIBUTE', {
        id: this.stateSelectedModelingModuleId,
        attribute: attribute,
        value: parseValue(value)
      });
    },
    saveAttribute: function(attribute, value) {
      if (this.stateSelectedModelingModule.attributes[attribute] === value) return;
      this.$store.commit('UPDATE_MODELING_ATTRIBUTE', {
        id: this.stateSelectedModelingModuleId,
        attribute,
        value: JSON.parse(JSON.stringify(value))
      });
    },
    addCustomAttribute: function() {
      let max = Math.max(0, ...Object.keys(this.custom));
      this.$set(this.custom, max + 1, {
        key: '',
        value: ''
      });
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
