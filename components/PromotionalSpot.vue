<template>
  <!-- it is a promotional spot -->
  <div class="overflow-hidden">
    <NuxtImg
      :src="item.image.imageUrl"
      alt="Promotional Spot"
      format="webp"
      placeholder
      sizes="sm:300px md:400px lg:500px"
      class="w-full h-full object-cover"
      :style="{
        objectPosition: `${item.image.focalPoint.x * 100}% ${
          item.image.focalPoint.y * 100
        }%`,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { PromotionalSpot } from "~/types/PromotionalSpot";

const { item } = defineProps<{
  item: PromotionalSpot;
}>();
</script>
