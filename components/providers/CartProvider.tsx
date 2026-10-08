"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  MAX_QUANTITY,
  getProduct,
  getShippingMethod,
  shippingFee,
  type CatalogProduct,
  type ShippingMethodId,
} from "@/lib/catalog";

/**
 * The demo store's whole state: the bag, the last placed order, and the
 * little bit of UI state that connects "add to bag" to the desktop mini-bag
 * flyout and the mobile "added" toast.
 *
 * There is no backend. The bag and the last order are saved in the browser's
 * localStorage so they survive a refresh. Nothing is read from storage until
 * after mount (`hydrated`), so the server render and the client's first
 * render always match — screens should wait for `hydrated` before showing
 * anything that depends on the bag.
 */

const STORAGE_KEY = "beats-demo-store-v1";

interface StoredItem {
  slug: string;
  quantity: number;
}

export interface CartLine {
  product: CatalogProduct;
  quantity: number;
}

export interface OrderLine {
  slug: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  delivery: ShippingMethodId;
}

export interface Order {
  id: string;
  /** ISO timestamp. */
  placedAt: string;
  lines: OrderLine[];
  details: CheckoutDetails;
  deliveryLabel: string;
  deliveryMinDays: number;
  deliveryMaxDays: number;
  subtotal: number;
  shipping: number;
  total: number;
}

interface AddedSignal {
  slug: string;
  at: number;
}

interface CartContextValue {
  /** False until the saved bag has been read from the browser. */
  hydrated: boolean;
  lines: CartLine[];
  /** Total number of units in the bag. */
  count: number;
  subtotal: number;
  /** Pass `silent` to skip the flyout / toast (e.g. for "Buy now"). */
  addItem: (slug: string, quantity?: number, options?: { silent?: boolean }) => void;
  setQuantity: (slug: string, quantity: number) => void;
  removeItem: (slug: string) => void;
  /** The most recent order, kept for the confirmation screen. */
  order: Order | null;
  placeOrder: (details: CheckoutDetails) => Order;
  /** Changes every time something is added, so UI can react to "an add just happened". */
  addedSignal: AddedSignal | null;
  miniBagOpen: boolean;
  setMiniBagOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside <CartProvider>.");
  return context;
}

function isOrder(value: unknown): value is Order {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Partial<Order>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.placedAt === "string" &&
    Array.isArray(candidate.lines) &&
    typeof candidate.details === "object" &&
    candidate.details !== null &&
    typeof candidate.total === "number"
  );
}

function readStoredState(): { items: StoredItem[]; order: Order | null } {
  const empty = { items: [], order: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return empty;

    const { items, order } = parsed as { items?: unknown; order?: unknown };
    const cleanItems = Array.isArray(items)
      ? items.flatMap((entry): StoredItem[] => {
          if (typeof entry !== "object" || entry === null) return [];
          const { slug, quantity } = entry as { slug?: unknown; quantity?: unknown };
          if (typeof slug !== "string" || typeof quantity !== "number" || !getProduct(slug)) return [];
          return [{ slug, quantity: Math.min(Math.max(Math.floor(quantity), 1), MAX_QUANTITY) }];
        })
      : [];

    return { items: cleanItems, order: isOrder(order) ? order : null };
  } catch {
    return empty;
  }
}

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<StoredItem[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [addedSignal, setAddedSignal] = useState<AddedSignal | null>(null);
  const [miniBagOpen, setMiniBagOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredState();
    setItems(stored.items);
    setOrder(stored.order);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, order }));
    } catch {
      // Storage can be full or blocked (private mode) — the bag then simply
      // lasts for this visit only.
    }
  }, [hydrated, items, order]);

  const lines = useMemo<CartLine[]>(
    () =>
      items.flatMap((item): CartLine[] => {
        const product = getProduct(item.slug);
        return product ? [{ product, quantity: item.quantity }] : [];
      }),
    [items]
  );

  const count = useMemo(() => lines.reduce((total, line) => total + line.quantity, 0), [lines]);
  const subtotal = useMemo(
    () => lines.reduce((total, line) => total + line.product.price * line.quantity, 0),
    [lines]
  );

  const addItem = useCallback(
    (slug: string, quantity = 1, options?: { silent?: boolean }) => {
      if (!getProduct(slug)) return;
      setItems((previous) => {
        const existing = previous.find((item) => item.slug === slug);
        if (!existing) return [...previous, { slug, quantity: Math.min(quantity, MAX_QUANTITY) }];
        return previous.map((item) =>
          item.slug === slug ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QUANTITY) } : item
        );
      });
      if (!options?.silent) setAddedSignal({ slug, at: Date.now() });
    },
    []
  );

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const clamped = Math.min(Math.max(Math.floor(quantity), 1), MAX_QUANTITY);
    setItems((previous) => previous.map((item) => (item.slug === slug ? { ...item, quantity: clamped } : item)));
  }, []);

  const removeItem = useCallback((slug: string) => {
    setItems((previous) => previous.filter((item) => item.slug !== slug));
  }, []);

  const placeOrder = useCallback(
    (details: CheckoutDetails): Order => {
      const method = getShippingMethod(details.delivery);
      const shipping = shippingFee(method, subtotal);
      const placed: Order = {
        id: `BT-${Math.floor(100000 + Math.random() * 900000)}`,
        placedAt: new Date().toISOString(),
        lines: lines.map((line) => ({
          slug: line.product.slug,
          title: line.product.title,
          image: line.product.image,
          price: line.product.price,
          quantity: line.quantity,
        })),
        details,
        deliveryLabel: method.label,
        deliveryMinDays: method.minDays,
        deliveryMaxDays: method.maxDays,
        subtotal,
        shipping,
        total: subtotal + shipping,
      };
      setOrder(placed);
      setItems([]);
      setMiniBagOpen(false);
      return placed;
    },
    [lines, subtotal]
  );

  const value = useMemo<CartContextValue>(
    () => ({
      hydrated,
      lines,
      count,
      subtotal,
      addItem,
      setQuantity,
      removeItem,
      order,
      placeOrder,
      addedSignal,
      miniBagOpen,
      setMiniBagOpen,
    }),
    [hydrated, lines, count, subtotal, addItem, setQuantity, removeItem, order, placeOrder, addedSignal, miniBagOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}