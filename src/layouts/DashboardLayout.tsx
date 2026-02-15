import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import DashboardSidebar from '../components/navigation/DashboardSidebar'
import DashboardHeader from '../components/navigation/DashboardHeader'

function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-100 antialiased">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <DashboardSidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 z-50 w-64">
                        <DashboardSidebar onClose={() => setSidebarOpen(false)} />
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto">
                <DashboardHeader
                    onMenuClick={() => setSidebarOpen(true)}
                />
                <div className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
