"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const comprimirImagen = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 1600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(newFile);
          } else {
            reject(new Error("Error creando el blob de imagen"));
          }
        }, 'image/webp', 0.82);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export default function AdminPanel() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [editando, setEditando] = useState<any>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  const mostrarNotificacion = (msg: string, type: "ok" | "err" = "ok") => {
    setToast({ msg, type });
    setTimeout(() => {
      setToast(null);
    }, 2000);
  };

  const emptyForm = {
    nombre: "", dosis: "", precio: 0, imagen: "", visible: true, categoria: "",
    descripcion_es: "", descripcion_pt: "", descripcion_en: "",
    detalles_es: "", detalles_pt: "", detalles_en: ""
  };

  const [form, setForm] = useState<any>(emptyForm);

  const cargarProductos = async () => {
    const { data } = await supabase.from('productos').select('*').order('nombre', { ascending: true });
    if (data) setProductos(data);
    setLoading(false);
  };

  useEffect(() => {
    if (auth) cargarProductos();
  }, [auth]);

  const login = (e: any) => {
    e.preventDefault();
    if (password === "admin2026") {
      setAuth(true);
      mostrarNotificacion("Sesión iniciada correctamente");
    } else {
      mostrarNotificacion("Contraseña incorrecta", "err");
    }
  };

  const handleSubirFoto = async (e: any) => {
    const fileOriginal = e.target.files[0];
    if (!fileOriginal) return;
    setSubiendoFoto(true);
    
    try {
      const fileComprimido = await comprimirImagen(fileOriginal);
      const fileExt = fileComprimido.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage.from('productos').upload(fileName, fileComprimido);
      
      if (error) {
        mostrarNotificacion("Error subiendo foto: " + error.message, "err");
      } else {
        const { data } = supabase.storage.from('productos').getPublicUrl(fileName);
        setForm({ ...form, imagen: data.publicUrl });
        mostrarNotificacion("¡Foto optimizada y cargada!");
      }
    } catch (error) {
      mostrarNotificacion("Error al comprimir la imagen", "err");
      console.error(error);
    }
    
    setSubiendoFoto(false);
  };

  const guardarProducto = async (e: any) => {
    e.preventDefault();
    const payloadBase: any = {
      nombre: form.nombre,
      dosis: form.dosis ? form.dosis.trim() : "",
      precio: form.precio,
      imagen: form.imagen,
      visible: form.visible,
      descripcion_es: form.descripcion_es,
      descripcion_pt: form.descripcion_pt,
      descripcion_en: form.descripcion_en,
      categoria: form.categoria || "",
      detalles_es: form.detalles_es || "",
      detalles_pt: form.detalles_pt || "",
      detalles_en: form.detalles_en || ""
    };

    let res = editando
      ? await supabase.from('productos').update(payloadBase).eq('id', editando.id)
      : await supabase.from('productos').insert([payloadBase]);

    // Si aún no corriste el SQL de las columnas nuevas, guarda automáticamente solo las columnas originales sin fallar
    if (res.error) {
      const { categoria, detalles_es, detalles_pt, detalles_en, ...fallbackPayload } = payloadBase;
      res = editando
        ? await supabase.from('productos').update(fallbackPayload).eq('id', editando.id)
        : await supabase.from('productos').insert([fallbackPayload]);
    }

    if (res.error) {
      return mostrarNotificacion("Error al guardar: " + res.error.message, "err");
    }

    mostrarNotificacion(editando ? "Producto actualizado con éxito" : "Producto creado con éxito");
    setForm(emptyForm);
    setEditando(null);
    document.getElementById('form-modal')?.classList.add('hidden');
    cargarProductos();
  };

  const eliminarProducto = async (id: string) => {
    if (confirm("¿Seguro que deseas eliminar este producto?")) {
      await supabase.from('productos').delete().eq('id', id);
      mostrarNotificacion("Producto eliminado");
      cargarProductos();
    }
  };

  const toggleVisibilidad = async (producto: any) => {
    const nuevaVisibilidad = !producto.visible;
    const { error } = await supabase.from('productos').update({ visible: nuevaVisibilidad }).eq('id', producto.id);
    if (!error) {
      setProductos(prev => prev.map(p => p.id === producto.id ? { ...p, visible: nuevaVisibilidad } : p));
      mostrarNotificacion(nuevaVisibilidad ? "Producto visible en tienda" : "Producto oculto");
    }
  };

  if (!auth) {
    return (
      <div className="min-h-screen bg-[#f4f7f6] flex items-center justify-center relative">
        {toast && (
          <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-xl shadow-lg font-bold text-sm text-white flex items-center gap-2.5 transition-all duration-300 ${toast.type === "ok" ? "bg-[#00b050]" : "bg-red-600"}`}>
            <span>{toast.type === "ok" ? "✓" : "✕"}</span>
            {toast.msg}
          </div>
        )}
        <form onSubmit={login} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center w-full max-w-sm">
          <img src="/logo.jpeg" alt="Logo" className="h-16 mx-auto mb-6 rounded-full" />
          <h2 className="text-gray-800 text-xl font-bold mb-6">Acceso Admin</h2>
          <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded mb-4 focus:outline-none focus:border-[#00b050]" />
          <button type="submit" className="w-full bg-[#00b050] text-white font-bold py-3 rounded">Entrar</button>
        </form>
      </div>
    );
  }

  const productosFiltrados = productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#f8faf9] p-4 md:p-8 font-sans relative">
      
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-5 py-3.5 rounded-xl shadow-xl font-bold text-sm text-white flex items-center gap-2.5 transition-all duration-300 ${toast.type === "ok" ? "bg-[#00b050]" : "bg-red-600"}`}>
          <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {toast.type === "ok" ? "✓" : "!"}
          </span>
          {toast.msg}
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Productos Registrados ({productos.length})</h1>
            <p className="text-sm text-gray-500 mt-1">Controla precios, categorías, fichas técnicas y visibilidad.</p>
          </div>
          <button 
            onClick={() => { setEditando(null); setForm(emptyForm); document.getElementById('form-modal')?.classList.remove('hidden'); }}
            className="bg-[#00b050] hover:bg-[#009040] text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <span>+</span> Agregar Producto
          </button>
        </div>

        <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center px-4">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Buscar producto por nombre en el catálogo..." 
            value={busqueda} 
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none p-3 text-gray-700"
          />
        </div>

        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-[#d32f2f] font-black uppercase tracking-wider mb-6 text-sm">CATÁLOGO PRINCIPAL</h3>
          
          {loading ? (
            <p className="text-gray-500">Cargando inventario...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {productosFiltrados.map(p => (
                <div key={p.id} className={`bg-white border ${p.visible ? 'border-gray-200' : 'border-gray-200 opacity-60'} rounded-2xl p-3 flex items-center justify-between gap-3 transition-all hover:shadow-md`}>
                  
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-14 h-14 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                      {p.imagen ? (
                        <img src={p.imagen} alt={p.nombre} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-[10px] text-gray-400 text-center leading-tight">Sin<br/>Foto</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">{p.nombre}</h4>
                      {p.dosis && p.dosis.trim() !== "" && (
                        <p className="text-xs text-gray-500">{p.dosis}</p>
                      )}
                      <p className="text-sm font-black text-[#00b050] mt-0.5">{p.precio} USD</p>
                    </div>
                  </div>

                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => toggleVisibilidad(p)} className={`p-2 rounded-lg border transition-colors ${p.visible ? 'text-[#00b050] border-gray-100 hover:bg-green-50' : 'text-gray-400 border-gray-100 hover:bg-gray-50'}`} title={p.visible ? "Ocultar" : "Mostrar"}>
                      {p.visible ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                      )}
                    </button>
                    <button onClick={() => { setEditando(p); setForm({ ...emptyForm, ...p, dosis: p.dosis || "" }); document.getElementById('form-modal')?.classList.remove('hidden'); }} className="p-2 text-gray-500 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors" title="Editar">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                    <button onClick={() => eliminarProducto(p.id)} className="p-2 text-gray-500 rounded-lg border border-gray-100 hover:bg-red-50 hover:text-red-500 transition-colors" title="Eliminar">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Formulario */}
        <div id="form-modal" className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">{editando ? "Editar Producto" : "Nuevo Producto"}</h2>
              <button type="button" onClick={() => document.getElementById('form-modal')?.classList.add('hidden')} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={guardarProducto} className="p-6 overflow-y-auto space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Nombre</label>
                  <input required type="text" value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#00b050]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Dosis (Opcional)</label>
                  <input type="text" placeholder="Ej: 10MG (o vacío)" value={form.dosis || ""} onChange={e => setForm({...form, dosis: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#00b050]" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Precio (USD)</label>
                  <input required type="number" step="0.01" value={form.precio} onChange={e => setForm({...form, precio: parseFloat(e.target.value)})} className="w-full bg-white border border-gray-200 p-3 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#00b050]" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Categoría</label>
                <select value={form.categoria || ""} onChange={e => setForm({...form, categoria: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-lg text-sm text-gray-800 focus:outline-none focus:border-[#00b050]">
                  <option value="">Automática (Según el nombre del péptido)</option>
                  <option value="peptidos">Péptidos de Investigación</option>
                  <option value="cosmeticos">Péptidos Cosméticos</option>
                  <option value="mezclas">Mezclas de Péptidos (Blends)</option>
                  <option value="biorreguladores">Biorreguladores</option>
                  <option value="suministros">Suministros y Diluyentes</option>
                </select>
              </div>

              <div className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                <label className="text-xs font-bold text-gray-500 mb-2 block">Imagen del Producto</label>
                <input type="file" accept="image/*" onChange={handleSubirFoto} className="text-sm text-gray-600 w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-[#00b050] hover:file:bg-green-100" />
                {subiendoFoto && <span className="text-xs text-blue-500 block mt-2">Optimizando y subiendo imagen...</span>}
                {form.imagen && <img src={form.imagen} alt="Preview" className="h-20 object-contain mt-3 rounded border border-gray-200 bg-white" />}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Resumen Corto (ES)</label>
                  <textarea required value={form.descripcion_es} onChange={e => setForm({...form, descripcion_es: e.target.value})} className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-xs text-gray-800 h-16" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Resumen Corto (PT)</label>
                  <textarea required value={form.descripcion_pt} onChange={e => setForm({...form, descripcion_pt: e.target.value})} className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-xs text-gray-800 h-16" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Resumen Corto (EN)</label>
                  <textarea required value={form.descripcion_en} onChange={e => setForm({...form, descripcion_en: e.target.value})} className="w-full bg-white border border-gray-200 p-2.5 rounded-lg text-xs text-gray-800 h-16" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3">
                <p className="text-xs font-bold text-gray-700 mb-2">Ficha Técnica Detallada / Composición / Recomendaciones (Opcional - se muestra al abrir el producto)</p>
                <div className="space-y-3">
                  <textarea placeholder="Detalles completos en Español (composición, secuencia, protocolo de estudio...)" value={form.detalles_es || ""} onChange={e => setForm({...form, detalles_es: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-lg text-xs text-gray-800 h-20" />
                  <textarea placeholder="Detalhes completos em Português (opcional)" value={form.detalles_pt || ""} onChange={e => setForm({...form, detalles_pt: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-lg text-xs text-gray-800 h-16" />
                  <textarea placeholder="Full details in English (optional)" value={form.detalles_en || ""} onChange={e => setForm({...form, detalles_en: e.target.value})} className="w-full bg-white border border-gray-200 p-3 rounded-lg text-xs text-gray-800 h-16" />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" id="visible" checked={form.visible} onChange={e => setForm({...form, visible: e.target.checked})} className="w-4 h-4 text-[#00b050] rounded border-gray-300 focus:ring-[#00b050]" />
                <label htmlFor="visible" className="text-sm text-gray-700 font-semibold">Producto Visible en Tienda</label>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-100 mt-6">
                <button type="button" onClick={() => document.getElementById('form-modal')?.classList.add('hidden')} className="flex-1 bg-white border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-50">Cancelar</button>
                <button type="submit" className="flex-1 bg-[#00b050] hover:bg-[#009040] text-white font-bold py-3 rounded-lg shadow-md">{editando ? "Guardar Cambios" : "Agregar Producto"}</button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}