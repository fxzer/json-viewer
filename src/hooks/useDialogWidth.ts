import { useMobile } from '@/hooks'

export function useDialogWidth() {
  const isMobile = useMobile()
  const { width:w } = useWindowSize()
  const width = computed(() => isMobile.value && w.value < 400 ? w.value : 400)
  return width
}
