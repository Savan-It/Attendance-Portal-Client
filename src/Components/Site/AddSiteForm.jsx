import React from 'react';

function AddSiteForm({ form, setForm, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="row g-2 mb-4">
      <div className="col-md-5">
        <input
          type="text"
          className="form-control"
          placeholder="Site Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="col-md-4">
        <input
          type="number"
          className="form-control"
          placeholder="Initial Client Payment"
          value={form.clientPayment}
          onChange={(e) => setForm({ ...form, clientPayment: e.target.value })}
          required
        />
      </div>
      <div className="col-md-3">
        <button type="submit" className="btn btn-primary w-100">Add Site</button>
      </div>
    </form>
  );
}

export default AddSiteForm;
