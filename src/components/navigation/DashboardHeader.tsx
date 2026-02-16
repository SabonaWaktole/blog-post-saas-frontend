import { useState, useRef, useEffect } from 'react'
import { Menu, ChevronDown } from 'lucide-react'
import { useBlog } from '../../context/BlogContext'
import { Link } from 'react-router-dom'

interface DashboardHeaderProps {
    onMenuClick: () => void
}

function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
    const { currentBlog, blogs, setCurrentBlog } = useBlog()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 right-0 left-0 z-30 lg:left-64 transition-all duration-300">
            <div className="h-full px-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuClick}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex items-center space-x-3">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                            Content Library
                        </h1>
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block" />

                        {/* Blog Selector Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary/50 transition-colors"
                            >
                                <div className={`w-2 h-2 rounded-full ${currentBlog?.color?.split(' ')[0] || 'bg-green-500'}`} />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                                    {currentBlog?.title || 'Select Blog'}
                                </span>
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                    <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700">
                                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Switch Blog</p>
                                    </div>
                                    {blogs.map(blog => (
                                        <button
                                            key={blog.id}
                                            onClick={() => {
                                                setCurrentBlog(blog)
                                                setIsDropdownOpen(false)
                                            }}
                                            className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                                        >
                                            <div className={`w-2 h-2 rounded-full ${blog.color?.split(' ')[0] || 'bg-gray-300'}`} />
                                            <div>
                                                <p className={`text-sm font-medium ${currentBlog?.id === blog.id ? 'text-primary' : 'text-gray-700 dark:text-gray-200'}`}>
                                                    {blog.title}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">{blog.subdomain}.example.com</p>
                                            </div>
                                            {currentBlog?.id === blog.id && (
                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                            )}
                                        </button>
                                    ))}
                                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                                        <button
                                            className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                            onClick={() => window.location.href = '/dashboard/blogs'} // Or use router navigation
                                        >
                                            <span className="text-lg leading-none">+</span>
                                            <span>Create New Blog</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
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
            </div>
        </header>
    )
}

export default DashboardHeader
