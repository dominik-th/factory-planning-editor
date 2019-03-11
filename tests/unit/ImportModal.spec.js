import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import Notifications from 'vue-notification';
import messages from '@/i18n';
import ImportModal from '@/components/ImportModal.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);
localVue.use(BootstrapVue);
localVue.use(Notifications, { componentName: 'AppNotifications' });

const i18n = new VueI18n({
  locale: 'en-US',
  messages
});

describe('ImportModal.vue', () => {
  let state;
  let mutations;
  let store;

  beforeEach(() => {
    state = {
      informationTypes: {},
      planningModules: {},
      modeling: {
        modules: {},
        links: {},
        selected: null
      }
    };
    mutations = {
      SAVE: jest.fn()
    }
    store = new Vuex.Store({
      state,
      mutations
    });
  });

  it('should import json from string', () => {
    const wrapper = mount(ImportModal, {
      i18n,
      store,
      localVue
    });
    const sampleState = {
      informationTypes: {
        "3b77e15b-96f2-4e3b-80d6-a2e6c789d1e9": {
          name: "Prozesszeiten"
        }
      },
      planningModules: {},
      modeling: {
        modules: {},
        links: {},
        selected: null
      }
    }
    wrapper.vm.importString = JSON.stringify(sampleState);
    wrapper.vm.importData();
    expect(mutations.SAVE).toHaveBeenCalled();
    expect(JSON.stringify(wrapper.vm.$store.state)).toBe(JSON.stringify(sampleState));
  });

  it('should import deny invalid json', () => {
    const wrapper = mount(ImportModal, {
      i18n,
      store,
      localVue
    });
    const sampleState = {
      informationTypes: {
        "3b77e15b-96f2-4e3b-80d6-a2e6c789d1e9": {
          name: "Prozesszeiten"
        }
      },
      planningModules: {},
      modeling: {
        modules: {},
        links: {},
        selected: null
      }
    }
    wrapper.vm.importString = 'invalid' + JSON.stringify(sampleState);
    wrapper.vm.importData(new Event('click'));
    expect(mutations.SAVE).not.toHaveBeenCalled();
    expect(JSON.stringify(wrapper.vm.$store.state)).toBe(JSON.stringify(state));
  });
});
