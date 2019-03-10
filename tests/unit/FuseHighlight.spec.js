import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import FuseHighlight from '@/components/FuseHighlight.vue';

const localVue = createLocalVue();

describe('FuseHighlight.vue', () => {
  it('renders the given text', () => {
    const wrapper = shallowMount(FuseHighlight, {
      localVue,
      propsData: {
        result: 'RenderMe'
      }
    });
    expect(wrapper.find('span').text()).toBe('RenderMe');
  });

  it('highlights parts based on indices', () => {
    const wrapper = mount(FuseHighlight, {
      localVue,
      propsData: {
        result: 'Prozessplanung',
        indices: [
          [0, 2],
          [4, 5],
          [7, 10]
        ]
      }
    });
    let highlighted = wrapper.find('span').findAll('b');
    expect(highlighted.at(0).text()).toBe('Pro');
    expect(highlighted.at(1).text()).toBe('es');
    expect(highlighted.at(2).text()).toBe('plan');
  });
});
