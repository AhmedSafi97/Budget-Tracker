import React, { useState, useEffect } from 'react';
import defaultCategories from "./defaultCategories.json"
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
  });
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  const handleCategoryChange = (e) => setNewCategory(e.target.value);

  const handleRemoveCategory = (category) => {
    const updatedCategories = categories.filter(cat => cat !== category);
    setCategories(updatedCategories);
  };

  return (
    <div className="Categories">
      <div className="input-group">
        <input type="text" value={newCategory} onChange={handleCategoryChange} placeholder="New Category" />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      <div className="category-list">
        <h2>Categories</h2>
        <ul>
          {categories.map((category, index) => (
            <li key={index}>
              {category}
              <button onClick={() => handleRemoveCategory(category)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Categories;
