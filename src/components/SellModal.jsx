import { useState } from 'react'
import { Icon } from './Icons'

export default function SellModal({ product, onClose, onSell }) {
  const [qty, setQty] = useState(1)
  const max = product.stock

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Registrar Venta</div>
          <button className="btn-close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <div className="sell-info">
          <strong>{product.name}</strong>
          Stock actual: <span className="mono" style={{ color: 'var(--accent3)' }}>{product.stock}</span> unidades
        </div>
        <div className="field">
          <label>Cantidad vendida</label>
          <div className="qty-input">
            <button className="qty-btn" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <div className="qty-display">{qty}</div>
            <button className="qty-btn" onClick={() => setQty((q) => Math.min(max, q + 1))}>+</button>
          </div>
          {qty > max && <div style={{ color: 'var(--danger)', fontSize: 12, marginTop: 6 }}>No hay suficiente stock.</div>}
        </div>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm" onClick={() => qty <= max && onSell(product.id, qty)} disabled={qty > max}>
            Confirmar venta
          </button>
        </div>
      </div>
    </div>
  )
}