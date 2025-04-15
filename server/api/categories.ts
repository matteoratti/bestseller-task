import data from "@/assets/data.json";

export default defineEventHandler(() => {
  return data.categories;
});
