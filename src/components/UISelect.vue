<template>
  <UIButton class="selectbox" :id="state.id" :size="size" @click="clickEvent" :variant="variant">
    <template #icon v-if="$slots.icon">
      <slot name="icon" />
    </template>
    {{ state.displayLabel }}
    <span
      class="selectbox-dropdown"
      :id="state.id + '_subMenu'"
      :ref="(el) => el && ((options = el.children), (subMenu = el))"
    >
      <option :value="null" v-text="label" :disabled="true" />
      <option v-for="(item, index) in items" :key="index" :value="item.value" v-text="item.text" />
      <slot />
    </span>
  </UIButton>
</template>

<script setup>
import { ref, computed, reactive, defineProps, defineEmits, onMounted } from '@vue/runtime-core';
import { createPopper } from '@popperjs/core/lib/popper-lite';
import flip from '@popperjs/core/lib/modifiers/flip';

const emit = defineEmits(['update:modelValue', 'toggle', 'change']);

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: null,
  },
  variant: {
    type: String,
    default: null,
  },
  size: {
    type: String,
    default: 'md',
  },
  label: {
    type: String,
    default: null,
  },
  items: {
    type: Array,
    default: () => [], // [ { value: null, text: null } ]
  },
});

const options = ref([]);
const subMenu = ref();

let state = reactive({
  id: '_' + Math.random().toString(16).substring(2, 10),
  show: false,
  defaultLabel: 'Select',
  displayLabel: computed(() => {
    let label = null;
    if (props.label) {
      label = props.label;
    }
    if (options.value) {
      const optionList = [...options.value];
      const selected = optionList.find((option) => option.value == props.modelValue);
      if (selected) {
        label = selected.text;
      }
      optionList.map((option) => (option.selected = option.value == props.modelValue));
    }
    return label ? label : state.defaultLabel;
  }),
  popper: null,
});

const clickEvent = (e) => {
  const button = document.querySelector(`#${state.id} button`);
  if (!button.contains(e.target)) {
    return toggleSelect(false);
  }
  if (!state.show) toggleSelect(true);
};

const toggleSelect = (value = !state.show) => {
  state.show = value;
  value ? show() : hide();
  emit('toggle', state.show);

  // Enable/Disable popper event listeners
  state.popper.setOptions((options) => ({
    ...options,
    modifiers: [...options.modifiers, { name: 'eventListeners', enabled: value }],
  }));
};

const show = () => {
  subMenu.value.setAttribute('show', '');
  state.popper.update();

  // Listen for click outside
  document.body.addEventListener('mouseup', clickEvent);
};

const hide = () => {
  subMenu.value.removeAttribute('show');

  document.body.removeEventListener('mouseup', clickEvent);
};

const optionClickEvent = async (e) => {
  if (props.modelValue == e.target.value) {
    await emit('update:modelValue', null);
  } else {
    await emit('update:modelValue', e.target.value);
  }
  await emit('change', e);
};

const initSelectOptions = (options) => {
  if (options) {
    [...options].forEach((option) => {
      option.addEventListener('click', optionClickEvent);
      return option;
    });
  }
};

onMounted(() => {
  initSelectOptions(options.value);

  const selectbox = document.getElementById(state.id);

  const popper = createPopper(selectbox, subMenu.value, {
    placement: 'bottom-start',
    strategy: 'fixed',
    modifiers: [flip],
  });
  state.popper = popper;
});
</script>
