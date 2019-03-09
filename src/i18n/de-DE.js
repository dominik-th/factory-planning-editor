export default {
  generic: {
    cancel: 'Abbrechen',
    save: 'Speichern',
    edit: 'Editieren',
    filter: 'Filter...',
    close: 'Schließen',
    import: 'Importieren',
    select_a_file: 'Wähle eine Datei aus...',
    browse_files: 'Durchsuchen',
    save_to_file: 'Speichern unter...',
    or: 'Oder'
  },
  navbar: {
    import_json: 'JSON importieren',
    export_json: 'JSON exportieren',
    export_excel: 'Excel exportieren'
  },
  modal: {
    import: {
      title: 'Planung importieren',
      paste_json: 'JSON hier einfügen...',
      upload_json_file: 'JSON-Datei hochladen:',
      select_example: 'Beispielplanung auswählen:',
      select_example_placeholder: '-- Bitte eine Planung auswählen --'
    },
    export: {
      title: 'Planung exportieren',
      doubleclick_copy: 'Doppelklick zum Kopieren!',
      copied: 'Kopiert!'
    },
    informations: {
      title: 'Informationstypen',
      in_use: 'In Verwendung',
      potential_global: 'Globale Informationen',
      unused: 'Nicht in Verwendung'
    },
    information_picker_in: 'Eingangsinformationen suchen...',
    information_picker_out: 'Ausgangsinformationen suchen...',
    module_placeholder: 'Modulname',
    create_module: 'Neues Planungsmodul erstellen',
    edit_module: 'Planungsmodul editieren',
    in_information:
      'Keine Eingangsinformationen | 1 Eingabeinformation | {count} Eingangsinformationen',
    out_information:
      'Keine Ausgangsinformationen | 1 Ausgangsinformation | {count} Ausgangsinformationen',
    no_in_information: 'Füge dem Modul Eingangsinformationen hinzu!',
    no_out_information: 'Füge dem Modul Ausgangsinformationen hinzu!'
  },
  attributes: {
    num_employees: 'Anzahl Mitarbeiter:',
    cost: 'Kosten:',
    duration: 'Dauer:',
    custom: 'Benutzerdefiniert {0}:',
    description: 'Beschreibung',
    value: 'Wert',
    delete: 'Modul löschen'
  },
  i18n: {
    select_language: 'Sprache auswählen',
    'en-US': 'Englisch',
    'de-DE': 'Deutsch'
  },
  example_drafts: {
    meta: {
      num_planningmodules:
        'Keine Planungsmodule | 1 Planungsmodul | {count} Planungsmodule',
      num_informations:
        'Keine Informationstypen | 1 Informationstyp | {count} Informationstypen'
    },
    cyclic_information_flow: 'Zyklischer Informationsfluss'
  },
  warning: {
    empty_module_name:
      'Der Name des Planungsmoduls darf keine leere Zeichenfolge sein!',
    empty_information_type:
      'Der Informationstyp darf keine leere Zeichenfolge sein!',
    no_module_selected: 'Es wurde kein Planungsmodul ausgewählt!',
    not_yet_implemented: 'Diese Funktion wurde noch nicht implementiert.'
  },
  error: {
    json_invalid: 'Der eingegebene JSON String ist ungültig!',
    mime_mismatch: 'Die Datei weißt einen falschen Content-Typ auf!'
  }
};
