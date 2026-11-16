import { useState } from 'react'
import { Plus, Wine, Trash2 } from 'lucide-react'
import Panel from '../../components/Panel'
import SectionTitle from '../../components/SectionTitle'
import { formatPrice } from '../../utils/formatPrice'

export default function MenuPage({ menu, setMenu }) {
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Cocktails')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')

  function addItem(event) {
    event.preventDefault()

    const parsedPrice = Number(price)

    if (!name.trim() || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return
    }

    setMenu((current) => [
      ...current,
      {
        id: Date.now(),
        name: name.trim(),
        category,
        description: description.trim(),
        price: Math.round(parsedPrice * 100),
        available: true,
      },
    ])

    setName('')
    setDescription('')
    setPrice('')
    setCategory('Cocktails')
    setShowForm(false)
  }

  function toggleAvailability(id) {
    setMenu((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, available: !item.available }
          : item,
      ),
    )
  }

  function removeItem(id) {
    setMenu((current) => current.filter((item) => item.id !== id))
  }

  return (
    <>
      <SectionTitle
        eyebrow="OPERATIONS / CATALOGUE"
        title="Menu management"
        description="Manage your venue's menu and pricing."
        action={
          <button
            className="button button-primary"
            onClick={() => setShowForm((value) => !value)}
          >
            <Plus size={16} />
            Add item
          </button>
        }
      />

      {showForm && (
        <Panel title="New menu item" label="CATALOGUE / CREATE">
          <form className="form-grid" onSubmit={addItem}>
            <label className="field">
              <span>ITEM NAME</span>
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. House lemonade"
              />
            </label>

            <label className="field">
              <span>CATEGORY</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                <option>Cocktails</option>
                <option>Beer</option>
                <option>Wine</option>
                <option>Non-alcoholic</option>
                <option>Food</option>
              </select>
            </label>

            <label className="field">
              <span>PRICE (€)</span>
              <input
                required
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
                placeholder="12.50"
              />
            </label>

            <label className="field field-wide">
              <span>DESCRIPTION</span>
              <input
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the item"
              />
            </label>

            <div className="form-actions field-wide">
              <button
                type="button"
                className="button button-secondary"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="button button-primary">
                <Plus size={15} /> Create item
              </button>
            </div>
          </form>
        </Panel>
      )}

      <Panel title="Menu catalogue" label={`${menu.length} CONFIGURED ITEMS`}>
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ITEM</th>
                <th>CATEGORY</th>
                <th>PRICE</th>
                <th>AVAILABILITY</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {menu.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="menu-item-cell">
                      <span className="menu-item-icon">
                        <Wine size={18} />
                      </span>

                      <div>
                        <strong>{item.name}</strong>
                        <span>{item.description || 'No description'}</span>
                      </div>
                    </div>
                  </td>

                  <td>{item.category}</td>
                  <td className="price-cell">{formatPrice(item.price)}</td>

                  <td>
                    <button
                      className={`availability-toggle ${
                        item.available ? 'is-available' : ''
                      }`}
                      onClick={() => toggleAvailability(item.id)}
                    >
                      <span />
                      {item.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                    </button>
                  </td>

                  <td>
                    <button
                      className="small-action cancel-action"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Delete ${item.name}`}
                      title="Delete item"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}

              {menu.length === 0 && (
                <tr>
                  <td colSpan="5">
                    <div className="empty-state">Your menu is empty.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </>
  )
}

