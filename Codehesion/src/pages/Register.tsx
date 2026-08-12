import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { useAuth } from '../context/authContext';

export const Register = () => {
    const { token } = useAuth();

    const formik = useFormik({
        initialValues: {
            name: '',
            surname: '',
            email: '',
            role: 'Administrator', // Expected role type from Postman
        },
        onSubmit: async (values, { setSubmitting, setStatus, resetForm }) => {
            try {
                // Postman route: {{host}}/v1/admin/Users
                await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/v1/admin/Users`,
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setStatus({ success: 'Invite sent successfully!' });
                resetForm();
            } catch (error: any) {
                setStatus({ error: error.response?.data?.message || 'Failed to send invite.' });
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div style={{ padding: '20px', maxWidth: '400px' }}>
            <h2>Invite User</h2>
            {formik.status?.success && <p style={{ color: 'green' }}>{formik.status.success}</p>}
            {formik.status?.error && <p style={{ color: 'red' }}>{formik.status.error}</p>}
            
            <form onSubmit={formik.handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block' }}>First Name</label>
                    <input name="name" type="text" onChange={formik.handleChange} value={formik.values.name} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block' }}>Surname</label>
                    <input name="surname" type="text" onChange={formik.handleChange} value={formik.values.surname} required />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block' }}>Email Address</label>
                    <input name="email" type="email" onChange={formik.handleChange} value={formik.values.email} required />
                </div>
                <button type="submit" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Sending...' : 'Send Invite'}
                </button>
            </form>
        </div>
    );
};
