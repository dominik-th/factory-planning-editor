import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import messages from '@/i18n';
import InformationEditorModal from '@/components/InformationEditorModal.vue';
import stateSample from './assets/stateSample.json';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(VueI18n);
localVue.use(BootstrapVue);

const i18n = new VueI18n({
  locale: 'en-US',
  messages
});

describe('InformationEditorModal.vue', () => {
  let state;
  let mutations;
  let store;

  beforeEach(() => {
    state = stateSample;
    mutations = {
      SAVE: jest.fn()
    };
    store = new Vuex.Store({
      state,
      mutations
    });
  });

  it('should calculate the correct "in use" information', () => {
    const wrapper = mount(InformationEditorModal, {
      i18n,
      store,
      localVue
    });
    expect(wrapper.vm.informationInUse.length).toBe(3);
    expect(wrapper.vm.informationInUse).toEqual(
      expect.arrayContaining([
        '03e3641b-d50d-473c-9e9f-d236baa7c0d8',
        'f2dd03ec-a0de-43a4-bc16-e2b9d103fbcf',
        'f5fcac2a-ab68-4f5a-8269-ce8b9d4e5e6a'
      ])
    );
  });

  it('should calculate the correct "not in use" information', () => {
    const wrapper = mount(InformationEditorModal, {
      i18n,
      store,
      localVue
    });
    expect(wrapper.vm.informationNotInUse.length).toBe(1);
    expect(wrapper.vm.informationNotInUse).toEqual(
      expect.arrayContaining(['816471a2-2a0f-41a6-a231-71bbedb215dd'])
    );
  });

  it('should calculate the correct "potential global" information', () => {
    const wrapper = mount(InformationEditorModal, {
      i18n,
      store,
      localVue
    });
    expect(wrapper.vm.allPotentialGlobalInformation.length).toBe(2);
    expect(wrapper.vm.allPotentialGlobalInformation).toEqual(
      expect.arrayContaining([
        '03e3641b-d50d-473c-9e9f-d236baa7c0d8',
        'f2dd03ec-a0de-43a4-bc16-e2b9d103fbcf'
      ])
    );
  });
});
