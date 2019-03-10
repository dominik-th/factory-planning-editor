import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import FloatingActionButton from '@/components/FloatingActionButton.vue';

const localVue = createLocalVue();
library.add(fas);
localVue.component('font-awesome-icon', FontAwesomeIcon);

describe('FloatingActionButton.vue', () => {
  it('renders an icon inside', () => {
    const wrapper = shallowMount(FloatingActionButton, {
      localVue
    });
    expect(wrapper.find(FontAwesomeIcon).exists()).toBe(true);
  });

  it('renders a "bars" icon by default', () => {
    const wrapper = mount(FloatingActionButton, {
      localVue
    });
    expect(wrapper.find(FontAwesomeIcon).attributes('data-icon')).toBe('bars');
  });

  it('renders an fa-icon based on prop', () => {
    const wrapper = mount(FloatingActionButton, {
      localVue,
      propsData: {
        icon: 'wrench'
      }
    });
    expect(wrapper.find(FontAwesomeIcon).attributes('data-icon')).toBe('wrench');
  });
});
