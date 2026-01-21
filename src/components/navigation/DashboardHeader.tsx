import { Link } from 'react-router-dom'

interface DashboardHeaderProps {
    title: string
    onMenuClick: () => void
}

function DashboardHeader({ title, onMenuClick }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border-light dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 lg:px-8 py-4">
            <div className="flex items-center gap-4 lg:gap-6">
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                    <span className="material-symbols-outlined dark:text-white">menu</span>
                </button>

                <div className="flex flex-col">
                    <h2 className="text-charcoal dark:text-white text-lg lg:text-xl font-bold font-heading leading-tight">
                        {title}
                    </h2>
                </div>

                {/* Multi-tenant Switcher */}
                <div className="relative group hidden sm:block">
                    <button className="flex items-center gap-2 px-3 py-1.5 bg-background-light dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded hover:border-primary transition-all">
                        <div className="w-2 h-2 rounded-full bg-primary"></div>
                        <span className="text-sm font-bold text-charcoal dark:text-gray-200">The Morning Journal</span>
                        <span className="material-symbols-outlined text-muted-gray text-sm">expand_more</span>
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
                <label className="hidden md:flex flex-col min-w-48 !h-9">
                    <div className="flex w-full flex-1 items-stretch rounded h-full bg-background-light dark:bg-gray-800 border border-border-light dark:border-gray-700">
                        <div className="text-muted-gray flex items-center justify-center pl-3">
                            <span className="material-symbols-outlined text-[18px]">search</span>
                        </div>
                        <input
                            className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium placeholder:text-muted-gray dark:text-white"
                            placeholder="Search entries..."
                        />
                    </div>
                </label>

                <button className="flex items-center justify-center rounded size-9 bg-background-light dark:bg-gray-800 text-charcoal dark:text-gray-200 border border-border-light dark:border-gray-700">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                </button>

                <Link
                    to="/dashboard/posts/new"
                    className="flex items-center gap-2 px-3 lg:px-4 h-9 bg-primary text-white rounded text-sm font-bold tracking-tight hover:bg-primary/90 transition-all"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span className="hidden sm:inline">New Post</span>
                </Link>
            </div>
        </header>
    )
}

export default DashboardHeader
