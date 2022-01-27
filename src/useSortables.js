import { reactive } from 'vue';

const store = {
  state: reactive({
    sortables: []
  }),

  setSortablesAction(element) {
    const idx = this.state.sortables.findIndex((e) => e.id === element.id);
    if (idx > -1) {
      this.state.sortables[idx] = element;
    } else {
      this.state.sortables.push(element);
    }
  },

  removeSortablesAction(element) {
    const idx = this.state.sortables.findIndex((e) => e.id === element.id);
    if (idx > -1) {
      this.state.sortables.splice(idx, 1);
    }
  },

  cleaSortablesAction() {
    this.state.sortables = [];
  }
};

export default store;
