import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Plant, CartItem } from '@/types/plant';
import { formatCOP } from '@/lib/utils';

interface CartContextType {
  items: CartItem[];
  addToCart: (plant: Plant) => void;
  removeFromCart: (plantId: number) => void;
  updateQuantity: (plantId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  getWhatsAppLink: () => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = useCallback((plant: Plant) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === plant.id);
      if (existing) {
        return prev.map((item) =>
          item.id === plant.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...plant, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((plantId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== plantId));
  }, []);

  const updateQuantity = useCallback((plantId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== plantId));
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === plantId ? { ...item, quantity } : item
      )
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getWhatsAppLink = useCallback(() => {
    const phoneNumber = '573001234567';
    let message = 'Hola Vivero Camuendo! Me gustaria hacer un pedido:\n\n';
    items.forEach((item) => {
      message += `- ${item.name} x${item.quantity} - ${formatCOP(item.price * item.quantity)}\n`;
    });
    message += `\nTotal: ${formatCOP(totalPrice)}\n\nGracias!`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  }, [items, totalPrice]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isOpen,
        setIsOpen,
        getWhatsAppLink,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
