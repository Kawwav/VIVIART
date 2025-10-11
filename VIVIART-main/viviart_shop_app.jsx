/*
Viviart Crochê — Single-file React app (Tailwind CSS required)

Como usar:
1. Crie um projeto React (Vite recommended):
   npm create vite@latest viviart -- --template react
   cd viviart
   npm install

2. Instale Tailwind (segui a doc oficial):
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   // configure tailwind.config.js and index.css conforme docs

3. Copie este arquivo como src/App.jsx (substitua o existente).
4. Rode: npm run dev

Observações importantes:
- As imagens aqui são placeholders. Substitua as URLs em `products` por links das suas fotos do Instagram (ou salve-as em /public/images e referencie '/images/bolsa1.jpg').
- Pagamentos: esta demo simula PIX e Mercado Pago. Para PAGAMENTO REAL, integre a API do Mercado Pago (server-side recommended) ou um provedor de pagamentos que aceite Pix.
- Para envio ao WhatsApp (encomendas privadas), o botão faz `window.open(whatsappUrl)` com a mensagem de pedido.


Componente exportado por padrão: App
*/

import React, { useEffect, useState } from "react";


const products = [
  {
    id: "bolsa-1",
    name: "Bolsa Praia Natural",
    price: 149.0,
    img: "https://via.placeholder.com/640x480?text=Bolsa+1",
    description: "Bolsa em fio de algodão, alça longa. Medidas: 30x25cm.",
  },
  {
    id: "bolsa-2",
    name: "Bolsa Boho Color",
    price: 189.0,
    img: "https://via.placeholder.com/640x480?text=Bolsa+2",
    description: "Modelo boho com franjas. Fio: misto algodão.",
  },
  {
    id: "bolsa-3",
    name: "Mini Bolsa Vivi",
    price: 99.0,
    img: "https://via.placeholder.com/640x480?text=Bolsa+3",
    description: "Mini bolsa para passeio. Forro em tecido impermeável.",
  },
];


const currency = (v) => `R$ ${v.toFixed(2).replace('.', ',')}`;


function useCart() {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("viviart_cart");
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("viviart_cart", JSON.stringify(cart));
  }, [cart]);

  const add = (product, qty = 1) => {
    setCart((c) => {
      const existing = c[product.id] ? { ...c[product.id] } : { ...product, qty: 0 };
      existing.qty += qty;
      return { ...c, [product.id]: existing };
    });
  };

  const remove = (id) => {
    setCart((c) => {
      const copy = { ...c };
      delete copy[id];
      return copy;
    });
  };

  const updateQty = (id, qty) => {
    setCart((c) => {
      const copy = { ...c };
      if (!copy[id]) return copy;
      copy[id].qty = qty;
      if (qty <= 0) delete copy[id];
      return copy;
    });
  };

  const clear = () => setCart({});

  const items = Object.values(cart);
  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);

  return { cart, items, add, remove, updateQty, clear, subtotal };
}


function Header({ openCart, cartCount }) {
  return (
    <header className="bg-rose-50 border-b border-rose-100">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-200 flex items-center justify-center text-2xl font-bold text-rose-700">V</div>
          <div>
            <h1 className="text-xl font-serif text-rose-800">Viviart Crochê</h1>
            <div className="text-xs text-rose-600">Feito à mão com amor 💕</div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <a href="#colecao" className="text-rose-700 hover:underline">Coleção</a>
          <a href="#sobre" className="text-rose-700 hover:underline">Sobre</a>
          <button
            onClick={openCart}
            className="relative bg-rose-600 text-white px-3 py-2 rounded-md shadow"
          >
            Carrinho
            {cartCount > 0 && (
              <span className="ml-2 inline-block bg-white text-rose-600 px-2 rounded-full text-sm font-semibold">{cartCount}</span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}

function ProductCard({ p, onAdd }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <img src={p.img} alt={p.name} className="w-full h-56 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold text-rose-800">{p.name}</h3>
        <p className="text-sm text-rose-500 my-2">{p.description}</p>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-rose-700">{currency(p.price)}</div>
          <button
            onClick={() => onAdd(p)}
            className="bg-rose-600 text-white px-3 py-1 rounded-md"
          >
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, items, subtotal, updateQty, remove, onCheckout }) {
  return (
    <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-black/30 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose}></div>

      <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-white p-6 shadow-xl transform transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-rose-800">Seu carrinho</h2>
          <button onClick={onClose} className="text-rose-500">Fechar</button>
        </div>

        <div className="space-y-4 flex-1 overflow-auto">
          {items.length === 0 ? (
            <div className="text-sm text-rose-500">Seu carrinho está vazio.</div>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex items-center gap-3">
                <img src={it.img} alt={it.name} className="w-16 h-16 object-cover rounded-md" />
                <div className="flex-1">
                  <div className="font-semibold text-rose-800">{it.name}</div>
                  <div className="text-sm text-rose-500">{currency(it.price)}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <button className="px-2 py-1 border rounded" onClick={() => updateQty(it.id, it.qty - 1)}>-</button>
                    <div className="px-3">{it.qty}</div>
                    <button className="px-2 py-1 border rounded" onClick={() => updateQty(it.id, it.qty + 1)}>+</button>
                    <button className="ml-4 text-sm text-rose-600" onClick={() => remove(it.id)}>Remover</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 border-t pt-4">
          <div className="flex items-center justify-between text-rose-700 mb-4">
            <div>Subtotal</div>
            <div className="font-bold">{currency(subtotal)}</div>
          </div>
          <div className="flex gap-3">
            <button onClick={onCheckout} disabled={items.length===0} className="flex-1 bg-rose-600 text-white py-2 rounded-md">Finalizar Compra</button>
            <button onClick={() => { localStorage.removeItem('viviart_cart'); window.location.reload(); }} className="px-3 py-2 border rounded-md">Limpar</button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function CheckoutForm({ items, subtotal, onBack, onPlaceOrder }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [method, setMethod] = useState("pix");

  const handleSubmit = (e) => {
    e.preventDefault();
    const order = { name, phone, address, method, items, subtotal, date: new Date().toISOString() };
    onPlaceOrder(order);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-4 bg-rose-50 rounded-lg">
      <h3 className="text-lg font-semibold text-rose-800 mb-2">Consulte seus dados</h3>
      <div className="grid grid-cols-1 gap-3">
        <input required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Nome completo" className="p-2 rounded border" />
        <input required value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Whatsapp (ex: +55 41 9xxxx)" className="p-2 rounded border" />
        <input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Endereço (opcional - para entrega)" className="p-2 rounded border" />

        <div className="flex gap-3 items-center">
          <label className="flex items-center gap-2"><input type="radio" checked={method==='pix'} onChange={()=>setMethod('pix')} /> Pix</label>
          <label className="flex items-center gap-2"><input type="radio" checked={method==='mercadopago'} onChange={()=>setMethod('mercadopago')} /> Mercado Pago</label>
          <label className="flex items-center gap-2"><input type="radio" checked={method==='whatsapp'} onChange={()=>setMethod('whatsapp')} /> Encomenda via WhatsApp</label>
        </div>

        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="px-4 py-2 border rounded">Voltar</button>
          <div className="text-right">
            <div className="text-sm text-rose-600">Total</div>
            <div className="font-bold text-rose-800">{currency(subtotal)}</div>
          </div>
        </div>

        <button className="bg-rose-700 text-white py-2 rounded-md">Continuar</button>
      </div>
    </form>
  );
}

function PaymentSummary({ order, onConfirm }) {

  const pixCode = `00020126360014BR.GOV.BCB.PIX0136viviartpix@exemplo.com520400005303986540${(order.subtotal).toFixed(2).replace('.', '')}5802BR5909Viviart6009CURITIBA61080500000062070503***6304ABCD`;
  const mpRedirect = "https://www.mercadopago.com.br/checkout/v1/redirect?external_reference=VIVIART_TEST"; // placeholder

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-rose-800 mb-2">Resumo do pedido</h3>
      <div className="text-sm text-rose-600 mb-3">Nome: {order.name} • Whatsapp: {order.phone}</div>

      <div className="space-y-2">
        {order.items.map(it => (
          <div key={it.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={it.img} className="w-12 h-12 object-cover rounded" />
              <div>
                <div className="font-medium text-rose-800">{it.name}</div>
                <div className="text-xs text-rose-500">{it.qty} x {currency(it.price)}</div>
              </div>
            </div>
            <div className="font-semibold">{currency(it.price * it.qty)}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 border-t pt-3">
        <div className="flex items-center justify-between mb-2">
          <div>Total</div>
          <div className="font-bold">{currency(order.subtotal)}</div>
        </div>

        {order.method === 'pix' && (
          <div>
            <div className="text-sm text-rose-600 mb-2">Pagamento por Pix</div>
            <div className="p-3 bg-rose-50 rounded">
              <div className="font-mono text-xs break-all">{pixCode}</div>
              <div className="mt-2 text-sm text-rose-600">Copie esse código e pague no seu app bancário. Depois clique em "Simular pagamento".</div>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={onConfirm} className="bg-rose-600 text-white px-3 py-2 rounded">Simular pagamento</button>
            </div>
          </div>
        )}

        {order.method === 'mercadopago' && (
          <div>
            <div className="text-sm text-rose-600 mb-2">Mercado Pago (integração real exige chave e backend)</div>
            <a href={mpRedirect} target="_blank" rel="noreferrer" className="inline-block bg-rose-600 text-white px-4 py-2 rounded">Abrir Mercado Pago</a>
            <div className="mt-2 text-xs text-rose-500">(Link de exemplo — substitua pelo checkout gerado pelo servidor com sua conta Mercado Pago)</div>
          </div>
        )}

        {order.method === 'whatsapp' && (
          <div>
            <div className="text-sm text-rose-600 mb-2">Encomenda via WhatsApp</div>
            <div className="p-3 bg-rose-50 rounded">
              <div className="text-sm">Clique no botão para abrir o WhatsApp com uma mensagem de pedido pronta.</div>
            </div>
            <div className="mt-3 flex gap-2">
              <a href={`https://wa.me/${encodeURIComponent(order.phone.replace(/\D/g, ''))}?text=${encodeURIComponent(`Olá, quero encomendar: ${order.items.map(i=>i.name+ ' x'+i.qty).join(', ')} - Total ${currency(order.subtotal)}. Nome: ${order.name}. Endereço: ${order.address || '-'}`)}`} target="_blank" rel="noreferrer" className="bg-rose-600 text-white px-4 py-2 rounded">Abrir WhatsApp</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default function App() {
  const { items, add, updateQty, remove, clear, subtotal } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState("home"); // home | checkout | success
  const [currentOrder, setCurrentOrder] = useState(null);

  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  function handleAdd(p) {
    add(p, 1);
  }

  function handleCheckout() {
    setCartOpen(false);
    setView("checkout");
  }

  function handlePlaceOrder(order) {
   
    setCurrentOrder(order);
    setView("payment");
  }

  function handleConfirmPayment() {
    
    setView("success");
    clear();
  }

  return (
    <div className="min-h-screen bg-rose-50 text-rose-900">
      <Header openCart={() => setCartOpen(true)} cartCount={cartCount} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {view === 'home' && (
          <>
            <section className="mb-8">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                <div>
                  <h2 className="text-4xl font-serif text-rose-800">Bolsas artesanais feitas à mão</h2>
                  <p className="mt-3 text-rose-600">Peças únicas inspiradas na natureza e no estilo boho. Encomendas abertas — envio para todo o Brasil.</p>
                  <div className="mt-4 flex gap-3">
                    <a href="#colecao" className="bg-rose-600 text-white px-4 py-2 rounded">Ver Coleção</a>
                    <a href="#sobre" className="px-4 py-2 border rounded">Sobre</a>
                  </div>
                </div>
                <div>
                  <img src="https://via.placeholder.com/900x600?text=Viviart+%C3%89+Amor" alt="banner" className="rounded-2xl shadow" />
                </div>
              </div>
            </section>

            <section id="colecao" className="mb-10">
              <h3 className="text-2xl font-semibold mb-4">Coleção</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map(p => (
                  <ProductCard key={p.id} p={p} onAdd={handleAdd} />
                ))}
              </div>
            </section>

            <section id="sobre" className="mb-10">
              <h3 className="text-2xl font-semibold mb-2">Sobre</h3>
              <p className="text-rose-600">A Viviart nasceu da paixão pelo crochê. Cada bolsa é produzida com atenção aos detalhes e com materiais escolhidos para durar. Siga nosso Instagram <a href="https://www.instagram.com/viviart.croche/" target="_blank" rel="noreferrer" className="text-rose-700 underline">@viviart.croche</a> para ver novidades.</p>
            </section>

            <section className="mb-10">
              <h3 className="text-2xl font-semibold mb-4">Contato / Encomendas</h3>
              <p className="text-rose-600 mb-3">Prefere encomendar via WhatsApp? Clique no botão abaixo para abrir uma mensagem pronta.</p>
              <a href={`https://wa.me/5591999999999?text=${encodeURIComponent('Olá! Quero encomendar uma bolsa.')}`} className="bg-green-500 text-white px-4 py-2 rounded">Encomendar pelo WhatsApp</a>
            </section>
          </>
        )}

        {view === 'checkout' && (
          <CheckoutForm items={items} subtotal={subtotal} onBack={()=>setView('home')} onPlaceOrder={handlePlaceOrder} />
        )}

        {view === 'payment' && currentOrder && (
          <div className="grid grid-cols-1 gap-6">
            <PaymentSummary order={currentOrder} onConfirm={handleConfirmPayment} />
            <div className="text-sm text-rose-500">Depois do pagamento, envie o comprovante para o WhatsApp para que possamos confirmar o envio.</div>
          </div>
        )}

        {view === 'success' && (
          <div className="p-8 bg-white rounded-lg text-center">
            <h2 className="text-2xl font-semibold text-rose-800">Pedido confirmado!</h2>
            <p className="mt-2 text-rose-600">Obrigada pela compra — em breve entraremos em contato pelo WhatsApp para confirmar detalhes de envio.</p>
            <div className="mt-4">
              <a href="#colecao" onClick={()=>setView('home')} className="px-4 py-2 bg-rose-600 text-white rounded">Continuar comprando</a>
            </div>
          </div>
        )}

      </main>

      <footer className="bg-rose-100 border-t border-rose-200 mt-8">
        <div className="max-w-6xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <div className="font-semibold">Viviart Crochê</div>
            <div className="text-sm text-rose-600">@viviart.croche</div>
          </div>
          <div className="text-sm text-rose-600">Feito com ❤️</div>
        </div>
      </footer>

      <CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} items={items} subtotal={subtotal} updateQty={updateQty} remove={remove} onCheckout={handleCheckout} />
    </div>
  );
}
