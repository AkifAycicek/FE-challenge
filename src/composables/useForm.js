import { ref, reactive } from '@vue/runtime-core';
import { isObject } from '@vue/shared';
import Validator from 'validatorjs';
import Errors from 'validatorjs/src/errors';
Validator.useLang('en');

/** *
 * @param {Object} attributes form values.
 * @param {Object} rules form rules.
 */
export default (attributes = {}, rules = {}) => {
  const getValue = (attribute, searchkey = 'value') => {
    if (isObject(attribute)) {
      if (attribute[searchkey] !== undefined) {
        return getValue(attribute[searchkey]);
      }
      return Object.entries(attribute).reduce((acc, [key, value]) => {
        acc[key] = getValue(value);
        return acc;
      }, {});
    }
    return attribute;
  };

  const state = reactive({
    ...getValue(attributes),
    rules: reactive(rules),
    errors: ref(new Errors()),
    defaults: ref(attributes),
    fails: () => false,
    isValid: () => {
      const values = state.getAttributes();
      const validation = new Validator(values, state.rules);
      state.errors = validation.errors;
      validation.setAttributeFormatter((attr) => {
        return attr.replace(/\./g, ' ').replace(/[A-Z]/g, (char) => ' ' + char.toLowerCase());
      });
      state.fails = validation.fails;
      return validation.passes();
    },
    getAttributes: () => {
      const stateFormValues = Object.entries(state)
        .filter(([key]) => Object.keys(attributes).includes(key))
        .reduce((acc, [key, value]) => {
          acc[key] = getValue(value);
          return acc;
        }, {});
      return Object.entries(stateFormValues).reduce((acc, [key, attribute]) => {
        acc[key] = getValue(attribute);
        return acc;
      }, {});
    },
    reset(attributes = state.defaults.value) {
      Object.keys(attributes).forEach((key) => {
        state[key].value = attributes[key];
      });
    },
  });

  return state;
};
