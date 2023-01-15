//json数据仓库
import { useDebouncedRef } from "@/hooks/useDobunceRef";
export const useSearchStore = defineStore({
  id: "search",
  state: () => ({ keyword: useDebouncedRef("") ,focusCount:0}),
});
