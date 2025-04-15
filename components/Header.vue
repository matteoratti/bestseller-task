<template>
  <header class="bg-white shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <h1 class="text-xl font-bold text-gray-900">Shop</h1>
        </div>

        <!-- Main Menu (Categories) -->

        <nav class="hidden md:block">
          <ul class="flex space-x-8">
            <li v-for="category in mainCategories" :key="category.id">
              <a
                href="#"
                @click.prevent="selectCategory(category.id)"
                :class="[
                  'text-sm font-medium transition-colors duration-200 hover:text-primary relative',
                  selectedCategory === category.id
                    ? 'text-primary'
                    : 'text-gray-600',
                ]"
              >
                {{ category.name.en }}
                <transition name="fade-slide-menu">
                  <span
                    v-if="selectedCategory === category.id"
                    class="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                  ></span>
                </transition>
              </a>
            </li>
          </ul>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden rounded-md p-2 text-gray-600 hover:bg-gray-100"
        >
          <Menu v-if="!mobileMenuOpen" class="h-6 w-6" />
          <X v-else class="h-6 w-6" />
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      name="slide-down"
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
    >
      <div v-if="mobileMenuOpen" class="md:hidden">
        <div class="container mx-auto px-4 py-3 space-y-1">
          <a
            v-for="(category, index) in mainCategories"
            :key="category.id"
            href="#"
            @click.prevent="
              selectCategory(category.id);
              mobileMenuOpen = false;
            "
            :class="[
              'block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200',
              selectedCategory === category.id
                ? 'bg-primary/10 text-primary'
                : 'text-gray-600 hover:bg-gray-100',
            ]"
            :style="{ transitionDelay: `${index * 50}ms` }"
          >
            {{ category.name.en }}
          </a>
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Menu, X } from "lucide-vue-next";

defineProps<{
  mainCategories: any[];
  selectedCategory: string | null;
}>();

const emit = defineEmits(["select-category"]);

const mobileMenuOpen = ref(false);

const beforeEnter = (el: Element) => {
  el.classList.add("opacity-0", "-translate-y-5");
};
const enter = (el: Element, done: () => void) => {
  el.classList.remove("opacity-0", "-translate-y-5");
  done();
};
const leave = (el: Element, done: () => void) => {
  el.classList.add("opacity-0", "-translate-y-5");
  done();
};

const selectCategory = (categoryId: string) => {
  emit("select-category", categoryId);
};
</script>

<style scoped>
/* Fade Slide animation */
.fade-slide-menu-enter-active,
.fade-slide-menu-leave-active {
  transition: all 0.3s ease;
}

.fade-slide-menu-enter-from,
.fade-slide-menu-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
