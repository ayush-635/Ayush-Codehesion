import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

interface Category {
  id: number;
  name: string;
}

export const ManageCategoryWords = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [wordId, setWordId] = useState<string>('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Fetch the categories list
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/admin/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        }
      } catch (err) {
        console.error('Failed to pull categories', err);
      }
    };
    if (token) fetchCategories();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryId || !wordId) return;

    setSubmitting(true);
    setStatus(null);

    try {
    await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/v1/admin/categories/${selectedCategoryId}/words`,
        { wordId: Number(wordId) }, 
        {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        }
    );

    setStatus({ type: 'success', message: 'Word linked to category' });
    setWordId(''); 
    } catch (error: any) {
      console.error(error);
      setStatus({
        type: 'error',
        message: error.response?.data?.message || 'Failed to add word to target category parameters',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '450px' }}>
      <h2>Add Word to Category</h2>
      <p style={{ color: '#666', fontSize: '0.95rem' }}>
        Select a category layout item below and supply the number matching an existing word index
      </p>

      {status && (
        <div style={{
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '15px',
          backgroundColor: status.type === 'success' ? '#d1e7dd' : '#f8d7da',
          color: status.type === 'success' ? '#0f5132' : '#842029',
          border: `1px solid ${status.type === 'success' ? '#badbcc' : '#f5c2c7'}`
        }}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Target Category</label>
          <select
            value={selectedCategoryId}
            onChange={(e) => setSelectedCategoryId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="">Choose category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name} (ID: {category.id})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Word ID</label>
          <input
            type="number"
            placeholder="e.g. 43"
            value={wordId}
            onChange={(e) => setWordId(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '10px 15px',
            backgroundColor: '#0d6efd',
            color: '#white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          {submitting ? 'Linking' : 'Link Word to Category'}
        </button>
      </form>
    </div>
  );
};
