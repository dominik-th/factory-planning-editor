import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import messages from '@/i18n';
import ModuleAttributes from '@/components/ModuleAttributes.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);
localVue.use(BootstrapVue);
library.add(fas);
localVue.component('font-awesome-icon', FontAwesomeIcon);

const i18n = new VueI18n({
  locale: 'en-US',
  messages
});

describe('ModuleAttributes.vue', () => {
  let actions;
  let mutations;
  let getters;
  let store;

  beforeEach(() => {
    actions = {
      removeModelingModule: jest.fn()
    };

    mutations = {
      UPDATE_MODELING_ATTRIBUTE: jest.fn(),
      SELECT_MODELING_MODULE: jest.fn()
    };

    getters = {
      selectedModelingModuleId: () => 'dae20416-a8ec-4a69-abcd-a6998ddca7fa',
      selectedModelingModule: () => ({
        moduleId: 'c4ef032b-67c1-4312-9976-5605d2cb8e33',
        position: { x: -350, y: -150 },
        attributes: { numEmployees: 0, cost: 0, duration: 0, custom: {} }
      })
    };

    store = new Vuex.Store({
      actions,
      mutations,
      getters
    });
  });

  it('should render a textarea for every custom attributes', () => {
    const wrapper = mount(ModuleAttributes, {
      i18n,
      store,
      localVue
    });
    expect(wrapper.findAll('textarea').length).toBe(0);
    wrapper.vm.addCustomAttribute();
    wrapper.vm.addCustomAttribute();
    expect(wrapper.findAll('textarea').length).toBe(2);
  });

  it('should remove custom attributes from dom after deletion', () => {
    const wrapper = mount(ModuleAttributes, {
      i18n,
      store,
      localVue
    });
    expect(wrapper.findAll('textarea').length).toBe(0);
    wrapper.vm.addCustomAttribute();
    wrapper.vm.addCustomAttribute();
    wrapper.vm.removeCustomAttribute(1);
    expect(wrapper.findAll('textarea').length).toBe(1);
  });

  it('should delete modeling module from store on button press', () => {
    const wrapper = mount(ModuleAttributes, {
      i18n,
      store,
      localVue
    });
    wrapper.find('button').trigger('click');
    expect(actions.removeModelingModule).toHaveBeenCalled();
  });
});
