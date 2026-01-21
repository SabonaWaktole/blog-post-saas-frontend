import { Routes, Route } from 'react-router-dom'

// Layouts
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import EditorLayout from '../layouts/EditorLayout'

// Public Pages
import LandingPage from '../pages/public/LandingPage'
import BlogHomePage from '../pages/public/BlogHomePage'
import ArticleDetailPage from '../pages/public/ArticleDetailPage'
import AuthorProfilePage from '../pages/public/AuthorProfilePage'

// Dashboard Pages
import DashboardPage from '../pages/dashboard/DashboardPage'
import ContentManagementPage from '../pages/dashboard/ContentManagementPage'
import EditorPage from '../pages/dashboard/EditorPage'
import MultiBlogPage from '../pages/dashboard/MultiBlogPage'
import TaxonomyPage from '../pages/dashboard/TaxonomyPage'
import AnalyticsPage from '../pages/dashboard/AnalyticsPage'

function AppRoutes() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="blog" element={<BlogHomePage />} />
                <Route path="blog/:slug" element={<ArticleDetailPage />} />
                <Route path="author/:authorId" element={<AuthorProfilePage />} />
            </Route>

            {/* Dashboard Routes */}
            <Route path="dashboard" element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="posts" element={<ContentManagementPage />} />
                <Route path="blogs" element={<MultiBlogPage />} />
                <Route path="taxonomy" element={<TaxonomyPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
            </Route>

            {/* Editor Routes (separate layout) */}
            <Route path="dashboard/posts" element={<EditorLayout />}>
                <Route path="new" element={<EditorPage />} />
                <Route path=":postId/edit" element={<EditorPage />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes
