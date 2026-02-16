import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const navItems = [
    { path: '/dashboard', icon: 'dashboard', label: 'Overview', filled: true },
    { path: '/dashboard/posts', icon: 'article', label: 'Posts' },
    { path: '/dashboard/taxonomy', icon: 'account_tree', label: 'Taxonomy' },
    { path: '/dashboard/blogs', icon: 'layers', label: 'My Blogs' },
    { path: '/dashboard/analytics', icon: 'analytics', label: 'Analytics' },
]

const workspaceItems = [
    { path: '/dashboard/settings', icon: 'settings', label: 'Settings' },
]

interface DashboardSidebarProps {
    onClose?: () => void
}

function DashboardSidebar({ onClose }: DashboardSidebarProps) {
    const location = useLocation()
    const { user } = useAuth()

    const isActive = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard'
        }
        return location.pathname.startsWith(path)
    }

    return (
        <aside className="w-64 flex flex-col border-r border-border-light dark:border-gray-800 bg-white dark:bg-background-dark h-full">
            <div className="p-6 flex flex-col h-full justify-between">
                <div className="space-y-8">
                    {/* Brand / App Info */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-charcoal dark:bg-primary flex items-center justify-center rounded">
                            <span className="text-white text-xs font-bold">WR</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-charcoal dark:text-white text-sm font-bold font-heading leading-tight uppercase tracking-widest">
                                WritersPad
                            </h1>
                            <p className="text-muted-gray text-[10px] font-medium uppercase tracking-tighter">Pro CMS v2.4</p>
                        </div>
                        {onClose && (
                            <button onClick={onClose} className="ml-auto lg:hidden">
                                <span className="material-symbols-outlined text-gray-500">close</span>
                            </button>
                        )}
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${isActive(item.path)
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-muted-gray hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-charcoal dark:hover:text-white'
                                    }`}
                            >
                                <span
                                    className="material-symbols-outlined text-[20px]"
                                    style={isActive(item.path) && item.filled ? { fontVariationSettings: "'FILL' 1" } : {}}
                                >
                                    {item.icon}
                                </span>
                                <p className={`text-sm ${isActive(item.path) ? 'font-semibold' : 'font-medium'}`}>
                                    {item.label}
                                </p>
                            </Link>
                        ))}

                        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
                            <p className="px-3 text-[10px] font-bold text-muted-gray uppercase tracking-widest mb-2">
                                Workspace
                            </p>
                            {workspaceItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${isActive(item.path)
                                        ? 'bg-primary/10 text-primary'
                                        : 'text-muted-gray hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-charcoal dark:hover:text-white'
                                        }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                                    <p className="text-sm font-medium">{item.label}</p>
                                </Link>
                            ))}
                        </div>
                    </nav>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-border-light bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                    >
                        {user?.email?.[0].toUpperCase() || 'U'}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <p className="text-charcoal dark:text-white text-xs font-bold truncate">
                            {user?.email || 'User'}
                        </p>
                        <p className="text-muted-gray text-[10px] font-medium truncate">
                            {user?.role || 'Member'}
                        </p>
                    </div>
                </div>
            </div>
        </aside>
    )
}

export default DashboardSidebar
