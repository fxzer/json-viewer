export const useSearchStore = defineStore('search',
() =>{
  const keyword = ref('')
  const focusCount = ref(0)
  return { keyword, focusCount }
})
