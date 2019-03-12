import { mount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import messages from '@/i18n';
import ModuleRepository from '@/components/ModuleRepository.vue';

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

describe('ModuleRepository.vue', () => {
  let actions;
  let mutations;
  let getters;
  let store;

  beforeEach(() => {
    actions = {
      removePlanningModule: jest.fn()
    };

    getters = {
      planningModules: () => ({
        '4d8795fd-fa5e-4417-9711-db1de4968418': {
          name: 'Zielplanung',
          inputInformation: [],
          outputInformation: []
        },
        '8fcbf777-f263-46b7-a203-5fae7a652208': {
          name: 'Prozessplanung',
          inputInformation: [],
          outputInformation: []
        }
      }),
      filteredPlanningModules: () => {
        return () => [
          {
            item: {
              id: '4d8795fd-fa5e-4417-9711-db1de4968418',
              inputInformation: [],
              outputInformation: [],
              name: 'Zielplanung',
              abbreviation: null
            },
            matches: [
              {
                indices: [[3, 6]],
                value: 'Zielplanung',
                key: 'name',
                arrayIndex: 0
              }
            ]
          }
        ];
      }
    };

    store = new Vuex.Store({
      actions,
      mutations,
      getters
    });
  });

  it('should render planning modules', () => {
    const wrapper = mount(ModuleRepository, {
      i18n,
      store,
      localVue
    });
    expect(wrapper.findAll('.repository-component').length).toBe(2);
  });

  it('should properly delete planning modules', () => {
    const wrapper = mount(ModuleRepository, {
      i18n,
      store,
      localVue
    });
    expect(wrapper.findAll('.repository-component').length).toBe(2);
    wrapper.vm.selectModule('8fcbf777-f263-46b7-a203-5fae7a652208');
    wrapper.vm.removeSelectedModule();
    expect(actions.removePlanningModule).toHaveBeenCalled();
  });

  it('should filter the repository', () => {
    const wrapper = mount(ModuleRepository, {
      i18n,
      store,
      localVue
    });
    expect(wrapper.findAll('.repository-component').length).toBe(2);
    wrapper.vm.filter = 'plan';
    expect(wrapper.findAll('.repository-component').length).toBe(1);
  });
});
