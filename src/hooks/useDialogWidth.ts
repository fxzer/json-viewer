import { useMobile } from '@/hooks'

export function useDialogWidth(initialWidth = 400) {
  const isMobile = useMobile()
  const { width: w } = useWindowSize()
  const width = computed(() => isMobile.value && w.value < initialWidth ? w.value : initialWidth)
  return width
}
