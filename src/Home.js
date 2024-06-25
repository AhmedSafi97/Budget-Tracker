import React, { useState, useEffect } from 'react';
import { format, isSameMonth } from 'date-fns';
import defaultCategories from "./defaultCategories.json";
import './Home.css';

function Home() {
    const [categories] = useState(() => {
        const savedCategories = localStorage.getItem('categories');
        return savedCategories ? JSON.parse(savedCategories) : [];
    });
    const [spendings, setSpendings] = useState(() => {
        const savedSpendings = localStorage.getItem('spendings');
        return savedSpendings ? JSON.parse(savedSpendings) : defaultCategories;
    });
    const [newSpending, setNewSpending] = useState({
        category: '',
        amount: '',
        date: new Date(),
    });

    const [filterDate, setFilterDate] = useState(new Date());
    const [filterCategory, setFilterCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('spendings', JSON.stringify(spendings));
    }, [spendings]);

    const handleAddSpending = () => {
        if (newSpending.category && newSpending.amount) {
            setSpendings([...spendings, newSpending]);
            setNewSpending({ category: '', amount: '', date: new Date() });
            setIsModalOpen(false); // Close modal after adding spending
        }
    };

    const handleSpendingChange = (e) => setNewSpending({
        ...newSpending,
        [e.target.name]: e.target.value
    });

    const handleFilterDateChange = (e) => setFilterDate(new Date(e.target.value));
    const handleFilterCategoryChange = (e) => setFilterCategory(e.target.value);

    const handleRemoveSpending = (index) => {
        const updatedSpendings = spendings.filter((_, i) => i !== index);
        setSpendings(updatedSpendings);
    };

    const filterSpendings = (spendings) => {
        return spendings.filter(spending => {
            const spendingDate = new Date(spending.date);
            const isSameMonthYear = isSameMonth(spendingDate, filterDate);
            const isSameCategory = filterCategory === 'all' || spending.category === filterCategory;
            return isSameMonthYear && isSameCategory;
        });
    };

    const calculateTotal = (filteredSpendings) => {
        return filteredSpendings.reduce((acc, spending) => acc + parseFloat(spending.amount), 0);
    };

    const filteredSpendings = filterSpendings(spendings);
    const total = calculateTotal(filteredSpendings);

    const closeModal = (e) => {
        if (e.target.className === 'modal') {
            setIsModalOpen(false);
        }
    };

    const handleExport = () => {
        const blob = new Blob([JSON.stringify(filteredSpendings)], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'spendings.json');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="Home">
            <div className="spendings-list">
                <h2>Spendings: {total} EGP</h2>
                <div className="filter-group">
                    <input type="month" value={format(new Date(filterDate), 'yyyy-MM')} onChange={handleFilterDateChange} />
                    <select value={filterCategory} onChange={handleFilterCategoryChange}>
                        <option value="all">All Categories</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                        ))}
                    </select>
                </div>
                <button onClick={handleExport} style={{
                    padding: '15px',
                    width: 'fit-content',
                    background: 'transparent',
                    border: 'solid 1px',
                    borderRadius: '3px'
                }}>Export Spendings</button>
                <ul className="spending-items">
                    {filteredSpendings.map((spending, index) => (
                        <li key={index} className="spending-item">
                            <div className="spending-details">
                                <span className="spending-category">{spending.category}</span>
                                <span className="spending-amount">{spending.amount} EGP</span>
                                <span className="spending-date">{format(new Date(spending.date), 'yyyy-MM-dd')}</span>
                            </div>
                            <button className="remove-button" onClick={() => handleRemoveSpending(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>

            <button className="add-button" onClick={() => setIsModalOpen(true)}>+</button>

            {isModalOpen && (
                <div className="modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="input-group">
                            <select name="category" value={newSpending.category} onChange={handleSpendingChange}>
                                <option value="">Select Category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                            <input type="number" name="amount" value={newSpending.amount} onChange={handleSpendingChange} placeholder="Amount (EGP)" />
                            <input type="date" name="date" value={format(new Date(newSpending.date), 'yyyy-MM-dd')} onChange={handleSpendingChange} />
                            <button onClick={handleAddSpending}>Add Spending</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Home;
