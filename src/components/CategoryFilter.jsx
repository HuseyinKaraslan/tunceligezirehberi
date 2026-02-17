import './CategoryFilter.css'

function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="category-filter">
      {categories.map(category => (
        <button
          key={category.id}
          className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(category.id)}
          style={{
            '--category-color': category.color,
            backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
            borderColor: category.color,
            color: selectedCategory === category.id ? '#fff' : category.color
          }}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

export default CategoryFilter



