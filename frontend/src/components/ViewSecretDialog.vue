<template>
  <q-dialog v-model="show">
    <q-card class="form-w">
      <q-card-section class="row items-center">
        <q-form @submit="onSubmit" class="q-gutter-md form-w">
          <q-input
            stack-label
            filled
            v-model="form.hash"
            label="Enter your hash..."
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <div class="row justify-end">
            <q-btn
              flat
              label="View"
              type="submit"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>
      <q-card-section>
        <section v-if="status === 200">
          <q-list bordered padding>
            <q-item>
              <q-item-section>
                <q-item-label overline>Your secret</q-item-label>
                <q-item-label caption>{{ secret.secretText }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Remaining views</q-item-label>
                <q-item-label caption>{{ secret.remainingViews }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Expires at</q-item-label>
                <q-item-label caption>{{ secret.expiresAt }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label overline>Created at</q-item-label>
                <q-item-label caption>{{ secret.createdAt }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </section>

        <section v-if="status === 404">
          <q-banner dense rounded class="bg-warning">
            Ooops...the secret is not found, or maybe it's expired
          </q-banner>
        </section>
        <section v-if="status && ![404, 200].includes(status)">
          <q-banner dense rounded class="bg-warning">
            Ooops...you broke it, are you sure you filled everything correctly?
          </q-banner>
        </section>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, computed } from "vue";
import { api } from "boot/axios";

export default defineComponent({
  name: "ViewSecretDialog",
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["open"],
  setup(props, { emit }) {
    const form = ref({
      hash: null,
    });
    const status = ref(null);
    const secret = ref({});
    const loading = ref(false);

    const show = computed({
      get() {
        return props.open;
      },
      set(newValue) {
        emit("open", newValue);
      },
    });

    const onSubmit = async () => {
      try {
        loading.value = true;
        const res = await api.get(`/api/secret/${form.value.hash}`);
        if (res.status === 200) {
          const data = res.data;
          secret.value = {
            ...data,
            createdAt: new Date(data.createdAt).toLocaleString(),
            expiresAt: data.expiresAt
              ? new Date(data.expiresAt).toLocaleString()
              : null,
          };
        }
        status.value = res.status;
      } catch (error) {
        status.value = error.response?.status || 500;
      } finally {
        loading.value = false;
      }
    };

    return {
      //data
      form,
      status,
      secret,
      loading,
      //computed
      show,
      //methods
      onSubmit,
    };
  },
});
</script>
