export default function FilterBar({ tags, filters, onChange }) {
  const set = (key, value) => onChange(prev => ({ ...prev, [key]: prev[key] === value ? '' : value }))

  return (
    <div className="filter-bar">
      <div className="filter-tags">
        {tags.map(tag => (
          <button
            key={tag}
            className={`filter-tag ${filters.tag === tag ? 'active' : ''}`}
            onClick={() => set('tag', tag)}
          >{tag}</button>
        ))}
      </div>
      <div className="filter-controls">
        <select
          className="filter-select"
          value={filters.sort}
          onChange={e => onChange(prev => ({ ...prev, sort: e.target.value }))}
        >
          <option value="date">By Date</option>
          <option value="trending">Trending</option>
        </select>
        <select
          className="filter-select"
          value={filters.time_of_day}
          onChange={e => onChange(prev => ({ ...prev, time_of_day: e.target.value }))}
        >
          <option value="">Any Time</option>
          <option value="morning">Morning</option>
          <option value="afternoon">Afternoon</option>
          <option value="evening">Evening</option>
        </select>
      </div>
    </div>
  )
}
