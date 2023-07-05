<template>
  <q-card style="max-width: 500vw; width: 62vw; background: #efefef">
    <div v-for="item in itemTache" :key="item.id">
      <q-carousel
        v-model="slide"
        vertical
        transition-prev="slide-down"
        transition-next="slide-up"
        swipeable
        animated
        control-type="flat"
        control-color="primary"
        padding
        arrows
        height="300px"
        class="text-white shadow-1 rounded-borders"
        style="background-color: #efefef"
        next-icon="arrow_drop_down"
        prev-icon="arrow_drop_up"
      >

      
       <q-carousel-slide name="style" class="flex justify-evenly" >
          <q-card-section class="row">
          <div class="text-h4 text-primary q-ml-sm q-mt-lg">
            {{item.titre}} 
          </div>
        </q-card-section>
        
      </q-carousel-slide>

        
    
      <q-card-actions class="q-my-lg" align="left">
        <div class="text-grey q-ml-lg text-h6 bg-negative">
          Nom fonctionnalité
        </div>
      </q-card-actions>
      </q-carousel>
    </div>
  </q-card>
</template>

<script>
import { ref , onMounted} from "vue";
export default {
  props: {
    itemTache: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  setup() {


    return {
      slide: ref("style"),
    };
  },
};
</script>

<style lang="scss" scoped>
</style>