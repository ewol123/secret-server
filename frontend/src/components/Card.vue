<template>
  <q-card class="glassy" v-hover-shadow>
    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>

    <q-card-section class="row justify-center">
      <q-icon v-if="icon" :name="icon" size="lg" color="primary" />
      <slot name="body" />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <span>
        <slot name="footer" />
      </span>
    </q-card-section>
  </q-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
  },
});
</script>

