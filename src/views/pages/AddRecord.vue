<template>
  <div class="add-record-page">
    <UIInput
      label="Name Surname"
      :modelValue="`${form.firstName} ${form.lastName}`.trim()"
      @input="
        $event &&
          (([firstName = '', lastName = '']) => {
            form.firstName = firstName;
            form.lastName = lastName;
          })($event.target.value.trim().split(/\s/g))
      "
      :error="[...form.errors.get('firstName'), ...form.errors.get('lastName')].join(' ')"
      placeholder="Enter name and surname"
    />
    <UIInput
      label="City"
      v-model="form.address.city"
      :error="form.errors.get('address.city').join(' ')"
      placeholder="Enter a city"
    />
    <UIInput label="Address" v-model="form.address.detail" type="textarea" placeholder="Enter a address" />
    <UIInput
      label="Email"
      v-model="form.email"
      placeholder="Enter a email (abc@xyz.com)"
      :error="form.errors.get('email').join(' ')"
    />
    <UIButton class="add-record-page-btn" variant="primary" :disabled="!form.isValid()" @click="submit">
      Add Record
    </UIButton>
  </div>
</template>
<script setup>
import useForm from '@/composables/useForm';
import { handleNotification } from '@/utils/notification';
import httpClient from '@/utils/httpClient';

const form = useForm(
    {
      firstName: '',
      lastName: '',
      address: { city: '', detail: '' },
      email: null,
    },
    { firstName: 'required', lastName: 'required', address: { city: 'required' }, email: 'required|email' }
  ),
  submit = async () => {
    if (form.isValid()) {
      if (!form.address.detail || form.address.detail.split(' ').length < 3) {
        return handleNotification({
          title: 'Error while creating record',
          message: 'address detail should contain at least 3 words',
          variant: 'warning',
          closeIn: 0,
        });
      }

      const {
        statusText,
        data: { firstName, lastName },
      } = await httpClient.post('users/add', form.getAttributes());

      return handleNotification({
        title: statusText,
        message: `${firstName} ${lastName} added`,
        variant: 'success',
      });
    }
  };
</script>
