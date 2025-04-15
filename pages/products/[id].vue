<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div v-if="product" class="bg-white rounded-lg shadow-sm overflow-hidden">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          <!-- Product Images -->
          <div class="space-y-4">
            <!-- Main Image -->
            <div class="relative bg-gray-100 rounded-lg overflow-hidden">
              <!-- Skeleton Loader -->
              <div
                v-if="isImageLoading"
                class="absolute inset-0 bg-gray-300"
              ></div>

              <!-- big Image -->
              <transition name="fade" mode="out-in">
                <NuxtImg
                  v-if="selectedImage"
                  :key="selectedImage"
                  :src="selectedImage"
                  :alt="product?.name?.dk || 'Product Image'"
                  format="webp"
                  placeholder="../placeholder-card.jpg"
                  sizes="50pxsm:300px md:400px lg:500px"
                  class="object-cover"
                  @load="isImageLoading = false"
                />
              </transition>

              <!-- Image Navigation Arrows -->
              <button
                @click="selectImage(currentImageIndex - 1)"
                class="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 text-gray-800 hover:bg-white transition-colors"
                :class="{
                  'opacity-50 cursor-not-allowed': currentImageIndex === 0,
                }"
                :disabled="currentImageIndex === 0"
              >
                <ChevronLeft class="w-5 h-5" />
              </button>

              <button
                @click="selectImage(currentImageIndex + 1)"
                class="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1.5 text-gray-800 hover:bg-white transition-colors"
                :class="{
                  'opacity-50 cursor-not-allowed':
                    currentImageIndex === productImages.length - 1,
                }"
                :disabled="currentImageIndex === productImages.length - 1"
              >
                <ChevronRight class="w-5 h-5" />
              </button>
            </div>

            <!-- Thumbnails -->
            <div class="flex space-x-2 overflow-x-auto pb-2">
              <button
                v-for="(image, index) in productImages"
                :key="index"
                @click="selectImage(index)"
                class="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all duration-200"
                :class="
                  currentImageIndex === index
                    ? 'border-primary'
                    : 'border-transparent hover:border-gray-300'
                "
              >
                <NuxtImg
                  :src="image"
                  :alt="`${product.name.dk} - View ${index + 1}`"
                  format="webp"
                  placeholder="../placeholder-card.jpg"
                  sizes="50pxsm:300px md:400px lg:500px"
                  class="object-cover"
                />
              </button>
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-6">
            <div>
              <h1 class="text-2xl font-bold text-gray-900">
                {{ product.name.dk || product.name.en }}
              </h1>
            </div>

            <div class="text-3xl font-bold text-gray-900">
              ${{ product.price.toFixed(2) }}
            </div>

            <!-- Original Selection -->
            <div v-if="product.color">
              <h2 class="text-sm font-medium text-gray-900 mb-3">Original</h2>
              <div class="flex flex-wrap gap-3">
                <button
                  :key="product.color"
                  @click="(isOriginalSelected = true), (selectedVariant = null)"
                  class="cursor-pointer relative w-10 h-10 rounded-full border-2 transition-all duration-200 p-0.5"
                  :class="
                    isOriginalSelected ? 'border-primary' : 'border-gray-300'
                  "
                  :aria-label="`Select ${product.color} color`"
                >
                  <span
                    class="block w-full h-full rounded-full"
                    :style="{
                      backgroundColor:
                        product.color === 'Potting Soil'
                          ? '#54392d'
                          : product.color,
                    }"
                  ></span>
                  <span
                    v-if="isOriginalSelected"
                    class="absolute -right-1 -top-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center"
                  >
                    <Check class="w-3 h-3" />
                  </span>
                </button>
              </div>
            </div>

            <!-- Variant Selection -->
            <div v-if="product.variant">
              <h2 class="text-sm font-medium text-gray-900 mb-3">Variants</h2>
              <div class="flex flex-wrap gap-3">
                <button
                  v-for="variant in product.variant"
                  :key="variant.color"
                  @click="selectedVariant = variant.color"
                  class="cursor-pointer relative w-10 h-10 rounded-full border-2 transition-all duration-200 p-0.5"
                  :class="
                    selectedVariant === variant.color
                      ? 'border-primary'
                      : 'border-gray-300'
                  "
                  :aria-label="`Select ${variant.color} color`"
                >
                  <span
                    class="block w-full h-full rounded-full"
                    :style="{
                      backgroundColor:
                        variant.color === 'Potting Soil'
                          ? '#54392d'
                          : toCamelCase(variant.color),
                    }"
                  ></span>
                  <span
                    v-if="selectedVariant === variant.color"
                    class="absolute -right-1 -top-1 w-5 h-5 bg-primary text-white rounded-full flex items-center justify-center"
                  >
                    <Check class="w-3 h-3" />
                  </span>
                </button>
              </div>
            </div>

            <!-- Size Selection -->
            <div>
              <h2 class="text-sm font-medium text-gray-900 mb-3">Size</h2>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="size in productSizes"
                  :key="size"
                  @click="selectedSize = size"
                  class="cursor-pointer min-w-[3rem] py-2 px-3 text-sm font-medium rounded-md border transition-all duration-200"
                  :class="
                    selectedSize === size
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  "
                >
                  {{ size }}
                </button>
              </div>
            </div>

            <!-- Quantity -->
            <div>
              <h2 class="text-sm font-medium text-gray-900 mb-3">Quantity</h2>
              <div
                class="flex items-center border border-gray-300 rounded-md w-32"
              >
                <button
                  @click="decrementQuantity"
                  class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900"
                  :disabled="quantity <= 1"
                  :class="{ 'opacity-50 cursor-not-allowed': quantity <= 1 }"
                >
                  <Minus class="cursor-pointer w-4 h-4" />
                </button>
                <input
                  type="number"
                  v-model="quantity"
                  min="1"
                  class="w-12 h-10 text-center border-0 focus:ring-0 text-gray-900"
                />
                <button
                  @click="incrementQuantity"
                  class="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900"
                >
                  <Plus class="cursor-pointer w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Add to Cart -->
            <div class="flex flex-col sm:flex-row gap-4">
              <button
                @click="addToCart"
                class="cursor-pointer flex-1 bg-primary text-white py-3 px-6 rounded-md font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                :class="{
                  'opacity-50 cursor-not-allowed': !isProductSelectable,
                }"
                :disabled="!isProductSelectable"
              >
                <ShoppingCart class="w-5 h-5 mr-2" />
                Add to Cart
              </button>

              <button
                @click="toggleWishlist"
                class="flex-shrink-0 border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                :class="{ 'text-red-500': isInWishlist }"
              >
                <Heart
                  class="cursor-pointer w-5 h-5"
                  :fill="isInWishlist ? 'currentColor' : 'none'"
                />
              </button>
            </div>

            <!-- Product Details -->
            <div class="border-t border-gray-200 pt-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="(detail, index) in productDetails"
                  :key="index"
                  class="flex"
                >
                  <span class="text-sm text-gray-500 w-24 flex-shrink-0"
                    >{{ detail.name }}:</span
                  >
                  <span class="text-sm text-gray-900">{{ detail.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center text-gray-500">
        Loading or Product not found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useFetch } from "nuxt/app";
import { ref, computed } from "vue";
import {
  Check,
  Heart,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-vue-next";
import type { Product } from "~/types/Product";

const route = useRoute();
const id = route.params.id;

const { data: product, error } = await useFetch<Product>(`/api/products/${id}`);

const quantity = ref(1);
const selectedSize = ref<string | number | null>(null);
const currentImageIndex = ref(0);
const isInWishlist = ref(false);
const selectedVariant = ref<string | null>(null);
const isOriginalSelected = ref<boolean>(true);
const isImageLoading = ref(true);

const selectedImage = computed(() => {
  if (!selectedVariant.value) {
    if (product.value?.images === undefined) {
      return "/placeholder.png";
    }
    return product.value?.images[currentImageIndex.value] || "";
  }
  const variant = product.value?.variant?.find(
    (v) => v.color === selectedVariant.value
  );

  if (variant?.images === undefined) {
    return product.value?.images[currentImageIndex.value] || "";
  }
  return variant?.images[currentImageIndex.value] || "";
});

// changes sizes based on variant or original selection
const productSizes = computed(() => {
  if (!selectedVariant.value) {
    return product.value?.size || [];
  }
  const variant = product.value?.variant?.find(
    (v) => v.color === selectedVariant.value
  );
  return variant?.size || [];
});

// changes images set based on variant or original selection
const productImages = computed(() => {
  if (!selectedVariant.value) {
    return product.value?.images || [];
  }

  isOriginalSelected.value = false;
  const variant = product.value?.variant?.find(
    (v) => v.color === selectedVariant.value
  );

  if (variant?.images === undefined) {
    return product.value?.images || [];
  }

  return variant?.images;
});

// changes product stock based on variant or original selection
const productStock = computed(() => {
  if (!selectedVariant.value) {
    return product.value?.stock || 0;
  }
  const variant = product.value?.variant?.find(
    (v) => v.color === selectedVariant.value
  );
  return variant?.stock || 0;
});

const toCamelCase = (str: string): string => {
  return str
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (index === 0) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join("");
};

const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const selectImage = (index: number) => {
  currentImageIndex.value = index;
};

const addToCart = () => {
  if (!selectedSize.value) {
    alert("Please select a size first!");
    return;
  }
  alert(
    `Added ${product.value?.name.dk} (size: ${selectedSize.value}) x${quantity.value} to cart!`
  );
};

const toggleWishlist = () => {
  isInWishlist.value = !isInWishlist.value;
};

const isProductSelectable = computed(() => !!selectedSize.value);

const productDetails = computed(() => [
  { name: "Brand", value: product.value?.brand || "Unknown" },
  { name: "Stock", value: productStock || "Unknown" },
]);
</script>

<style scoped>
/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Fade Slide animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Fade Scale animation */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Slide Down animation */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>
