import { useState, useEffect, useMemo } from 'react'

import { Link } from 'react-router-dom'
import { Article, ArticleStatus, fetchArticlesByBlogId } from '../../data/articles'
import { useToast } from '../../components/ui/Toast'
import { useBlog } from '../../context/BlogContext'

// Map status to colors
const statusColors: Record<ArticleStatus, string> = {
    PUBLISHED: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
    DRAFT: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700',
    SCHEDULING: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
    ARCHIVED: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700',
}

const filters = ['All Posts', 'PUBLISHED', 'DRAFT', 'SCHEDULING', 'ARCHIVED']

function ContentManagementPage() {
    const [localArticles, setLocalArticles] = useState<Article[]>([])
    const [activeFilter, setActiveFilter] = useState('All Posts')
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedPosts, setSelectedPosts] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isInitialLoad, setIsInitialLoad] = useState(true)
    const toast = useToast()
    const { currentBlog, isLoading: isBlogLoading } = useBlog()

    const POSTS_PER_PAGE = 7

    useEffect(() => {
        const loadArticles = async () => {
            // Wait for blog context to load
            if (isBlogLoading) return

            if (!currentBlog) {
                setLocalArticles([])
                setIsLoading(false)
                setIsInitialLoad(false)
                return
            }

            setIsLoading(true)
            try {
                const articles = await fetchArticlesByBlogId(currentBlog.id, searchQuery)
                setLocalArticles(articles)
            } catch (error) {
                console.error('Failed to load articles', error)
                toast.error('Failed to load articles')
            } finally {
                setIsLoading(false)
                setIsInitialLoad(false)
            }
        }

        // Debounce search
        const timeoutId = setTimeout(() => {
            loadArticles()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [searchQuery, currentBlog, isBlogLoading])

    // Filter by status locally, similar to before
    const filteredPosts = useMemo(() => {
        // Sort by ID descending if ID is numeric-like or just reverse?
        // String IDs might not sort well numerically. Sorting by date is better.
        // Assuming date string is ISO or comparable.
        let result = [...localArticles].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        if (activeFilter !== 'All Posts') {
            result = result.filter(post => post.status === activeFilter)
        }

        return result
    }, [activeFilter, localArticles])

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
    const displayedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedPosts(displayedPosts.map(p => p.id))
        } else {
            setSelectedPosts([])
        }
    }

    const handleSelectPost = (id: string) => {
        if (selectedPosts.includes(id)) {
            setSelectedPosts(selectedPosts.filter(p => p !== id))
        } else {
            setSelectedPosts([...selectedPosts, id])
        }
    }

    const handleDelete = () => {
        setLocalArticles(prev => prev.filter(p => !selectedPosts.includes(p.id)))
        toast.success(`Deleted ${selectedPosts.length} posts`)
        setSelectedPosts([])
    }

    const handleSingleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setLocalArticles(prev => prev.filter(p => p.id !== id))
            toast.success('Post deleted')
        }
    }

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    }

    // Show loading state while checking for blog
    if (isBlogLoading || (isInitialLoad && isLoading)) {
        return <div className="p-8 text-center text-gray-400">Loading content library...</div>
    }

    // Show empty state if no blog is found
    if (!currentBlog) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                    <span className="material-symbols-outlined text-4xl text-gray-400">article</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Blog Selected</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mb-6">
                    You need to have a blog to manage posts. Use the dropdown in the sidebar or header to create one.
                </p>
                <Link
                    to="/dashboard/blogs"
                    className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Create Your First Blog
                </Link>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl lg:text-4xl font-heading font-black tracking-tight text-charcoal dark:text-white">Content Library</h1>
                    <p className="text-muted-gray text-sm">Manage entries for <span className="font-bold text-primary">{currentBlog.title}</span></p>
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-lg border border-border-light dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold text-charcoal dark:text-white hover:bg-background-light dark:hover:bg-gray-700 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">file_upload</span>
                        <span className="hidden sm:inline">Import</span>
                    </button>
                    <Link to="/dashboard/posts/new" className="flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                        <span className="material-symbols-outlined text-[18px]">edit_square</span>
                        Create New Post
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                <div className="flex flex-col lg:flex-row gap-4 flex-1">
                    <div className="w-full lg:max-w-md relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-muted-gray group-focus-within:text-primary transition-colors">search</span>
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-xl focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all dark:text-white"
                            placeholder="Search posts..."
                            type="text"
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        {filters.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${activeFilter === filter ? 'bg-primary text-white' : 'bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 text-muted-gray hover:border-primary/50 dark:hover:border-gray-600'}`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedPosts.length > 0 && (
                    <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-sm font-bold animate-in fade-in slide-in-from-right-4">
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Delete ({selectedPosts.length})
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-gray-800 border border-border-light dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-background-light dark:bg-gray-900 border-b border-border-light dark:border-gray-700">
                                <th className="px-4 lg:px-6 py-4 w-12 text-center">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={displayedPosts.length > 0 && selectedPosts.length === displayedPosts.length}
                                        className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary focus:ring-primary cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-gray">Title</th>
                                <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-gray">Status</th>
                                <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-gray hidden md:table-cell">Author</th>
                                <th className="px-4 lg:px-6 py-4 text-xs font-bold uppercase tracking-widest text-muted-gray hidden lg:table-cell">Date</th>
                                <th className="px-4 lg:px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-muted-gray">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-light dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-gray">
                                        Loading content...
                                    </td>
                                </tr>
                            ) : displayedPosts.length > 0 ? (
                                displayedPosts.map((post) => (
                                    <tr key={post.id} className="hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors group">
                                        <td className="px-4 lg:px-6 py-5 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedPosts.includes(post.id)}
                                                onChange={() => handleSelectPost(post.id)}
                                                className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-primary focus:ring-primary cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 lg:px-6 py-5">
                                            <div className="flex flex-col">
                                                <Link to={`/blog/${post.slug}`} className="text-sm font-bold text-charcoal dark:text-white hover:text-primary transition-colors cursor-pointer line-clamp-1">
                                                    {post.title}
                                                </Link>
                                                <span className="text-xs text-muted-gray hidden sm:inline truncate max-w-[200px]">/{post.slug}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-5">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[post.status] || statusColors.DRAFT}`}>
                                                {post.status}
                                            </span>
                                        </td>
                                        <td className="px-4 lg:px-6 py-5 hidden md:table-cell">
                                            <div className="flex items-center gap-2">
                                                <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden">
                                                    {post.author?.avatar ? (
                                                        <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        post.author?.name ? getInitials(post.author.name) : '?'
                                                    )}
                                                </div>
                                                <span className="text-sm font-medium text-charcoal dark:text-gray-200">
                                                    {post.author?.name || 'Unknown Author'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 lg:px-6 py-5 text-sm text-muted-gray hidden lg:table-cell whitespace-nowrap">{post.date}</td>
                                        <td className="px-4 lg:px-6 py-5 text-right w-[100px]">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link to={`/dashboard/posts/${post.id}/edit`} className="p-2 hover:bg-background-light dark:hover:bg-gray-700 rounded-lg text-muted-gray hover:text-primary transition-colors" title="Edit">
                                                    <span className="material-symbols-outlined text-[20px]">edit</span>
                                                </Link>
                                                <button onClick={() => handleSingleDelete(post.id)} className="p-2 hover:bg-background-light dark:hover:bg-gray-700 rounded-lg text-muted-gray hover:text-red-500 transition-colors" title="Delete">
                                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-muted-gray">
                                        No posts found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-4 lg:px-6 py-4 flex items-center justify-between border-t border-border-light dark:border-gray-700 bg-background-light/50 dark:bg-gray-900/50">
                        <span className="text-xs font-medium text-muted-gray">
                            Showing {(currentPage - 1) * POSTS_PER_PAGE + 1} to {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="p-1.5 rounded-lg border border-border-light dark:border-gray-700 bg-white dark:bg-gray-800 text-muted-gray disabled:opacity-50 hover:border-primary hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                            </button>
                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="p-1.5 rounded-lg border border-border-light dark:border-gray-700 bg-white dark:bg-gray-800 text-muted-gray disabled:opacity-50 hover:border-primary hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ContentManagementPage
