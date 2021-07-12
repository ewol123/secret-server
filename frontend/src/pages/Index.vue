<template>
  <q-page class="row justify-center items-center">
    <div class="col-12 col-sm-4 q-pa-sm">
      <card
        class="cursor-pointer"
        title="Create"
        icon="fa fa-plus"
        imgSrc="~assets/new_secret.svg"
        @click="addSecretDialogActive = true"
      >
        <template v-slot:body>
          <q-img
            src="~assets/new_secret.svg"
            ratio="1"
            fit="contain"
          />
        </template>

        <template v-slot:footer>
          <b class="text-black"> Create </b>
          <span class="text-black">a new secret</span>
        </template>
      </card>
    </div>
    <div class="col-12 col-sm-4 q-pa-sm">
      <card
        class="cursor-pointer"
        title="View"
        icon="fa fa-glasses"
        imgSrc="~assets/view_secret.svg"
        @click="viewSecretDialogActive = true"
      >
        <template v-slot:body>
          <q-separator />
          <q-img
            src="~assets/view_secret.svg"
            ratio="1"
            fit="contain"
          />
        </template>

        <template v-slot:footer>
          <b class="text-black"> View </b>
          <span class="text-black">your secrets</span>
        </template>
      </card>
    </div>

    <AddSecretDialog
      :open="addSecretDialogActive"
      @open="(val) => (addSecretDialogActive = val)"
    />

    <ViewSecretDialog
      :open="viewSecretDialogActive"
      @open="(val) => (viewSecretDialogActive = val)"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useMeta } from "quasar";

import Card from "../components/Card";
import AddSecretDialog from "../components/AddSecretDialog";
import ViewSecretDialog from "../components/ViewSecretDialog";

const metaData = {
  title: "Awesome secrets",
};

export default defineComponent({
  name: "PageIndex",
  components: {
    Card,
    AddSecretDialog,
    ViewSecretDialog,
  },
  setup() {
    useMeta(metaData);

    const addSecretDialogActive = ref(false);
    const viewSecretDialogActive = ref(false);

    return {
      addSecretDialogActive,
      viewSecretDialogActive,
    };
  },
});
</script>
