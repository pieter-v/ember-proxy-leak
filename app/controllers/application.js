import { A } from "@ember/array";
import Controller from "@ember/controller";
import EmberObject, { computed } from "@ember/object";
import ObjectProxy from "@ember/object/proxy";

const RUN_LENGTH = 500;

export default Controller.extend({
  init() {
    this._super(...arguments);
    this.set('proxyObjects', A());
    this.set('baseObjects', A());
    const baseObjects = this.baseObjects;
    for (let i = 0; i < RUN_LENGTH; i++) {
      baseObjects.pushObject(EmberObject.create({
        name: `base-${i}`
      }))
    }
  },

  populateCount: 0,
  clearCount: 0,

  clickMessage: computed('populateCount', 'clearCount', function () {
    if (this.populateCount === this.clearCount) {
      return 'Click to populate';
    } else {
      return 'Click to clear and then take a snapshot';
    }
  }),

  populate() {
    const { baseObjects, proxyObjects } = this;
    for (let i = 0; i < RUN_LENGTH; i++) {
      proxyObjects.pushObject(ObjectProxy.create({
        content: baseObjects[i],
        proxyName: `proxy-${i}`
      }))
    }
  },

  clear() {
    this.proxyObjects.forEach(proxyObject => proxyObject.destroy());
    this.proxyObjects.clear();
  },

  actions: {
    run() {
      if (!this.proxyObjects.length) {
        this.populate();
        this.incrementProperty('populateCount');
      } else {
        this.clear();
        this.incrementProperty('clearCount');
      }
    }
  }
})
