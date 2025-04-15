<template>
  <div class="min-h-screen bg-gray-50">
    <Header
      :mainCategories="mainCategories"
      :selectedCategory="selectedCategory"
      @select-category="selectCategory"
    />

    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar -->
        <aside class="w-full md:w-64 shrink-0">
          <p v-if="categoriesStatus === 'pending'">Loading...</p>
          <p v-if="categoriesError" class="text-red-500">
            Failed to load categories. Please try again later.
          </p>
          <div v-if="categoriesData" class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-medium mb-4">Categories</h2>

            <div class="space-y-1">
              <button
                @click="selectedCategory = null"
                :class="[
                  'cursor-pointer w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
                  selectedCategory === null
                    ? 'bg-primary/10 text-primary scale-102'
                    : 'text-gray-600 hover:bg-gray-100',
                ]"
              >
                <div class="flex items-center">
                  <span>All Products</span>
                  <transition name="bounce">
                    <CheckCircle
                      v-if="selectedCategory === null"
                      class="ml-2 h-4 w-4"
                    />
                  </transition>
                </div>
              </button>

              <SidebarCategory
                v-for="category in categoriesData.categories"
                :key="category.id"
                :category="category"
                :selectedCategory="selectedCategory"
                @select="selectCategory"
              />
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1">
          <!-- Products + promotional spots Grid -->
          <transition-group
            tag="div"
            name="products-list"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto"
            v-if="productsData"
          >
            <p
              v-if="filteredProducts.length === 0"
              class="text-center text-gray-500"
            >
              No products found.
            </p>
            <div
              v-for="(item, index) in productsAndPromotions"
              :key="index"
              :class="[
                'bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300',
                getItemSizeClass(item),
              ]"
            >
              <!-- it is a product-->
              <ProductCard
                v-if="'price' in item"
                :item="item"
                :lastAddedProductId="lastAddedProductId"
                @addToCart="addToCart"
              />

              <!-- it is a promotional spot -->
              <PromotionalSpot v-else :item="item" />
            </div>
          </transition-group>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { Menu, X, ShoppingBag, CheckCircle, RefreshCw } from "lucide-vue-next";
import type { Category } from "~/types/Category";
import type { Product } from "~/types/Product";
import type { PromotionalSpot } from "~/types/PromotionalSpot";

type ProductOrPromotion = Product | PromotionalSpot;

const mobileMenuOpen = ref(false);
const lastAddedProductId = ref<string | null>(null);

// DATA FETCHING
const {
  data: categoriesData,
  status: categoriesStatus,
  error: categoriesError,
} = await useFetch<{ categories: Category[] }>("/api/categories");

const {
  data: productsData,
  status: productDataStatus,
  error: productsDataErrors,
} = await useFetch<Product[]>("/api/products");

const {
  data: promotionalSpotsData,
  status: promotionalSpotsStatus,
  error: promotionalSpotsError,
} = await useFetch<PromotionalSpot[]>("/api/promotional-spots");

const filteredProducts = computed(() => {
  // if no category is selected, return all products
  if (!selectedCategory.value) {
    return productsData.value ?? [];
  }

  return (productsData.value ?? []).filter((product) =>
    product.categories.includes(selectedCategory.value as string)
  );
});

// SELECTED CATEGORY
const selectedCategory = ref<string | null>(null);

const selectCategory = (categoryId: string) => {
  selectedCategory.value = categoryId;
};

// get main categories
const mainCategories = computed(() => {
  const categories = categoriesData.value?.categories ?? [];

  const flatCategories = [...categories];

  for (const category of categories) {
    if (category.categories) {
      flatCategories.push(...category.categories);
    }
  }

  return flatCategories.filter((category) =>
    ["kids", "adults", "men", "women"].includes(category.id)
  );
});

// Add to cart
const addToCart = (product: Product) => {
  lastAddedProductId.value = product.id;

  setTimeout(() => {
    lastAddedProductId.value = null;
  }, 2000);
};

// mixing promotional spots and products
const productsAndPromotions = computed<ProductOrPromotion[]>(() => {
  const products = filteredProducts.value ?? [];
  const spots = promotionalSpotsData.value ?? [];

  const mixed: ProductOrPromotion[] = [...products];

  for (const spot of spots) {
    if (spot.position <= mixed.length) {
      mixed.splice(spot.position, 0, spot);
    }
  }

  return mixed;
});

const getItemSizeClass = (item: ProductOrPromotion) => {
  if (!("type" in item)) return "";

  if (item.type === "2x1") {
    return "col-span-2 ";
  } else if (item.type === "2x2") {
    return "col-span-2 row-span-2";
  } else {
    return " ";
  }
};

// Animations for mobile menu
const beforeEnter = (el: any) => {
  el.style.opacity = 0;
  el.style.height = "0px";
  el.style.overflow = "hidden";
};

const enter = (el: any, done: any) => {
  const height = el.scrollHeight;
  el.style.transition = "all 0.3s ease";

  requestAnimationFrame(() => {
    el.style.height = `${height}px`;
    el.style.opacity = 1;

    el.addEventListener("transitionend", done, { once: true });
  });
};

const leave = (el: any, done: any) => {
  el.style.transition = "all 0.3s ease";
  el.style.height = "0px";
  el.style.opacity = 0;

  el.addEventListener("transitionend", done, { once: true });
};
</script>

<style scoped>
/* Animation for product list */
.products-list-move,
.products-list-enter-active,
.products-list-leave-active {
  transition: all 0.5s ease;
}

.products-list-enter-from,
.products-list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

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

/* Animation for elements */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
