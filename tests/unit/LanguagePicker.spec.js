import { shallowMount, mount, createLocalVue } from '@vue/test-utils';
import VueI18n from 'vue-i18n';
import BootstrapVue from 'bootstrap-vue';
import messages from '@/i18n';
import LanguagePicker from '@/components/LanguagePicker.vue';

const localVue = createLocalVue();
localVue.use(VueI18n);
localVue.use(BootstrapVue);

const i18n = new VueI18n({
  locale: 'en-US',
  messages
});

describe('LanguagePicker.vue', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders in english by default', () => {
    const wrapper = shallowMount(LanguagePicker, {
      i18n,
      localVue
    });
    expect(wrapper.find('#en-US').text()).toBe('English');
  });

  it('should change change language', () => {
    const wrapper = mount(LanguagePicker, {
      i18n,
      localVue
    });
    wrapper.find('#de-DE').trigger('click');
    expect(wrapper.find('#en-US').text()).toBe('Englisch');
  });

  it('should put selected locale to localstorage', () => {
    const locale = 'de-DE';
    const wrapper = shallowMount(LanguagePicker, {
      i18n,
      localVue
    });
    expect(localStorage.getItem('locale')).not.toBe(locale);
    wrapper.vm.changeLanguage(locale);
    expect(localStorage.getItem('locale')).toBe(locale);
  });
});
