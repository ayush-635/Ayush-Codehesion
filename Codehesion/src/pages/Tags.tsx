import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/authContext';

interface Tag {
  id: number;
  name: string;
  color: string;
}

export const Tags = () => {
  const { token } = useAuth();
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [editingId, setEditingId] = useState<number | null>(null);
  const fetchTags = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/v1/admin/Tags`, {
        headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data?.data?.items && Array.isArray(response.data.data.items)) {
        setTags(response.data.data.items);
        } else if (response.data && Array.isArray(response.data.data)) {
        setTags(response.data.data);
        } else if (Array.isArray(response.data)) {
        setTags(response.data);
        } else {
        setTags([]);
        }
    } catch (err) {
        console.error('Failed to fetch tags', err);
        setTags([]);
    }
};

  useEffect(() => { 
    if (token) fetchTags(); 
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/v1/admin/Tags/${editingId}`, { name, color }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/v1/admin/Tags`, { name, color }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setName('');
      setEditingId(null);
      fetchTags();
    } catch (err) {
      console.error('Operation failed', err);
    }
  };

  const handleEdit = (tag: Tag) => {
    setEditingId(tag.id);
    setName(tag.name);
    setColor(tag.color);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this tag?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/v1/admin/Tags/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTags();
    } catch (err) {
      console.error('Failed to delete tag', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Manage Tags</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input type="text" placeholder="Tag Name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: '6px' }} />
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ padding: '2px', width: '40px', height: '34px' }} />
        <button type="submit">{editingId ? 'Update Tag' : 'Create Tag'}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setName(''); }}>Cancel</button>}
      </form>
      <ul>
        {Array.isArray(tags) && tags.length > 0 ? (
          tags.map((tag) => (
            <li key={tag.id} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '8px', borderBottom: '1px solid #eee' }}>
              <span style={{ backgroundColor: tag.color, color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>{tag.name}</span>
              <button onClick={() => handleEdit(tag)} style={{ marginLeft: 'auto' }}>Edit</button>
              <button onClick={() => handleDelete(tag.id)} style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>Delete</button>
            </li>
          ))
        ) : (
          <p style={{ color: '#888', fontStyle: 'italic' }}>No tags</p>
        )}
      </ul>
    </div>
  );
};
