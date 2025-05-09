export function useDialogWidth(initialWidth = 400) {
  const { width } = useWindowSize()
  const w = computed(() => Math.min(width.value, initialWidth))
  return w
}
