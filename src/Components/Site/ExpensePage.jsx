import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { currencyFormat } from '../../utils/currency';

function ExpensePage() {
    const { id } = useParams();
    const [site, setSite] = useState(null);
    const [form, setForm] = useState({ date: '', type: '', amount: '' });
    const navigate = useNavigate();

    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        await axios.post(`https://attendanceserver.onrender.com/site/${id}/expense`, form);
        setForm({ date: '', type: '', amount: '' });
        fetchSite();
    };

    const handleDelete = async (expenseId) => {
        await axios.delete(`https://attendanceserver.onrender.com/site/${id}/expense/${expenseId}`);
        fetchSite();
    };

    const fetchSite = useCallback(async () => {
        const res = await axios.get(`https://attendanceserver.onrender.com/site/${id}`);
        setSite(res.data);
    }, [id]);

    useEffect(() => {
        fetchSite();
    }, [fetchSite]);

    if (!site) return <div className="container py-4">Loading...</div>;

    const total = site.expenses.reduce((sum, e) => sum + e.amount, 0);
    const manpowerTotal = site.manpower?.reduce((sum, emp) => sum + emp.total, 0) || 0;

    return (
        <div className="container py-4">
            <div className="mb-3">
                <button className="btn btn-outline-secondary" onClick={() => navigate('/site')}>
                    ← Back to All Sites
                </button>
            </div>
            <h4>{site.name} - Expense Details</h4>
            <p className="mb-2">Total Expenses: {currencyFormat(total)}</p>

            <form onSubmit={handleExpenseSubmit} className="row g-2 mb-4">
                <div className="col-md-4">
                    <input type="date" className="form-control" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
                <div className="col-md-4">
                    <input type="text" className="form-control" placeholder="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required />
                </div>
                <div className="col-md-3">
                    <input type="number" className="form-control" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div className="col-md-1">
                    <button className="btn btn-success w-100">Add</button>
                </div>
            </form>

            <table className="table table-bordered table-sm mb-4">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {site.expenses.map(exp => (
                        <tr key={exp._id}>
                            <td>{new Date(exp.date).toLocaleDateString()}</td>
                            <td>{exp.type}</td>
                            <td>{currencyFormat(exp.amount)}</td>
                            <td>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exp._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                    {site.expenses.length === 0 && (
                        <tr><td colSpan="4" className="text-center text-muted">No expenses yet.</td></tr>
                    )}
                </tbody>
            </table>

            <h5>Manpower Summary</h5>
            <table className="table table-bordered table-sm">
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Days</th>
                        <th>Total Cost</th>
                    </tr>
                </thead>
                <tbody>
                    {site.manpower && site.manpower.length > 0 ? (
                        site.manpower.map((emp, idx) => (
                            <tr key={idx}>
                                <td>{emp.name}</td>
                                <td>{emp.days}</td>
                                <td>{currencyFormat(emp.total)}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="3" className="text-center text-muted">No manpower data available.</td></tr>
                    )}
                    <tr className="table-info fw-bold">
                        <td colSpan="2">Total Manpower Cost</td>
                        <td>{currencyFormat(manpowerTotal)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default ExpensePage;
