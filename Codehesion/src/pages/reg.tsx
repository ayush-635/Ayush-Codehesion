import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { token } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
    onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
      try {
        // Look up the exact endpoint route from your Swagger file or Postman collection.
        // Example assumes '/api/account/register' or '/api/invite'
        await axios.post(
          'https://azurewebsites.net', 
          values,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setStatus({ success: 'Invitation sent successfully!' });
        resetForm();
      } catch (error: any) {
        setStatus({ error: error.response?.data?.message || 'Registration failed.' });
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Invite User</h2>
      {formik.status?.success && <p style={{ color: 'green' }}>{formik.status.success}</p>}
      {formik.status?.error && <p style={{ color: 'red' }}>{formik.status.error}</p>}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            required
          />
        </div>
        <button type="submit" disabled={formik.isSubmitting} style={{ padding: '10px 20px' }}>
          {formik.isSubmitting ? 'Sending...' : 'Send Invite'}
        </button>
      </form>
    </div>
  );
};
