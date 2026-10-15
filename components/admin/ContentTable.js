export default function ContentTable({ items, cols, onEdit, onDelete }) {
  if (!items.length) return <p className="empty-state">No items yet.</p>

  return (
    <div className="content-table-wrap">
      <table className="content-table">
        <thead>
          <tr>
            {cols.map(c => <th key={c}>{c.replace(/_/g, ' ')}</th>)}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              {cols.map(c => (
                <td key={c}>
                  {typeof item[c] === 'boolean'
                    ? (item[c] ? '✓' : '—')
                    : item[c] != null
                      ? String(item[c]).slice(0, 60)
                      : '—'
                  }
                </td>
              ))}
              <td className="table-actions">
                <button className="btn-table-edit" onClick={() => onEdit(item)}>Edit</button>
                <button className="btn-table-delete" onClick={() => onDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
