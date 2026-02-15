import { useState, useEffect } from 'react'
import { Plus, Search, MoreVertical, Globe, Settings, ExternalLink } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Blog, fetchBlogs, createBlog } from '../../data/blogs'

export default function MultiBlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')

    // New Blog State
    const [newBlogTitle, setNewBlogTitle] = useState('')
    const [newBlogSlug, setNewBlogSlug] = useState('')
    const [isCreating, setIsCreating] = useState(false)

    useEffect(() => {
        loadBlogs()
    }, [])

    const loadBlogs = async () => {
        setIsLoading(true)
        try {
            const data = await fetchBlogs()
            setBlogs(data)
        } catch (error) {
            console.error('Failed to load blogs', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreateBlog = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsCreating(true)
        try {
            await createBlog({
                title: newBlogTitle,
                slug: newBlogSlug
            })
            await loadBlogs()
            setIsCreateModalOpen(false)
            setNewBlogTitle('')
            setNewBlogSlug('')
        } catch (error) {
            console.error('Failed to create blog:', error)
        } finally {
            setIsCreating(false)
        }
    }

    const filteredBlogs = blogs.filter(blog =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.subdomain.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Blogs</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage your blog portfolio and settings
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Blog
                </button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-transparent placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm dark:text-white"
                        placeholder="Search blogs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {isLoading ? (
                <div className="text-center py-12">Loading blogs...</div>
            ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <Globe className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No blogs found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by creating your first blog.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${blog.color || 'bg-blue-100 text-blue-600'}`}>
                                            <Globe className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                                                {blog.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                {blog.subdomain}.example.com
                                            </p>
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <button className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                                            <span className="sr-only">Options</span>
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <div className="text-center">
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                            {blog.posts}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                            {blog.visitors}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Visitors</p>
                                    </div>
                                    <div className="text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${blog.status === 'LIVE' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                blog.status === 'MAINTENANCE' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}>
                                            {blog.status}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 flex space-x-3">
                                    <button className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                                        <Settings className="h-4 w-4 mr-2" />
                                        Manage
                                    </button>
                                    <a
                                        href={`http://${blog.subdomain}.localhost:3000`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-primary bg-primary-light/10 hover:bg-primary-light/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title="Create New Blog"
            >
                <form onSubmit={handleCreateBlog} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Blog Title
                        </label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:text-white"
                            value={newBlogTitle}
                            onChange={(e) => setNewBlogTitle(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Slug
                        </label>
                        <input
                            type="text"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:text-white"
                            value={newBlogSlug}
                            onChange={(e) => setNewBlogSlug(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreating}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                        >
                            {isCreating ? 'Creating...' : 'Create Blog'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
