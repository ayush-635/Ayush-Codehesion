import { createBrowserRouter } from 'react-router'

import Layout from './components/Layout/Layout'

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Layout>
      </Layout>
    ),
  },
  {
    path: '*',
    element: (
      <Layout>
      </Layout>
    ),
  },
])

export default router
