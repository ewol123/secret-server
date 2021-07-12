<template>
  <q-dialog v-model="show">
    <q-card class="form-w">
      <q-card-section class="row items-center">
        <q-form @submit="onSubmit" class="q-gutter-md form-w">
          <q-input
            stack-label
            filled
            v-model="form.secret"
            label="Enter your secret..."
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type something',
            ]"
          />

          <q-input
            stack-label
            filled
            type="number"
            v-model.number="form.expireAfterViews"
            label="Enter how many view is valid (at least 1)"
            lazy-rules
            :rules="[
              (val) => val !== null || 'Please type in something',
              (val) => val > 0 || 'Please type a number greater than 0',
            ]"
          />

          <q-input
            stack-label
            filled
            type="number"
            v-model.number="form.expireAfter"
            label="Enter expiration date in minutes (0 if never expires)"
            lazy-rules
            :rules="[
              (val) => val !== null || 'Please type in something',
              (val) => val > -1 || 'Please type a number greater than -1',
            ]"
          />

          <div class="row justify-end">
            <q-btn
              flat
              label="Create"
              type="submit"
              color="primary"
              :loading="loading"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-section>
        <section v-if="status === 201">
          <p class="text-weight-bold">Your hash:</p>
          <span class="wrap">{{ secret.hash }}</span>
          <q-btn flat icon="fas fa-copy" size="sm" @click="copyText(secret.hash)" />
        </section>

        <section v-if="status && status !== 201">
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
import { copyToClipboard } from "quasar";
import { api } from "boot/axios";
export default defineComponent({
  name: "AddSecretDialog",
  props: {
    open: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["open"],
  setup(props, { emit }) {
    const form = ref({
      secret: null,
      expireAfterViews: null,
      expireAfter: null,
    });
    const status = ref(null);
    const secret = ref(null);
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
        const res = await api.post("/api/secret", form.value);
        if (res.status === 201) {
          secret.value = res.data;
        }
        status.value = res.status;
      } catch (error) {
        status.value = error.response?.status || 500;
      } finally {
        loading.value = false;
      }
    };

    const copyText = (text) => {
      copyToClipboard(text)
        .then(() => {
          // success!
        })
        .catch(() => {
          // fail
        });
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
      copyText
    };
  },
});
</script>
