import { useMobile } from '@/hooks'

export function useDialogWidth(initialWidth = 400) {
  const isMobile = useMobile()
  const { width } = useWindowSize()
  const w = computed(() => isMobile.value && Math.min(width.value, initialWidth))
  return w
}
