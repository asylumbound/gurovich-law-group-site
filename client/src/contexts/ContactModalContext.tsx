/**
 * Contact Modal Context
 * Gurovich Law Group
 * 
 * Global context to manage the contact modal state across the entire application
 */

import { createContext, useContext, useState, ReactNode } from "react";
import ContactModal from "@/components/ContactModal";

interface ContactModalContextType {
  openContactModal: () => void;
  closeContactModal: () => void;
  isOpen: boolean;
}

const ContactModalContext = createContext<ContactModalContextType | undefined>(undefined);

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openContactModal = () => setIsOpen(true);
  const closeContactModal = () => setIsOpen(false);

  return (
    <ContactModalContext.Provider value={{ openContactModal, closeContactModal, isOpen }}>
      {children}
      <ContactModal open={isOpen} onOpenChange={setIsOpen} />
    </ContactModalContext.Provider>
  );
}

export function useContactModal() {
  const context = useContext(ContactModalContext);
  if (context === undefined) {
    throw new Error("useContactModal must be used within a ContactModalProvider");
  }
  return context;
}
