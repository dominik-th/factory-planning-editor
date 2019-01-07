import cyclicInformationState from './cyclic-information.json';

let drafts = {
  cyclicInformation: {
    title: 'cyclic_information_flow',
    state: cyclicInformationState
  }
};

for (let draftId in drafts) {
  let draft = drafts[draftId];
  // prepend vue-i18n category of the draft names
  draft.title = 'example_drafts.' + draft.title;
  // calculate some meta data for the drafts
  draft.numModules = Object.keys(draft.state.planningModules).length;
  draft.numInformations = Object.keys(draft.state.informationTypes).length;
}

export default drafts;
