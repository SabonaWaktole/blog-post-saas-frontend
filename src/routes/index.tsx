import { Routes, Route } from 'react-router-dom'

// Layouts
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import EditorLayout from '../layouts/EditorLayout'
import ProtectedRoute from '../components/auth/ProtectedRoute'

// Public Pages
import LandingPage from '../pages/public/LandingPage'
import BlogHomePage from '../pages/public/BlogHomePage'
import ArticleDetailPage from '../pages/public/ArticleDetailPage'
import AuthorProfilePage from '../pages/public/AuthorProfilePage'
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Dashboard Pages
import DashboardPage from '../pages/dashboard/DashboardPage'
import ContentManagementPage from '../pages/dashboard/ContentManagementPage'
import EditorPage from '../pages/dashboard/EditorPage'
import MultiBlogPage from '../pages/dashboard/MultiBlogPage'
import TaxonomyPage from '../pages/dashboard/TaxonomyPage'
import AnalyticsPage from '../pages/dashboard/AnalyticsPage'

// Context
import { BlogProvider } from '../context/BlogContext'

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="blog" element={<BlogHomePage />} />
                <Route path="blog/:slug" element={<ArticleDetailPage />} />
                <Route path="author/:authorId" element={<AuthorProfilePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
                <Route element={
                    <BlogProvider>
                        <DashboardLayout />
                    </BlogProvider>
                }>
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="dashboard/posts" element={<ContentManagementPage />} />
                    <Route path="dashboard/blogs" element={<MultiBlogPage />} />
                    <Route path="dashboard/taxonomy" element={<TaxonomyPage />} />
                    <Route path="dashboard/analytics" element={<AnalyticsPage />} />
                </Route>

                {/* Editor Routes - Also need BlogContext */}
                <Route element={
                    <BlogProvider>
                        <EditorLayout />
                    </BlogProvider>
                }>
                    <Route path="dashboard/posts/new" element={<EditorPage />} />
                    <Route path="dashboard/posts/:postId/edit" element={<EditorPage />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes
