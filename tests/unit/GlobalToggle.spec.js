import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import BootstrapVue from 'bootstrap-vue';
import { store } from '@/store/store';
import GlobalToggle from '@/components/GlobalToggle.vue';

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.use(BootstrapVue);


describe('ExportModal.vue', () => {
  let state;
  let mutations;
  let store;

  beforeEach(() => {
    mutations = {
      SET_GLOBAL: jest.fn()
    }
    state = {
      informationTypes: {
        'fb823d02-b546-4b09-8849-4172181b0b89': {
          name: 'Absatzprognosen',
          global: false
        }
      }
    }
    store = new Vuex.Store({
      state,
      mutations
    });
  });

  it('should call "SET_GLOBAL" mutation on toggle', () => {
    const wrapper = mount(GlobalToggle, {
      store,
      localVue,
      propsData: {
        information: {
          id: 'fb823d02-b546-4b09-8849-4172181b0b89',
          data: {
            name: 'Absatzprognosen',
            global: false
          }
        }
      }
    });
    const checkbox = wrapper.find('input');
    checkbox.setChecked();
    expect(mutations.SET_GLOBAL).toHaveBeenCalled();
  });

  it('should call "SET_GLOBAL" when value changed explicitly', () => {
    const wrapper = mount(GlobalToggle, {
      store,
      localVue,
      propsData: {
        information: {
          id: 'fb823d02-b546-4b09-8849-4172181b0b89',
          data: {
            name: 'Absatzprognosen',
            global: false
          }
        }
      }
    });
    wrapper.vm.checked = true;
    expect(mutations.SET_GLOBAL).toHaveBeenCalled();
  });

  it('should not call "SET_GLOBAL" when value didnt change', () => {
    const wrapper = mount(GlobalToggle, {
      store,
      localVue,
      propsData: {
        information: {
          id: 'fb823d02-b546-4b09-8849-4172181b0b89',
          data: {
            name: 'Absatzprognosen',
            global: false
          }
        }
      }
    });
    wrapper.vm.checked = false;
    expect(mutations.SET_GLOBAL).not.toHaveBeenCalled();
  });
});
