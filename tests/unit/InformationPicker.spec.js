import { mount, createLocalVue } from '@vue/test-utils';
import BootstrapVue from 'bootstrap-vue';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import InformationPicker from '@/components/InformationPicker.vue';

const localVue = createLocalVue();
localVue.use(BootstrapVue);
library.add(fas);
localVue.component('font-awesome-icon', FontAwesomeIcon);

describe('InformationPicker.vue', () => {
  it('should render the placeholder on the input field', () => {
    const wrapper = mount(InformationPicker, {
      localVue,
      propsData: {
        placeholder: 'Platzhalter'
      }
    });
    expect(wrapper.find('input').attributes('placeholder')).toBe('Platzhalter');
  });

  it('should show suggestions based on the pool', () => {
    const wrapper = mount(InformationPicker, {
      localVue,
      propsData: {
        pool: [
          {
            id: 'dae20416-a8ec-4a69-abcd-a6998ddca7fa',
            name: 'Prozesszeiten'
          },
          {
            id: '84a7f5a8-a854-4476-bc12-dd0e2faf38f5',
            name: 'Zulieferbedarf'
          }
        ]
      }
    });
    wrapper.vm.query = 'Zulie';
    expect(wrapper.find('li').text()).toBe('Zulieferbedarf');
  });

  it('should deny input from blacklist', () => {
    const wrapper = mount(InformationPicker, {
      localVue,
      propsData: {
        blacklist: ['Zulieferbedarf']
      }
    });
    wrapper.vm.query = 'zulieferbedarf';
    wrapper.vm.submit();
    expect(wrapper.emitted('add-information')).not.toBeTruthy();
    expect(wrapper.emitted('create-information')).not.toBeTruthy();
    wrapper.vm.query = 'zulieferbedarf-neu';
    wrapper.vm.submit();
    expect(wrapper.emitted('create-information')).toBeTruthy();
  });
});
