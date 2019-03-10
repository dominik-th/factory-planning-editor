import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import GlobalToggle from '@/components/GlobalToggle.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);


describe('ExportModal.vue', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
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
    };
    store = new Vuex.Store({
      state
    });
  });
});
