import { useState } from 'react'
import { Icon } from './Icons'

export default function ProductModal({ product, onClose, onSave, existingCodes = [] }) {
  const [form, setForm] = useState({
    code:     product?.code     || '',
    name:     product?.name     || '',
    category: product?.category || 'Hilo',
    price:    product?.price    || '',
    stock:    product?.stock    || '',
  })
  const [error, setError] = useState('')

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = () => {
    setError('')
    if (!form.code.trim()) return setError('El código es requerido.')
    if (!/^[a-zA-Z0-9]+$/.test(form.code.trim())) return setError('El código solo puede contener letras y números, sin espacios.')
    if (existingCodes.includes(form.code.trim().toUpperCase())) return setError('Ese código ya está en uso por otro producto.')
    if (!form.name.trim()) return setError('El nombre es requerido.')
    if (form.price === '' || isNaN(form.price) || Number(form.price) < 0) return setError('Ingresá un precio válido.')
    if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0) return setError('Ingresá una cantidad válida.')
    onSave({ ...(product || {}), ...form, code: form.code.trim().toUpperCase(), price: Number(form.price), stock: Number(form.stock) })
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">{product ? 'Editar Producto' : 'Nuevo Producto'}</div>
          <button className="btn-close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        {error && <div className="error-msg"><Icon name="warning" size={16} /> {error}</div>}

        <div className="field">
          <label>Código del producto</label>
          <div className="field-inner">
            <input name="code" placeholder="Ej: HJ001, ROJ40A..." value={form.code} onChange={handle}
              style={{ paddingLeft: 14, fontFamily: "'DM Mono', monospace", textTransform: 'uppercase' }} />
          </div>
        </div>
        <div className="field">
          <label>Nombre del producto</label>
          <div className="field-inner">
            <input name="name" placeholder="Ej: Hilo algodón rojo nº 40" value={form.name} onChange={handle} style={{ paddingLeft: 14 }} />
          </div>
        </div>
        <div className="field">
          <label>Categoría</label>
          <div className="field-inner">
            <select name="category" value={form.category} onChange={handle}>
              <option value="Hilo">Hilo</option>
              <option value="Repuesto">Repuesto</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>
        <div className="field">
          <label>Precio ($)</label>
          <div className="field-inner">
            <input name="price" type="number" placeholder="0.00" value={form.price} onChange={handle} style={{ paddingLeft: 14 }} />
          </div>
        </div>
        <div className="field">
          <label>Stock disponible</label>
          <div className="field-inner">
            <input name="stock" type="number" placeholder="0" value={form.stock} onChange={handle} style={{ paddingLeft: 14 }} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={submit}>{product ? 'Guardar cambios' : 'Agregar producto'}</button>
        </div>
      </div>
    </div>
  )
}