import { useState } from 'react'
import { Icon } from '../components/Icons'
import ProductModal from '../components/ProductModal'
import SellModal    from '../components/SellModal'
import DeleteModal  from '../components/DeleteModal'
import { getProducts, saveProducts } from '../db/storage'

export default function InventoryPage({ products, onProductsChange }) {
  const [search,        setSearch]        = useState('')
  const [showAddModal,  setShowAddModal]  = useState(false)
  const [editProduct,   setEditProduct]   = useState(null)
  const [sellProduct,   setSellProduct]   = useState(null)
  const [deleteProduct, setDeleteProduct] = useState(null)

  const handleAdd = async (prod) => {
    const fresh   = await getProducts()
    const newProd = { ...prod, id: Date.now().toString(), createdAt: new Date().toISOString() }
    const updated = [...fresh, newProd]
    await saveProducts(updated)
    onProductsChange(updated)
    setShowAddModal(false)
  }

  const handleEdit = async (prod) => {
    const fresh   = await getProducts()
    const updated = fresh.map((p) => (p.id === prod.id ? prod : p))
    await saveProducts(updated)
    onProductsChange(updated)
    setEditProduct(null)
  }

  const handleSell = async (productId, qty) => {
    const fresh   = await getProducts()
    const updated = fresh.map((p) =>
      p.id === productId ? { ...p, stock: Math.max(0, p.stock - qty) } : p
    )
    await saveProducts(updated)
    onProductsChange(updated)
    setSellProduct(null)
  }

  const handleDelete = async (productId) => {
    const fresh   = await getProducts()
    const updated = fresh.filter((p) => p.id !== productId)
    await saveProducts(updated)
    onProductsChange(updated)
    setDeleteProduct(null)
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.code || '').toLowerCase().includes(search.toLowerCase())
  )

  const outOfStock = products.filter((p) => p.stock === 0).length

  return (
    <>
      <div className="main-header">
        <div className="page-title">Mi <span>Inventario</span></div>
      </div>
      <div className="content">
        <div className="stats-grid">
          <div className="stat-card accent1">
            <div className="stat-label">Total Productos</div>
            <div className="stat-value">{products.length}</div>
          </div>
          <div className="stat-card accent2">
            <div className="stat-label">Sin Stock</div>
            <div className="stat-value">{outOfStock}</div>
          </div>
        </div>

        <div className="toolbar">
          <div className="search-box">
            <span className="search-icon"><Icon name="search" size={16} /></span>
            <input placeholder="Buscar por nombre, código o categoría..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button className="btn-add" onClick={() => setShowAddModal(true)}>
            <Icon name="plus" size={16} /> Nuevo Producto
          </button>
        </div>

        {/* Tabla — desktop */}
        <div className="table-wrap desktop-only">
          <table>
            <thead>
              <tr>
                <th>Código</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6}>
                  <div className="empty-state">
                    <div className="empty-state-icon"><Icon name="spool" size={40} /></div>
                    <p>{search ? 'No se encontraron productos' : 'Todavía no hay productos. ¡Agregá el primero!'}</p>
                  </div>
                </td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id}>
                  <td><span className="code-badge">{p.code || '—'}</span></td>
                  <td>
                    <span className="prod-name">{p.name}</span>
                    {p.stock <= 5 && p.stock > 0 && <span className="badge-low"><Icon name="warning" size={11} /> Poco stock</span>}
                    {p.stock === 0 && <span className="badge-low" style={{ background: 'rgba(255,71,87,.1)', color: 'var(--danger)' }}>Sin stock</span>}
                  </td>
                  <td><span className="prod-cat">{p.category || '—'}</span></td>
                  <td><span className="price">${p.price.toLocaleString('es-AR')}</span></td>
                  <td><span className={`stock ${p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : ''}`}>{p.stock}</span></td>
                  <td>
                    <div className="actions">
                      <button className="btn-icon sell" title="Registrar venta" onClick={() => setSellProduct(p)}><Icon name="minus" size={14} /></button>
                      <button className="btn-icon" title="Editar" onClick={() => setEditProduct(p)}><Icon name="edit" size={14} /></button>
                      <button className="btn-icon danger" title="Eliminar" onClick={() => setDeleteProduct(p)}><Icon name="trash" size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tarjetas — mobile */}
        <div className="cards-list mobile-only">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Icon name="spool" size={40} /></div>
              <p>{search ? 'No se encontraron productos' : 'Todavía no hay productos. ¡Agregá el primero!'}</p>
            </div>
          ) : filtered.map((p) => (
            <div className="prod-card" key={p.id}>
              <div className="prod-card-top">
                <div>
                  <div className="prod-card-name">{p.name}</div>
                  <div className="prod-card-meta">
                    <span className="code-badge">{p.code || '—'}</span>
                    <span className="prod-cat">{p.category || '—'}</span>
                  </div>
                </div>
                <div className="prod-card-actions">
                  <button className="btn-icon sell" title="Registrar venta" onClick={() => setSellProduct(p)}><Icon name="minus" size={14} /></button>
                  <button className="btn-icon" title="Editar" onClick={() => setEditProduct(p)}><Icon name="edit" size={14} /></button>
                  <button className="btn-icon danger" title="Eliminar" onClick={() => setDeleteProduct(p)}><Icon name="trash" size={14} /></button>
                </div>
              </div>
              <div className="prod-card-bottom">
                <div className="prod-card-stat">
                  <span className="prod-card-stat-label">Precio</span>
                  <span className="price">${p.price.toLocaleString('es-AR')}</span>
                </div>
                <div className="prod-card-stat">
                  <span className="prod-card-stat-label">Stock</span>
                  <span className={`stock ${p.stock === 0 ? 'out' : p.stock <= 5 ? 'low' : ''}`}>{p.stock}</span>
                  {p.stock <= 5 && p.stock > 0 && <span className="badge-low"><Icon name="warning" size={10} /> Poco</span>}
                  {p.stock === 0 && <span className="badge-low" style={{ background: 'rgba(255,71,87,.1)', color: 'var(--danger)' }}>Sin stock</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddModal && <ProductModal existingCodes={products.map((p) => p.code)} onClose={() => setShowAddModal(false)} onSave={handleAdd} />}
      {editProduct  && <ProductModal product={editProduct} existingCodes={products.filter((p) => p.id !== editProduct.id).map((p) => p.code)} onClose={() => setEditProduct(null)} onSave={handleEdit} />}
      {sellProduct  && <SellModal product={sellProduct} onClose={() => setSellProduct(null)} onSell={handleSell} />}
      {deleteProduct && <DeleteModal product={deleteProduct} onClose={() => setDeleteProduct(null)} onConfirm={handleDelete} />}
    </>
  )
}