import React, { useState, useEffect } from 'react';
import { format, isSameDay, isSameWeek, isSameMonth } from 'date-fns';
import defaultCategories from "./defaultCategories.json"
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

    const [filter, setFilter] = useState('month');
    const [filterDate, setFilterDate] = useState(new Date());

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
        }
    };

    const handleSpendingChange = (e) => setNewSpending({
        ...newSpending,
        [e.target.name]: e.target.value
    });

    const handleFilterChange = (e) => setFilter(e.target.value);
    const handleFilterDateChange = (e) => setFilterDate(new Date(e.target.value));

    const handleRemoveSpending = (index) => {
        const updatedSpendings = spendings.filter((_, i) => i !== index);
        setSpendings(updatedSpendings);
    };

    const filterSpendings = (spendings) => {
        return spendings.filter(spending => {
            const spendingDate = new Date(spending.date);
            switch (filter) {
                case 'day':
                    return isSameDay(spendingDate, filterDate);
                case 'week':
                    return isSameWeek(spendingDate, filterDate, { weekStartsOn: 1 });
                case 'month':
                    return isSameMonth(spendingDate, filterDate);
                default:
                    return false;
            }
        });
    };

    const calculateTotal = (filteredSpendings) => {
        return filteredSpendings.reduce((acc, spending) => acc + parseFloat(spending.amount), 0);
    };

    const filteredSpendings = filterSpendings(spendings);
    const total = calculateTotal(filteredSpendings);

    return (
        <div className="Home">
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



            <div className="spendings-list">
                <h2>Spendings: {total} EGP</h2>
                <div className="filter-group">
                    <select value={filter} onChange={handleFilterChange}>
                        <option value="day">Per Day</option>
                        <option value="week">Per Week</option>
                        <option value="month">Per Month</option>
                    </select>
                    <input type="date" value={format(new Date(filterDate), 'yyyy-MM-dd')} onChange={handleFilterDateChange} />
                </div>
                <ul>
                    {filteredSpendings.map((spending, index) => (
                        <li key={index} className="spending-item">
                            {spending.category} - {spending.amount} EGP - {format(new Date(spending.date), 'yyyy-MM-dd')}
                            <button onClick={() => handleRemoveSpending(index)}>Remove</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;
