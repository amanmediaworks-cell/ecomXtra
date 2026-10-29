import { createContext, useContext } from 'react'

export const ContactModalContext = createContext(null)

export function useContactModal() {
  const context = useContext(ContactModalContext)
  if (!context) throw new Error('useContactModal must be used within ContactModalProvider')
  return context
}
