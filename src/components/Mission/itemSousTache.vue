<template>

    <q-carousel-slide :name="itemSousTache.id" class="column no-wrap flex-center">
      <q-icon name="live_tv" size="56px" />
      <div class="q-mt-md text-center">
      aaaaaaaaaaaaaaaaaaaaaaaaaaaaa  {{ lorem }}
      </div>
    </q-carousel-slide>

</template>

<script>
import { ref, onMounted } from "vue";
export default {
  props: {
    itemSousTache: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup() {
    return {
      lorem:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Itaque voluptatem totam, architecto cupiditate officia rerum, error dignissimos praesentium libero ab nemo.",
    };
  },
};
</script>

<style lang="scss" scoped>
</style>