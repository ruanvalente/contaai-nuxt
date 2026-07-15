import { DISCOVERY_CATEGORIES } from "~/types/discovery";

export const useDiscoveryCategories = () => {
  const activeCategory = ref("all");

  const categories = computed(() =>
    DISCOVERY_CATEGORIES.map((cat) => ({
      id: cat.id,
      label: cat.label,
    })),
  );

  function selectCategory(id: string) {
    activeCategory.value = id;
  }

  return {
    categories,
    activeCategory,
    selectCategory,
  };
};
