
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from '@/components/ui/sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface CartItem {
  id: string;
  product_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [cartId, setCartId] = useState<string | null>(null);
  
  // Fetch user's active cart
  const fetchCart = async () => {
    if (!user) return null;
    
    const { data: cart } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', user.id)
      .single();
      
    return cart;
  };

  // Fetch cart items with product details
  const fetchCartItems = async () => {
    if (!cartId) return [];
    
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        quantity,
        product:products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq('cart_id', cartId);

    if (error) throw error;
    return data || [];
  };

  // Query for cart
  const { data: cart } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: fetchCart,
    enabled: !!user,
  });

  useEffect(() => {
    if (cart?.id) {
      setCartId(cart.id);
    }
  }, [cart]);

  // Query for cart items
  const { data: cartItems = [], isLoading } = useQuery({
    queryKey: ['cartItems', cartId],
    queryFn: fetchCartItems,
    enabled: !!cartId,
  });

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (!cartId) throw new Error('No active cart');

      // Check if item exists in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('id, quantity')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .single();

      if (existingItem) {
        // Update quantity if item exists
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id);

        if (error) throw error;
        return;
      }

      // Insert new item if it doesn't exist
      const { error } = await supabase
        .from('cart_items')
        .insert({ cart_id: cartId, product_id: productId, quantity });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems', cartId] });
      toast.success('Đã thêm sản phẩm vào giỏ hàng!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể thêm vào giỏ hàng!');
    },
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (!cartId) throw new Error('No active cart');

      const { data: item } = await supabase
        .from('cart_items')
        .select('id')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .single();

      if (!item) throw new Error('Item not found in cart');

      if (quantity <= 0) {
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', item.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', item.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems', cartId] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể cập nhật giỏ hàng!');
    },
  });

  // Remove from cart mutation
  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!cartId) throw new Error('No active cart');

      const { data: item } = await supabase
        .from('cart_items')
        .select('id')
        .eq('cart_id', cartId)
        .eq('product_id', productId)
        .single();

      if (!item) throw new Error('Item not found in cart');

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', item.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems', cartId] });
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể xóa sản phẩm!');
    },
  });

  // Clear cart mutation
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!cartId) throw new Error('No active cart');

      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cartItems', cartId] });
      toast.success('Đã xóa toàn bộ giỏ hàng!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Không thể xóa giỏ hàng!');
    },
  });

  const addToCart = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      toast.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      return;
    }
    await addToCartMutation.mutateAsync({ productId, quantity });
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    await updateQuantityMutation.mutateAsync({ productId, quantity });
  };

  const removeFromCart = async (productId: string) => {
    await removeFromCartMutation.mutateAsync(productId);
  };

  const clearCart = async () => {
    await clearCartMutation.mutateAsync();
  };

  // Calculate totals
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading: isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        subtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
