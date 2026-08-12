import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useAuth } from '../context/authContext';

export const Profile = () => {
  const { token } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: '',
      lastName: '',
      email: '',
    },
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // route: /v1/admin/Users/current
        await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/v1/admin/Users/current`,
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setStatus({ success: 'Profile updated' });
      } catch (error: any) {
        setStatus({ error: error.response?.data?.message || 'Failed to update profile.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/v1/admin/Users/current`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = response.data.data || response.data;
        formik.setValues({
          name: userData.name || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
        });
      } catch (err) {
        console.error('Failed to load profile data', err);
      }
    };
    if (token) fetchProfile();
  }, [token]);

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h2>Edit Profile</h2>
      {formik.status?.success && <p style={{ color: 'green' }}>{formik.status.success}</p>}
      {formik.status?.error && <p style={{ color: 'red' }}>{formik.status.error}</p>}
      
      <form onSubmit={formik.handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>First Name</label>
          <input name="name" type="text" onChange={formik.handleChange} value={formik.values.name} required style={{ width: '100%', padding: '6px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>Last Name</label>
          <input name="lastName" type="text" onChange={formik.handleChange} value={formik.values.lastName} required style={{ width: '100%', padding: '6px' }} />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block' }}>Email Address</label>
          <input name="email" type="email" onChange={formik.handleChange} value={formik.values.email} required style={{ width: '100%', padding: '6px' }} />
        </div>
        <button type="submit" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? 'Saving' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};
