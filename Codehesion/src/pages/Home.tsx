import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';
import { Link, Outlet, useParams } from 'react-router-dom';

interface Category {
  id: number;
  name: string;
}

export const Home = () => {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { categoryId } = useParams();

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
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchCategories();
  }, [token]);

  if (loading) return <p style={{ padding: '20px' }}>Loading</p>;
  if (error) return <p style={{ padding: '20px', color: 'red' }}>{error}</p>;

  return (
    <div style={{ display: 'flex', gap: '30px', padding: '20px', fontFamily: 'sans-serif' }}>
      { }
      <div style={{ flex: 1 }}>
        <h3>Categories Navigation</h3>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {categories.map((category) => {
            const isActive = Number(categoryId) === category.id;
            return (
              <Link
                key={category.id}
                to={`/home/categories/${category.id}`}
                style={{
                  padding: '12px',
                  background: isActive ? '#d1e7dd' : '#f8f9fa',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: isActive ? 'bold' : 'normal'
                }}
              >
                {category.name}
              </Link>
            );
          })}
        </nav>
      </div>

      { }
      <div style={{ flex: 1, background: '#fafafa', padding: '15px', borderRadius: '6px', border: '1px solid #eee' }}>
        <Outlet />
      </div>
    </div>
  );
};

interface Word {
  id: number;
  name: string;
}

export const CategoryWordsView = () => {
  const { token } = useAuth();
  const { categoryId } = useParams();
  const [categoryName, setCategoryName] = useState<string>('');
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/admin/categories/${categoryId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const fullData = response.data.data || response.data;
        setCategoryName(fullData.name || '');
        setWords(fullData.words || []);
      } catch (err) {
        console.error("Failed loading category dynamic parameters", err);
      } finally {
        setLoading(false);
      }
    };

    if (token && categoryId) {
      fetchWords();
    }
  }, [categoryId, token]);

  if (loading) return <p style={{ color: '#666' }}>Navigating details</p>;

  return (
    <div>
      <h4>Words inside "{categoryName}"</h4>
      {words.length > 0 ? (
        <ul style={{ paddingLeft: '20px' }}>
          {words.map((word) => (
            <li key={word.id} style={{ margin: '8px 0', fontSize: '1.1rem', color: '#333' }}>
              {word.name} (ID: {word.id})
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: '#777', fontStyle: 'italic' }}>No words found </p>
      )}
    </div>
  );
};
