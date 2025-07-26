import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SiteCard from './SiteCard';
import AddSiteForm from './AddSiteForm';
import GlobalAlert from '../GlobalAlert';

function Site() {
  const [sites, setSites] = useState([]);
  const [form, setForm] = useState({ name: '', clientPayment: '' });
  const [alert, setAlert] = useState({ status: false, message: '', type: 'success' });
  const [showForm, setShowForm] = useState(false); // 👈 form toggle state

  const fetchSites = async () => {
    const res = await axios.get('https://attendanceserver.onrender.com/site');
    setSites(res.data);
  };

  const handleSiteSubmit = async (e) => {
    e.preventDefault();
    await axios.post('https://attendanceserver.onrender.com/site', form);
    setForm({ name: '', clientPayment: '' });
    fetchSites();
    setShowForm(false); // 👈 hide form after submit
    setAlert({ status: true, message: 'Site added successfully!', type: 'success' });
  };

  useEffect(() => { fetchSites(); }, []);

  return (
    <div className="container py-4">
      {alert.status && (
        <GlobalAlert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ status: false, message: '' })}
        />
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="m-0">Manage Sites</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add Site'}
        </button>
      </div>

      {showForm && (
        <AddSiteForm form={form} setForm={setForm} onSubmit={handleSiteSubmit} />
      )}

      <div className="row g-4 mt-2">
        {sites.map(site => (
          <div className="col-12 col-md-6 col-lg-4" key={site._id}>
            <SiteCard site={site} refreshSites={fetchSites} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Site;
