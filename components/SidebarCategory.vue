<template>
  <div>
    <button
      @click="onSelect"
      :class="[
        'cursor-pointer w-full text-left flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all duration-200',
        isSelected
          ? 'bg-primary/10 text-primary scale-102'
          : 'text-gray-600 hover:bg-gray-100',
      ]"
    >
      <div class="flex items-center gap-2">
        <span>{{ category.name.en }}</span>
        <transition name="bounce">
          <CheckCircle v-if="isSelected" class="h-4 w-4" />
        </transition>
      </div>

      <ChevronDown
        v-if="hasChildren"
        :class="[
          'h-4 w-4 transition-transform',
          isExpanded ? 'rotate-180' : '',
        ]"
        @click.stop="toggleExpand"
      />
    </button>

    <!-- subcategories -->
    <transition name="fade">
      <div v-if="isExpanded && hasChildren" class="ml-4 pl-2 mt-1">
        <SidebarCategory
          v-for="subCategory in category.categories"
          :key="subCategory.id"
          :category="subCategory"
          :selectedCategory="selectedCategory"
          @select="onSelectChild"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { CheckCircle, ChevronDown } from "lucide-vue-next";
import type { Category } from "~/types/Category";

const { category, selectedCategory } = defineProps<{
  category: Category;
  selectedCategory: string | null;
}>();

const emit = defineEmits(["select"]);

const isSelected = computed(() => category.id === selectedCategory);
const hasChildren = computed(
  () => category.categories && category.categories.length > 0
);

const isExpanded = ref(false);

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value;
};

const onSelect = () => {
  emit("select", category.id);
};

const onSelectChild = (id: string) => {
  emit("select", id);
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  max-height: 0;
  transform: scaleY(0.9);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  max-height: 500px;
  transform: scaleY(1);
}
</style>
