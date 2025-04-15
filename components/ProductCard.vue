<template>
  <!-- it is a product-->
  <div
    @click="goToProductPage(item.id)"
    class="cursor-pointer flex flex-col justify-between h-full"
  >
    <div class="overflow-hidden max-h-[414px]">
      <NuxtImg
        :src="item.images?.[0] || '/placeholder.png'"
        :alt="item.name.en"
        format="webp"
        placeholder
        sizes="50pxsm:300px md:400px lg:500px"
        class="transition-transform duration-700 hover:scale-110"
      />
    </div>
    <div class="p-4">
      <h3 class="text-lg font-medium text-gray-900">
        {{ item.name.en || item.name.dk }}
      </h3>
      <div class="mt-3 flex items-center justify-between">
        <span class="text-lg font-bold text-gray-900">
          ${{ item.price.toFixed(2) }}
        </span>
        <button
          v-if="
            (typeof item.stock === 'number' && item.stock > 0) ||
            typeof item.stock === 'string'
          "
          class="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-200 hover:scale-105"
          @click="addToCart(item)"
        >
          <span v-if="lastAddedProductId !== item.id">Add to Cart</span>
          <span v-else class="flex items-center">
            <CheckCircle class="h-4 w-4 mr-1" />
            Added
          </span>
        </button>
        <span class="bg-red-500 p-2 text-sm text-white" v-else>
          out of stock
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from "~/types/Product";
import { CheckCircle } from "lucide-vue-next";
import { useRouter } from "vue-router";

const router = useRouter();
const emit = defineEmits(["addToCart"]);

const goToProductPage = (id: string) => {
  router.push(`/products/${id}`);
};

const { item, lastAddedProductId } = defineProps<{
  item: Product;
  lastAddedProductId: string | null;
}>();

const addToCart = (item: Product) => {
  emit("addToCart", item);
};
</script>
