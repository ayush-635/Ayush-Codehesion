import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

interface Word {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
  words?: Word[];
}

export const Home = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/admin/categories`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCategories(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  if (loading) return <p style={{ padding: '20px' }}>Loading data structure...</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ display: 'flex', gap: '30px', padding: '20px' }}>
      {/* Categories Column */}
      <div style={{ flex: 1 }}>
        <h3>Categories</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {categories.map((category) => (
            <li 
              key={category.id} 
              onClick={() => setSelectedCategory(category)}
              style={{
                padding: '12px',
                margin: '6px 0',
                background: selectedCategory?.id === category.id ? '#d1e7dd' : '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: selectedCategory?.id === category.id ? 'bold' : 'normal'
              }}
            >
              {category.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Nested Navigational Structure View */}
      <div style={{ flex: 1, background: '#fafafa', padding: '15px', borderRadius: '6px', border: '1px solid #eee' }}>
        <h3>Nested Structure</h3>
        {selectedCategory ? (
          <div>
            <h4>Words inside "{selectedCategory.name}"</h4>
            {selectedCategory.words && selectedCategory.words.length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {selectedCategory.words.map((word) => (
                  <li key={word.id} style={{ margin: '6px 0', fontSize: '1.1rem' }}>
                    {word.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#777', fontStyle: 'italic' }}>No nested items found in this category.</p>
            )}
          </div>
        ) : (
          <p style={{ color: '#888' }}>Select a category on the left to see its nested contents.</p>
        )}
      </div>
    </div>
  );
};
