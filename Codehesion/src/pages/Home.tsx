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
  const [wordsLoading, setWordsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/admin/categories`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data && Array.isArray(response.data.data)) {
          setCategories(response.data.data);
        } else {
          setCategories([]);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCategories();
    }
  }, [token]);

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category);
    setWordsLoading(true);
    
    try {
      // Postman route:     /v1/admin/categories/:id
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/v1/admin/categories/${category.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const fullCategoryData = response.data.data || response.data;
      
      setSelectedCategory(fullCategoryData);
    } catch (err: any) {
      console.error("Failed to fetch words for category", err);
    } finally {
      setWordsLoading(false);
    }
  };

  if (loading) return <p style={{ padding: '20px' }}>Loading</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ display: 'flex', gap: '30px', padding: '20px', fontFamily: 'sans-serif' }}>
      {}
      <div style={{ flex: 1 }}>
        <h3>Categories</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {categories.map((category) => (
            <li 
              key={category.id} 
              onClick={() => handleCategoryClick(category)}
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

      {}
      <div style={{ flex: 1, background: '#fafafa', padding: '15px', borderRadius: '6px', border: '1px solid #eee' }}>
        <h3>Nested Words Structure</h3>
        
        {wordsLoading ? (
          <p style={{ color: '#666' }}>Fetching words</p>
        ) : selectedCategory ? (
          <div>
            <h4>Words inside "{selectedCategory.name}"</h4>
            {selectedCategory.words && selectedCategory.words.length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {selectedCategory.words.map((word) => (
                  <li key={word.id} style={{ margin: '8px 0', fontSize: '1.1rem', color: '#333' }}>
                    {word.name} (ID: {word.id})
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#777', fontStyle: 'italic' }}>Nothing found</p>
            )}
          </div>
        ) : (
          <p style={{ color: '#888' }}>Select a category on the left to see its words</p>
        )}
      </div>
    </div>
  );
};
