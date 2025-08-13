import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, X, Package, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

const ToolForm = ({ tool, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    lifeLimit: '',
    thresholdLimit: '',
    stock: '',
    reusable: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (tool) {
      setFormData({
        name: tool.name || '',
        description: tool.description || '',
        category: tool.category || '',
        lifeLimit: tool.lifeLimit || '',
        thresholdLimit: tool.thresholdLimit || '',
        stock: tool.stock || '',
        reusable: tool.reusable || false,
      });
    }
  }, [tool]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const base = import.meta?.env?.VITE_API_URL || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'http://localhost:5000' : 'https://tool-managemnt.onrender.com');
      
      let response;
      if (tool) {
        // Edit existing tool
        response = await axios.put(`${base}/api/tools/${tool._id}`, formData);
      } else {
        // Add new tool
        response = await axios.post(`${base}/api/tools`, formData);
      }
      setSuccess(true);
      alert(tool ? 'Tool updated successfully!' : 'Tool added successfully!');
      onSubmit(response.data); // Pass the new/updated tool data back
    } catch (err) {
      console.error('Error saving tool:', err);
      setError(err.response?.data?.message || 'Failed to save tool. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100">
      <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            {tool ? <Edit className="w-6 h-6 text-blue-600" /> : <Plus className="w-6 h-6 text-blue-600" />}
          </div>
          {tool ? 'Edit Tool' : 'Add New Tool'}
        </h3>
        <p className="text-slate-600 mt-1">{tool ? 'Modify tool details' : 'Register a new tool in the system'}</p>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {tool ? 'Tool updated.' : 'Tool added.'}</span>
          </div>
        )}

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Tool Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="lifeLimit" className="block text-sm font-medium text-slate-700 mb-1">Life Limit (hours)</label>
            <input
              type="number"
              id="lifeLimit"
              name="lifeLimit"
              value={formData.lifeLimit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
          </div>
          <div>
            <label htmlFor="thresholdLimit" className="block text-sm font-medium text-slate-700 mb-1">Threshold Limit (hours)</label>
            <input
              type="number"
              id="thresholdLimit"
              name="thresholdLimit"
              value={formData.thresholdLimit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="1"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-slate-700 mb-1">Stock (units)</label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              min="0"
            />
          </div>
          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="reusable"
              name="reusable"
              checked={formData.reusable}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <label htmlFor="reusable" className="ml-2 block text-sm text-slate-900">Reusable Tool</label>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            {tool ? 'Update Tool' : 'Add Tool'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ToolForm;