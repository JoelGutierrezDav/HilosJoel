import { Icon } from './Icons'

export default function DeleteModal({ product, onClose, onConfirm }) {
  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title">Eliminar Producto</div>
          <button className="btn-close" onClick={onClose}><Icon name="x" size={16} /></button>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          ¿Seguro que querés eliminar <strong style={{ color: 'var(--text)' }}>{product.name}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-confirm danger" onClick={() => onConfirm(product.id)}>Eliminar</button>
        </div>
      </div>
    </div>
  )
}