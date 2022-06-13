import { handleNotification } from '@/utils/notification.js';
import httpClient from '@/utils/httpClient';
import { ref } from '@vue/runtime-core';

export default () => {
  const state = {
    data: ref([]),
    pagination: ref({
      limit: 5,
      skip: 0,
      total: 1,
      maxVisible: 3,
    }),
    loading: ref(false),

    /** *
     * @param {Object} params Query parammeters.
     * @returns {Object} Return Users fetch response.
     */
    fetchUsers: async (params = state.pagination.value) => {
      try {
        !params.q && (params.q = '');
        state.loading.value = true;

        const res = await httpClient.get('users/search', { params });
        return res;
      } catch (error) {
        handleNotification(error);
      } finally {
        state.loading.value = false;
      }
    },

    /** *
     * @param {Object} params Query parammeters.
     */
    loadUsers: async (params = state.pagination.value) => {
      try {
        params.limit = params.limit || state.pagination.value.limit;
        state.pagination.value.limit = params.limit;

        const res = await state.fetchUsers(params);
        const { users, total, skip } = res.data;

        state.data.value = users;
        state.pagination.value.skip = skip;
        state.pagination.value.total = total;
        return res;
      } catch (error) {
        handleNotification(error);
      } finally {
        state.loading.value = false;
      }
    },
  };

  return { ...state };
};
