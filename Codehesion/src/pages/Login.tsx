import React from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import { useAuth } from '../context/authContext';
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
            const payload = new URLSearchParams();
            payload.append('grant_type', 'password');
            payload.append('username', values.username);
            payload.append('password', values.password);
            payload.append('client_id', import.meta.env.VITE_CLIENT_ID); 
            payload.append('client_secret', import.meta.env.VITE_CLIENT_SECRET);
            payload.append('scope', import.meta.env.VITE_SCOPE);

            const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/connect/token`,
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
                    <label>Username or email</label>
                    <input
                      name="username"
                      type="text"
                      onChange={formik.handleChange}
                      value={formik.values.username}
                      style={{ width:'100%', marginBottom: '10px', padding: '8px' }}
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
                <button type="submit" disabled={formik.isSubmitting} style={{ padding: '10px 20px'}}>
                    {formik.isSubmitting ? 'Logging you in' : 'Login'}
                </button>
            </form>
        </div>
    );
};