import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import messages from '@/i18n';
import ExportModal from '@/components/ExportModal.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);
localVue.use(BootstrapVue);

const i18n = new VueI18n({
  locale: 'en-US',
  messages
});

jest.mock('file-saver', () => ({ saveAs: jest.fn() }));

describe('ExportModal.vue', () => {
  let state;
  let store;

  beforeEach(() => {
    state = {
      informationTypes: {
        '3b77e15b-96f2-4e3b-80d6-a2e6c789d1e9': {
          name: 'Prozesszeiten'
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

  it('displays the stringified vuex store', () => {
    const wrapper = shallowMount(ExportModal, {
      i18n,
      store,
      localVue
    });
    expect(wrapper.vm.$refs.textfield.value).toBe(JSON.stringify(state));
  });
});
