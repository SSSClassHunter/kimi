import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, Plus, Minus, Star, ArrowRight, MapPin, MessageCircle, Trash2, Instagram, Facebook, ChevronLeft, ChevronRight, Filter } from 'lucide-react';
import type { Plant, CartItem } from '@/types/plant';
import { plants as fallbackPlants, categories as fallbackCategories, careLevels } from '@/data/plants';
import { formatCOP } from '@/lib/utils';

interface CatalogManifestItem {
  category: string;
  title: string;
  subtitle?: string;
  details?: string;
  localBasePath?: string;
}

// ─── Styles ───
const GREEN_DEEP = '#1a2f1a';
const CREAM = '#f5f2eb';
const BG = '#fbfbf8';
const BG_ALT = '#f5f5f0';
const TEXT = '#2c2c2c';
const TEXT_SEC = '#6b6b6b';
const TEXT_MUTED = '#9a9a9a';
const BORDER = '#e8e8e3';
const ACCENT = '#3d5a3d';

// ─── Navbar ───
function Navbar({ totalItems, onCartOpen, catalogPlants }: { totalItems: number; onCartOpen: () => void; catalogPlants: Plant[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleScroll = () => setScrolled(window.scrollY > 50);
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    setSearchOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const suggestions = catalogPlants.filter((plant) => {
    const haystack = `${plant.name} ${plant.scientificName} ${plant.category} ${plant.type} ${plant.description}`.toLowerCase();
    return searchQuery.trim().length > 0 && haystack.includes(searchQuery.toLowerCase());
  }).slice(0, 6);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-300"
      style={{ background: scrolled ? 'rgba(251,251,248,0.92)' : 'transparent', backdropFilter: scrolled ? 'blur(12px)' : 'none', borderBottom: scrolled ? `1px solid ${BORDER}` : '1px solid transparent' }}>
      <div className="flex items-center justify-between h-[72px] px-6 lg:px-10 max-w-[1440px] mx-auto">
        <button onClick={() => scrollTo('hero')} className="flex items-center" style={{ color: scrolled ? TEXT : CREAM }}>
          <img src="/images/logo-camuendo.jpg" alt="Camuendo" className="h-10 w-10 rounded-full object-cover border border-white/30 shadow-sm" />
        </button>
        <div className="hidden md:flex items-center gap-8">
          {['COLECCION:catalogo', 'NUESTRA ESENCIA:esencia', 'CONTACTO:contacto'].map((item) => {
            const [label, target] = item.split(':');
            return <button key={label} onClick={() => scrollTo(target)} className="font-sans text-[13px] font-medium uppercase tracking-[0.08em] transition-colors hover:opacity-80" style={{ color: scrolled ? TEXT_SEC : 'rgba(245,242,235,0.8)' }}>{label}</button>;
          })}
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden md:block relative">
            <button onClick={() => setSearchOpen((prev) => !prev)} className="relative" style={{ color: scrolled ? TEXT_SEC : 'rgba(245,242,235,0.8)' }} aria-label="Buscar en catálogo"><Search size={16} strokeWidth={1.5} /></button>
            {searchOpen && (
              <div className="absolute right-0 top-10 w-[320px] rounded-xl border border-white/70 bg-white shadow-2xl p-3 z-50">
                <input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Busca tu planta…"
                  className="w-full rounded-lg border border-[#e6e6e0] bg-[#fbfbf8] px-3 py-2 text-sm text-[#2c2c2c] outline-none"
                />
                <div className="mt-2 max-h-[280px] overflow-y-auto">
                  {suggestions.length > 0 ? suggestions.map((plant) => (
                    <button
                      key={plant.id}
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSearchOpen(false);
                        document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full rounded-lg px-3 py-2 text-left hover:bg-[#f5f5f0]"
                    >
                      <div className="font-sans text-[13px] font-semibold text-[#2c2c2c]">{plant.name}</div>
                      <div className="font-sans text-[11px] text-[#6b6b6b]">{plant.category} · {plant.scientificName}</div>
                    </button>
                  )) : (
                    <div className="px-3 py-2 text-[12px] text-[#6b6b6b]">Sin resultados en el catálogo actual.</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="hidden md:block" style={{ color: scrolled ? TEXT_SEC : 'rgba(245,242,235,0.8)' }}><User size={16} strokeWidth={1.5} /></button>
          <button onClick={onCartOpen} className="hidden md:block relative" style={{ color: scrolled ? TEXT_SEC : 'rgba(245,242,235,0.8)' }}>
            <ShoppingBag size={16} strokeWidth={1.5} />
            {totalItems > 0 && <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold text-white" style={{ background: ACCENT }}>{totalItems}</span>}
          </button>
          <button className="md:hidden" style={{ color: scrolled ? TEXT : CREAM }} onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-[72px] z-40 p-6" style={{ background: BG }}>
          {['COLECCION:catalogo', 'NUESTRA ESENCIA:esencia', 'CONTACTO:contacto'].map((item) => {
            const [label, target] = item.split(':');
            return <button key={label} onClick={() => scrollTo(target)} className="block font-sans text-[16px] font-medium uppercase tracking-[0.08em] mb-6" style={{ color: TEXT_SEC }}>{label}</button>;
          })}
        </div>
      )}
    </nav>
  );
}

// ─── Floating Cart Button ───
function FloatingCartButton({ totalItems, onCartOpen }: { totalItems: number; onCartOpen: () => void }) {
  const [position, setPosition] = useState({ x: 24, y: 24 });
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(null);

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      if (!dragState.current) return;
      const nextX = Math.min(window.innerWidth - 72, Math.max(8, dragState.current.originX + event.clientX - dragState.current.startX));
      const nextY = Math.min(window.innerHeight - 72, Math.max(8, dragState.current.originY + event.clientY - dragState.current.startY));
      setPosition({ x: nextX, y: nextY });
    };

    const handlePointerUp = () => {
      dragState.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <button
      type="button"
      onPointerDown={(event) => {
        dragState.current = { startX: event.clientX, startY: event.clientY, originX: position.x, originY: position.y };
        event.preventDefault();
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
      }}
      onClick={onCartOpen}
      className="fixed z-[120] flex items-center justify-center rounded-full shadow-2xl border border-white/70 transition-transform duration-200 hover:scale-105 active:scale-95"
      style={{
        left: position.x,
        top: position.y,
        width: 64,
        height: 64,
        background: ACCENT,
        color: 'white',
        cursor: 'grab',
      }}
      aria-label="Abrir carrito"
    >
      <ShoppingBag size={20} strokeWidth={1.8} />
      {totalItems > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-[#1a2f1a]">{totalItems}</span>}
    </button>
  );
}

// ─── Cart Drawer ───
function CartDrawer({ items, isOpen, onClose, onRemove, onUpdateQuantity, totalItems, totalPrice, whatsAppLink }: {
  items: CartItem[]; isOpen: boolean; onClose: () => void; onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, q: number) => void; totalItems: number; totalPrice: number; whatsAppLink: string;
}) {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-[200]" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-[420px] z-[201] shadow-2xl flex flex-col" style={{ background: BG }}>
        <div className="flex items-center justify-between p-6" style={{ borderBottom: `1px solid ${BORDER}` }}>
          <div className="flex items-center gap-3"><ShoppingBag size={18} strokeWidth={1.5} style={{ color: TEXT }} /><h3 className="font-sans text-[14px] font-medium uppercase tracking-[0.08em]">Tu Carrito ({totalItems})</h3></div>
          <button onClick={onClose} style={{ color: TEXT_SEC }}><X size={20} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} strokeWidth={1} style={{ color: TEXT_MUTED }} className="mb-4" />
              <p className="font-serif text-[20px]" style={{ color: TEXT_SEC }}>Tu carrito esta vacio</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-sm" />
                  <div className="flex-1">
                    <h4 className="font-serif text-[16px]" style={{ color: TEXT }}>{item.name}</h4>
                    <p className="font-sans text-[14px] font-semibold mt-2" style={{ color: TEXT }}>{formatCOP(item.price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: BORDER, color: TEXT_SEC }}><Minus size={14} /></button>
                      <span className="font-sans text-[14px] font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{ borderColor: BORDER, color: TEXT_SEC }}><Plus size={14} /></button>
                      <button onClick={() => onRemove(item.id)} className="ml-auto" style={{ color: TEXT_MUTED }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="p-6" style={{ borderTop: `1px solid ${BORDER}`, background: BG_ALT }}>
            <div className="flex items-center justify-between mb-4"><span className="font-sans text-[14px]" style={{ color: TEXT_SEC }}>Subtotal</span><span className="font-sans text-[18px] font-semibold">{formatCOP(totalPrice)}</span></div>
            <a href={whatsAppLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-4 font-sans text-[14px] font-semibold uppercase tracking-[0.08em] text-white hover:opacity-90 transition-opacity" style={{ background: '#25D366' }}><MessageCircle size={18} /> Hacer Pedido por WhatsApp</a>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Hero ───
function Hero() {
  return (
    <section id="hero" className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: GREEN_DEEP }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(26,47,26,0.95) 0%, rgba(15,25,15,1) 100%)' }} />
      <div className="absolute top-6 left-6 lg:left-10 z-20"><span className="font-sans text-[12px] uppercase tracking-[0.15em]" style={{ color: 'rgba(245,242,235,0.5)' }}>Vivero Especializado</span></div>
      <div className="relative z-10 flex flex-col items-center px-6">
        <img src="/images/hero.jpg" alt="Vivero Camuendo" className="w-auto h-[45vh] lg:h-[55vh] object-cover rounded-sm shadow-2xl mb-12" />
        <h1 className="font-serif font-light text-center max-w-[800px]" style={{ fontSize: 'clamp(2rem, 5.5vw, 4.5rem)', lineHeight: 0.95, color: CREAM, textShadow: '0 2px 40px rgba(0,0,0,0.5)' }}>Donde la Naturaleza Encuentra su Hogar</h1>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
        <span className="font-sans text-[11px] uppercase tracking-[0.12em]" style={{ color: 'rgba(245,242,235,0.5)' }}>Descubre mas</span>
      </div>
    </section>
  );
}

// ─── Text Divider ───
function TextDivider({ text, variant, bgColor }: { text: string; variant: 'bold' | 'italic'; bgColor?: string }) {
  return (
    <div className="flex items-center justify-center overflow-hidden px-6" style={{ height: '40vh', background: bgColor || BG }}>
      <p className="text-center max-w-[900px]"
        style={{
          fontFamily: variant === 'bold' ? "'DM Sans', sans-serif" : "'Cormorant Garamond', serif",
          fontSize: variant === 'bold' ? 'clamp(1.2rem, 3.5vw, 2.8rem)' : 'clamp(1.5rem, 4vw, 3rem)',
          fontWeight: variant === 'bold' ? 600 : 300,
          fontStyle: variant === 'italic' ? 'italic' : 'normal',
          textTransform: variant === 'bold' ? 'uppercase' : 'none',
          color: TEXT,
          lineHeight: 1.2,
        }}>{text}</p>
    </div>
  );
}

// ─── Mas Vendidos ───
function MasVendidos({ plants, onAddToCart }: { plants: Plant[]; onAddToCart: (plant: Plant) => void }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  return (
    <section className="py-20 lg:py-28" style={{ background: BG_ALT }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 font-sans text-[12px] font-medium uppercase tracking-[0.15em] mb-4" style={{ color: ACCENT }}><Star size={14} fill="currentColor" /> Las mas solicitadas</span>
          <h2 className="font-serif font-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', lineHeight: 1.1, color: TEXT }}>Plantas Mas Vendidas</h2>
          <p className="font-sans text-[16px] mt-4 max-w-[500px] mx-auto" style={{ color: TEXT_SEC }}>Estas son las plantas que nuestros clientes adoran.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {plants.map((plant) => {
            const hovered = hoveredId === plant.id;
            return (
              <div key={plant.id} className="bg-white overflow-hidden transition-shadow duration-500" style={{ boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.1)' : 'none' }} onMouseEnter={() => setHoveredId(plant.id)} onMouseLeave={() => setHoveredId(null)}>
                <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: BG_ALT }}>
                  <img src={plant.image} alt={plant.name} className="w-full h-full object-cover transition-transform duration-700" style={{ transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
                  <div className="absolute inset-0 transition-colors duration-300" style={{ background: hovered ? 'rgba(0,0,0,0.2)' : 'transparent' }} />
                  <button onClick={() => onAddToCart(plant)} className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300" style={{ opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(16px)' }}><Plus size={20} /></button>
                  <div className="absolute top-4 left-4 text-white font-sans text-[10px] font-semibold uppercase tracking-[0.1em] px-3 py-1" style={{ background: ACCENT }}>Popular</div>
                </div>
                <div className="p-5">
                  <span className="font-sans text-[11px] uppercase tracking-[0.1em]" style={{ color: TEXT_MUTED }}>{plant.category}</span>
                  <h4 className="font-serif text-[18px] mt-1 leading-tight" style={{ color: TEXT }}>{plant.name}</h4>
                  <p className="font-sans text-[12px] mt-0.5" style={{ color: TEXT_MUTED, fontStyle: 'italic' }}>{plant.scientificName}</p>
                  <p className="font-sans text-[14px] font-semibold mt-3" style={{ color: TEXT }}>{formatCOP(plant.price)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Video Banner ───
function VideoBanner() {
  return (
    <section id="esencia" className="relative w-full overflow-hidden" style={{ height: '80vh', minHeight: '500px' }}>
      <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
        <source src="/video/vivero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)' }} />
      <div className="absolute bottom-[60px] left-6 lg:left-10 z-10">
        <span className="block font-sans text-[12px] font-medium uppercase tracking-[0.15em] text-white/70 mb-4">CONOCE NUESTRO VIVERO</span>
        <h2 className="font-serif font-light text-white max-w-[500px]" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', lineHeight: 1.1 }}>Un Santuario Verde en el Corazon de la Ciudad</h2>
        <button onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} className="inline-flex items-center gap-2 mt-6 font-sans text-[14px] font-medium uppercase tracking-[0.08em] text-white border-b border-white pb-1 hover:tracking-[0.12em] transition-all duration-300"><span>EXPLORAR COLECCION</span><ArrowRight size={14} /></button>
      </div>
    </section>
  );
}

// ─── Featured Product ───
function FeaturedProduct({ plant, onAddToCart }: { plant: Plant; onAddToCart: (plant: Plant) => void }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: GREEN_DEEP }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 30% 50%, rgba(45,80,45,0.4) 0%, transparent 60%)' }} />
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 lg:px-20 py-20">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 max-w-[480px]">
            <span className="block font-sans text-[12px] font-medium uppercase tracking-[0.15em] mb-6" style={{ color: '#c8d4c8' }}>PLANTA DEL MES</span>
            <h2 className="font-serif font-light" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', lineHeight: 1.1, color: CREAM }}>{plant.name}</h2>
            <p className="font-sans text-[16px] leading-relaxed mt-6 mb-8" style={{ color: 'rgba(245,242,235,0.75)' }}>{plant.description}</p>
            <p className="font-sans text-[24px] font-semibold mb-8" style={{ color: CREAM }}>{formatCOP(plant.price)}</p>
            <button onClick={() => onAddToCart(plant)} className="inline-flex items-center gap-3 font-sans text-[14px] font-semibold uppercase tracking-[0.08em] px-10 py-4 transition-all duration-200 hover:scale-[1.02]" style={{ background: CREAM, color: GREEN_DEEP }}><Plus size={18} /> ANADIR AL CARRITO</button>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end"><img src={plant.image} alt={plant.name} className="max-h-[70vh] w-auto object-contain" /></div>
        </div>
      </div>
    </section>
  );
}

// ─── Catalogo ───
function Catalogo({ plants, categories, onAddToCart }: { plants: Plant[]; categories: string[]; onAddToCart: (plant: Plant) => void }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('Todas');
  const [activeCare, setActiveCare] = useState('Todos');
  const [showFilters, setShowFilters] = useState(false);
  const [carouselMode, setCarouselMode] = useState(true);

  const filteredPlants = plants.filter((p) => (activeCategory === 'Todas' || p.category === activeCategory) && (activeCare === 'Todos' || p.careLevel === activeCare));

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -el.offsetWidth * 0.8 : el.offsetWidth * 0.8, behavior: 'smooth' });
  }, []);

  return (
    <section id="catalogo" className="relative py-20 lg:py-28" style={{ background: BG }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <span className="font-sans text-[12px] font-medium uppercase tracking-[0.15em]" style={{ color: TEXT_MUTED }}>COLECCION EXCLUSIVA</span>
            <h2 className="font-serif font-light mt-2" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.05, color: TEXT }}>Nuestras Plantas</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center rounded-full p-1" style={{ background: BG_ALT }}>
              <button onClick={() => setCarouselMode(true)} className="px-4 py-2 rounded-full font-sans text-[12px] font-medium uppercase tracking-[0.05em] transition-all" style={carouselMode ? { background: ACCENT, color: 'white' } : { color: TEXT_SEC }}>Carrusel</button>
              <button onClick={() => setCarouselMode(false)} className="px-4 py-2 rounded-full font-sans text-[12px] font-medium uppercase tracking-[0.05em] transition-all" style={!carouselMode ? { background: ACCENT, color: 'white' } : { color: TEXT_SEC }}>Grid</button>
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 font-sans text-[13px] font-medium uppercase tracking-[0.05em]" style={{ color: TEXT_SEC }}><Filter size={16} /> Filtros</button>
            {carouselMode && (
              <div className="hidden md:flex items-center gap-2">
                <button onClick={() => scrollCarousel('left')} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: BORDER, color: TEXT_SEC }}><ChevronLeft size={18} /></button>
                <button onClick={() => scrollCarousel('right')} className="w-10 h-10 rounded-full border flex items-center justify-center" style={{ borderColor: BORDER, color: TEXT_SEC }}><ChevronRight size={18} /></button>
              </div>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="mb-10 p-6 rounded-lg" style={{ background: BG_ALT }}>
            <div className="flex items-center justify-between mb-4"><span className="font-sans text-[13px] font-medium uppercase tracking-[0.08em]" style={{ color: TEXT_SEC }}>Filtrar por categoria</span><button onClick={() => setShowFilters(false)} style={{ color: TEXT_MUTED }}><X size={16} /></button></div>
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((cat) => <button key={cat} onClick={() => setActiveCategory(cat)} className="px-4 py-2 rounded-full font-sans text-[12px] font-medium uppercase tracking-[0.05em] transition-all" style={activeCategory === cat ? { background: ACCENT, color: 'white' } : { background: 'white', color: TEXT_SEC, border: `1px solid ${BORDER}` }}>{cat}</button>)}
            </div>
            <span className="font-sans text-[13px] font-medium uppercase tracking-[0.08em] block mb-4" style={{ color: TEXT_SEC }}>Filtrar por dificultad</span>
            <div className="flex flex-wrap gap-2">
              {careLevels.map((level) => <button key={level} onClick={() => setActiveCare(level)} className="px-4 py-2 rounded-full font-sans text-[12px] font-medium uppercase tracking-[0.05em] transition-all" style={activeCare === level ? { background: ACCENT, color: 'white' } : { background: 'white', color: TEXT_SEC, border: `1px solid ${BORDER}` }}>{level}</button>)}
            </div>
          </div>
        )}

        {carouselMode ? (
          <div className="relative">
            <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {filteredPlants.map((plant) => {
                const hovered = hoveredId === plant.id;
                return (
                  <div key={plant.id} className="snap-start flex-shrink-0" style={{ width: 'clamp(260px, 22vw, 320px)' }}>
                    <div className="relative cursor-pointer" onMouseEnter={() => setHoveredId(plant.id)} onMouseLeave={() => setHoveredId(null)}>
                      <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: BG_ALT }}>
                        <img src={plant.image} alt={plant.name} className="w-full h-full object-cover transition-all duration-500" style={{ opacity: hovered ? 0.3 : 1, transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300" style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? 'auto' : 'none', background: 'rgba(245,245,240,0.95)' }}>
                          <p className="font-sans text-[13px] text-center leading-relaxed mb-4" style={{ color: TEXT_SEC }}>{plant.description.slice(0, 100)}...</p>
                          <div className="flex flex-col gap-1 text-center mb-4">
                            <span className="font-sans text-[12px]" style={{ color: TEXT_MUTED }}><strong style={{ color: TEXT_SEC }}>Luz:</strong> {plant.light}</span>
                            <span className="font-sans text-[12px]" style={{ color: TEXT_MUTED }}><strong style={{ color: TEXT_SEC }}>Riego:</strong> {plant.water}</span>
                            <span className="font-sans text-[12px]" style={{ color: TEXT_MUTED }}><strong style={{ color: TEXT_SEC }}>Dif:</strong> {plant.careLevel}</span>
                          </div>
                          <button onClick={(e) => { e.stopPropagation(); onAddToCart(plant); }} className="flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-white px-6 py-3" style={{ background: ACCENT }}><Plus size={16} /> Agregar</button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <span className="font-sans text-[11px] font-medium uppercase tracking-[0.1em]" style={{ color: TEXT_MUTED }}>{plant.type}</span>
                        <h4 className="font-serif text-[20px] mt-1 leading-tight" style={{ color: TEXT }}>{plant.name}</h4>
                        <p className="font-sans text-[12px] mt-0.5" style={{ color: TEXT_MUTED, fontStyle: 'italic' }}>{plant.scientificName}</p>
                        <p className="font-sans text-[14px] font-semibold mt-2" style={{ color: TEXT }}>{formatCOP(plant.price)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredPlants.map((plant) => {
              const hovered = hoveredId === plant.id;
              return (
                <div key={plant.id} className="relative cursor-pointer" onMouseEnter={() => setHoveredId(plant.id)} onMouseLeave={() => setHoveredId(null)}>
                  <div className="relative overflow-hidden" style={{ aspectRatio: '3/4', background: BG_ALT }}>
                    <img src={plant.image} alt={plant.name} className="w-full h-full object-cover transition-all duration-500" style={{ opacity: hovered ? 0.3 : 1, transform: hovered ? 'scale(1.05)' : 'scale(1)' }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 transition-opacity duration-300" style={{ opacity: hovered ? 1 : 0, pointerEvents: hovered ? 'auto' : 'none', background: 'rgba(245,245,240,0.95)' }}>
                      <p className="font-sans text-[13px] text-center leading-relaxed mb-4" style={{ color: TEXT_SEC }}>{plant.description.slice(0, 100)}...</p>
                      <div className="flex flex-col gap-1 text-center mb-4">
                        <span className="font-sans text-[12px]" style={{ color: TEXT_MUTED }}><strong style={{ color: TEXT_SEC }}>Luz:</strong> {plant.light}</span>
                        <span className="font-sans text-[12px]" style={{ color: TEXT_MUTED }}><strong style={{ color: TEXT_SEC }}>Riego:</strong> {plant.water}</span>
                        <span className="font-sans text-[12px]" style={{ color: TEXT_MUTED }}><strong style={{ color: TEXT_SEC }}>Dif:</strong> {plant.careLevel}</span>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); onAddToCart(plant); }} className="flex items-center gap-2 font-sans text-[13px] font-semibold uppercase tracking-[0.08em] text-white px-6 py-3" style={{ background: ACCENT }}><Plus size={16} /> Agregar</button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="font-sans text-[11px] font-medium uppercase tracking-[0.1em]" style={{ color: TEXT_MUTED }}>{plant.type}</span>
                    <h4 className="font-serif text-[20px] mt-1 leading-tight" style={{ color: TEXT }}>{plant.name}</h4>
                    <p className="font-sans text-[12px] mt-0.5" style={{ color: TEXT_MUTED, fontStyle: 'italic' }}>{plant.scientificName}</p>
                    <p className="font-sans text-[14px] font-semibold mt-2" style={{ color: TEXT }}>{formatCOP(plant.price)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── CTA Section ───
function CTASection() {
  return (
    <section id="contacto" className="relative min-h-[60vh] flex items-center justify-center overflow-hidden" style={{ background: GREEN_DEEP }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 60% 50%, rgba(45,80,45,0.5) 0%, transparent 60%)' }} />
      <div className="relative z-10 text-center px-6 max-w-[900px]">
        <h2 className="font-serif font-light" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1.1, color: CREAM }}>Visítanos en Plaza Wayku Chupa, Camuendo</h2>
        <p className="font-sans text-[16px] mt-6 leading-relaxed" style={{ color: 'rgba(245,242,235,0.7)' }}>Estamos cerca del Lago San Pablo con atención permanente para que tu visita sea práctica, segura y productiva.</p>
        <p className="font-sans text-[16px] mt-4 flex items-center justify-center gap-2" style={{ color: 'rgba(245,242,235,0.7)' }}><MapPin size={16} /> Calle Mariscal Sucre, entrada &quot;Wayku Chupa&quot;, Camuendo, Imbabura, Ecuador.</p>
        <p className="font-sans text-[14px] mt-2" style={{ color: 'rgba(245,242,235,0.6)' }}>Referencia: 1 cuadra de las Cabañas del Lago, cerca del Lago San Pablo.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
          <a href="https://www.google.com/maps/search/?api=1&query=Plaza+Wayku+Chupa+Camuendo+Imbabura+Ecuador" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-sans text-[14px] font-semibold uppercase tracking-[0.08em] px-12 py-4 hover:scale-[1.03] transition-all duration-200" style={{ background: CREAM, color: GREEN_DEEP }}><MapPin size={16} /> VER EN MAPS</a>
          <a href="https://wa.me/573001234567?text=Hola%20Vivero%20Camuendo!" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-sans text-[14px] font-medium uppercase tracking-[0.08em] px-12 py-4 transition-all duration-200" style={{ border: '1px solid rgba(245,242,235,0.4)', color: CREAM }}><MessageCircle size={16} /> ESCRIBENOS</a>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───
function Footer() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  return (
    <footer style={{ background: BG, borderTop: `1px solid ${BORDER}` }}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 pt-16 lg:pt-20 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16">
          <div><h3 className="font-serif text-[20px] font-light tracking-[0.12em] mb-4" style={{ color: TEXT }}>CAMUENDO</h3><p className="font-sans text-[14px] leading-relaxed" style={{ color: TEXT_SEC }}>Vivero especializado en plantas tropicales y ornamentales desde 2018.</p></div>
          <div><h4 className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: TEXT }}>Navegacion</h4><ul className="space-y-3">{['Coleccion:catalogo', 'Nuestra Esencia:esencia', 'Contacto:contacto'].map((item) => { const [label, target] = item.split(':'); return <li key={label}><button onClick={() => scrollTo(target)} className="font-sans text-[14px] hover:opacity-80 transition-opacity" style={{ color: TEXT_SEC }}>{label}</button></li>; })}</ul></div>
          <div><h4 className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: TEXT }}>Contacto</h4><ul className="space-y-3"><li className="font-sans text-[14px]" style={{ color: TEXT_SEC }}>0980752799</li><li className="font-sans text-[14px]" style={{ color: TEXT_SEC }}>0991165214</li><li className="font-sans text-[14px]" style={{ color: TEXT_SEC }}>0994698636</li><li className="font-sans text-[14px]" style={{ color: TEXT_SEC }}>Plaza Wayku Chupa, Camuendo, Imbabura, Ecuador</li><li className="font-sans text-[14px]" style={{ color: TEXT_SEC }}>Calle Mariscal Sucre, entrada “Wayku Chupa”</li><li><a href="https://www.google.com/maps/search/?api=1&query=Plaza+Wayku+Chupa+Camuendo+Imbabura+Ecuador" target="_blank" rel="noopener noreferrer" className="font-sans text-[14px] hover:opacity-80 transition-opacity" style={{ color: TEXT_SEC }}>Ver en Maps</a></li></ul></div>
          <div><h4 className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em] mb-4" style={{ color: TEXT }}>Siguenos</h4>
            <div className="flex flex-col gap-3">
              <a href="https://instagram.com/viverocamuendo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-[14px] hover:opacity-80 transition-opacity" style={{ color: TEXT_SEC }}><Instagram size={18} /><span className="uppercase">Instagram</span></a>
              <a href="https://facebook.com/viverocamuendo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-[14px] hover:opacity-80 transition-opacity" style={{ color: TEXT_SEC }}><Facebook size={18} /><span className="uppercase">Facebook</span></a>
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-sans text-[14px] hover:opacity-80 transition-opacity" style={{ color: TEXT_SEC }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
                <span className="uppercase">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4" style={{ borderTop: `1px solid ${BORDER}` }}>
          <p className="font-sans text-[12px]" style={{ color: TEXT_MUTED }}>&copy; 2025 Vivero Camuendo. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <span className="font-sans text-[12px] cursor-pointer" style={{ color: TEXT_MUTED }}>Terminos</span><span style={{ color: BORDER }}>&middot;</span>
            <span className="font-sans text-[12px] cursor-pointer" style={{ color: TEXT_MUTED }}>Privacidad</span><span style={{ color: BORDER }}>&middot;</span>
            <span className="font-sans text-[12px] cursor-pointer" style={{ color: TEXT_MUTED }}>Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ───
export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [catalogPlants, setCatalogPlants] = useState<Plant[]>(fallbackPlants);
  const [catalogCategories, setCatalogCategories] = useState<string[]>(fallbackCategories);

  useEffect(() => {
    let active = true;

    fetch('/catalog_image_manifest.json')
      .then((response) => {
        if (!response.ok) throw new Error('Manifest not available');
        return response.json();
      })
      .then((items: CatalogManifestItem[]) => {
        if (!active) return;

        const mappedPlants = items.map((item, index) => ({
          id: index + 1,
          name: item.title,
          scientificName: item.subtitle || item.category,
          type: item.category,
          category: item.category,
          price: 35000 + index * 4200 + (item.title.length % 7) * 1500,
          image: `/images/plant-${((index % 11) + 1)}.jpg`,
          description: item.details || 'Producto del catálogo subido recientemente.',
          careLevel: ['Facil', 'Intermedio', 'Avanzado'][index % 3],
          light: 'Luz indirecta brillante',
          water: 'Moderado',
          popular: index < 6,
        }));

        setCatalogPlants(mappedPlants);
        setCatalogCategories(['Todas', ...Array.from(new Set(items.map((item) => item.category)))]);
      })
      .catch(() => {
        if (active) {
          setCatalogPlants(fallbackPlants);
          setCatalogCategories(fallbackCategories);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const addToCart = useCallback((plant: Plant) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === plant.id);
      if (existing) return prev.map((item) => item.id === plant.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...plant, quantity: 1 }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback((plantId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== plantId));
  }, []);

  const updateQuantity = useCallback((plantId: number, quantity: number) => {
    if (quantity <= 0) { setCartItems((prev) => prev.filter((item) => item.id !== plantId)); return; }
    setCartItems((prev) => prev.map((item) => item.id === plantId ? { ...item, quantity } : item));
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getWhatsAppLink = () => {
    const phoneNumber = '573001234567';
    let message = 'Hola Vivero Camuendo! Me gustaria hacer un pedido:\n\n';
    cartItems.forEach((item) => { message += `- ${item.name} x${item.quantity} - ${formatCOP(item.price * item.quantity)}\n`; });
    message += `\nTotal: ${formatCOP(totalPrice)}\n\nGracias!`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar totalItems={totalItems} onCartOpen={() => setCartOpen(true)} catalogPlants={catalogPlants} />
      <FloatingCartButton totalItems={totalItems} onCartOpen={() => setCartOpen(true)} />
      <CartDrawer items={cartItems} isOpen={cartOpen} onClose={() => setCartOpen(false)} onRemove={removeFromCart} onUpdateQuantity={updateQuantity} totalItems={totalItems} totalPrice={totalPrice} whatsAppLink={getWhatsAppLink()} />
      <Hero />
      <TextDivider text="CUIDAMOS CADA HOJA, CADA RAIZ, CADA DETALLE" variant="bold" />
      <MasVendidos plants={catalogPlants.filter((p) => p.popular)} onAddToCart={addToCart} />
      <VideoBanner />
      <FeaturedProduct plant={catalogPlants[0] ?? fallbackPlants[0]} onAddToCart={addToCart} />
      <Catalogo plants={catalogPlants} categories={catalogCategories} onAddToCart={addToCart} />
      <TextDivider text="RAICES QUE INSPIRAN, HOJAS QUE TRANSFORMAN" variant="italic" bgColor="#f5e6dc" />
      <CTASection />
      <Footer />
    </div>
  );
}
