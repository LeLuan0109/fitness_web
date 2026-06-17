import { useCallback, useState } from "react"

type UseDisclosureReturn = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onOpenChange: (open: boolean) => void
}

export function useDisclosure(defaultOpen: boolean = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onOpenChange = useCallback((open: boolean) => {
    setIsOpen(open)
  }, [])

  return {
    isOpen,
    onOpen,
    onClose,
    onOpenChange,
  }
}
