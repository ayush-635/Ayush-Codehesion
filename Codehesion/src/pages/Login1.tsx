import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      try {
        // Standard OAuth2/IdentityServer payload requirements
        const payload = new URLSearchParams();
        payload.append('grant_type', 'password');
        payload.append('username', values.username);
        payload.append('password', values.password);
        // Note: If your credentials came with a client_id/client_secret, append them below:
        payload.append('client_id', 'client'); 

        const response = await axios.post(
          'https://edeaf-api-staging.azurewebsites.net/connect/token',
          payload,
          { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        );

        if (response.data.access_token) {
          login(response.data.access_token);
          navigate('/home');
        }
      } catch (error: any) {
        setStatus(error.response?.data?.error_description || 'Login failed.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc' }}>
      <h2>Login</h2>
      {formik.status && <p style={{ color: 'red' }}>{formik.status}</p>}
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label>Username / Email</label>
          <input
            name="username"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.username}
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            style={{ width: '100%', marginBottom: '10px', padding: '8px' }}
            required
          />
        </div>
        <button type="submit" disabled={formik.isSubmitting} style={{ padding: '10px 20px' }}>
          {formik.isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};
