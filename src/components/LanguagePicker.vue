<template>
  <div class="navigation">
    <b-nav-item-dropdown
      :id="componentId"
      :text="$t('i18n.select_language')"
    >
      <b-dropdown-item
        v-for="{ languageTag, countryCode } in languages"
        :key="languageTag"
        :id="languageTag"
        @click="changeLanguage(languageTag)"
      >
        <span :class="`flag-icon flag-icon-${countryCode}`" /> {{ $t(`i18n.${languageTag}`) }}
      </b-dropdown-item>
    </b-nav-item-dropdown>
  </div>
</template>

<script>
export default {
  name: 'LanguagePicker',
  data() {
    return {
      // https://tools.ietf.org/html/rfc5646 for language tags
      // ISO 3166-1-alpha-2 code for countrie codes
      // list of all available languages
      languages: [
        { languageTag: 'en-US', countryCode: 'us' },
        { languageTag: 'de-DE', countryCode: 'de' }
      ]
    };
  },
  computed: {
    componentId: function() {
      // this app wide unique component id is provided by vue itself
      // required for the dropdown menu to have an unique anchorpoint and
      // support multiple instances of this component
      return this._uid.toString();
    }
  },
  methods: {
    changeLanguage(languageTag) {
      this.$i18n.locale = languageTag;
      localStorage.setItem('locale', languageTag);
    }
  }
};
</script>
