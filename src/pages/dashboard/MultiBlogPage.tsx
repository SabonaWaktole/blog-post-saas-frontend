import { useState, useEffect } from 'react'
import { fetchBlogs, Blog } from '../../data/blogs'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'

function MultiBlogPage() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
    const toast = useToast()

    useEffect(() => {
        const loadBlogs = async () => {
            setIsLoading(true)
            try {
                const data = await fetchBlogs()
                setBlogs(data)
            } catch (error) {
                console.error('Failed to load blogs', error)
                toast.error('Failed to load blogs')
            } finally {
                setIsLoading(false)
            }
        }
        loadBlogs()
    }, [])

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        subdomain: '',
        status: 'Draft' as const
    })

    const resetForm = () => {
        setFormData({ name: '', subdomain: '', status: 'Draft' })
        setEditingBlog(null)
    }

    const openCreateModal = () => {
        resetForm()
        setIsModalOpen(true)
    }

    const openEditModal = (blog: Blog) => {
        setEditingBlog(blog)
        setFormData({
            name: blog.name,
            subdomain: blog.subdomain,
            status: blog.status as any
        })
        setIsModalOpen(true)
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        if (editingBlog) {
            // Edit
            setBlogs(blogs.map(b => b.id === editingBlog.id ? { ...b, ...formData, customDomain: `${formData.subdomain}.cms.com` } : b))
            toast.success('Blog updated successfully')
        } else {
            // Create
            const newBlog: Blog = {
                id: Math.max(...blogs.map(b => b.id), 0) + 1,
                ...formData,
                customDomain: `${formData.subdomain}.cms.com`,
                icon: 'public',
                color: 'bg-green-100 text-green-600',
                posts: 0,
                visitors: '0',
                role: 'Owner'
            }
            setBlogs([...blogs, newBlog])
            toast.success('New blog created successfully')
        }
        setIsModalOpen(false)
    }

    const deleteBlog = (id: number) => {
        if (confirm('Are you sure you want to delete this blog?')) {
            setBlogs(blogs.filter(b => b.id !== id))
            toast.success('Blog deleted')
        }
    }

    return (
        <div className="space-y-6 lg:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div className="max-w-xl">
                    <h2 className="text-2xl lg:text-4xl font-extrabold font-heading tracking-tight mb-2">My Blogs</h2>
                    <p className="text-gray-500 text-sm lg:text-base">Manage your multi-tenant editorial properties and monitor their performance.</p>
                </div>
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="text-center py-20 text-gray-500">Loading blogs...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {blogs.map((blog) => (
                        <div key={blog.id} className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 lg:p-6 flex flex-col transition-all hover:shadow-lg hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-4 lg:mb-6">
                                <div className={`h-12 lg:h-14 w-12 lg:w-14 rounded-xl ${blog.color} flex items-center justify-center`}>
                                    <span className="material-symbols-outlined text-2xl lg:text-3xl">{blog.icon}</span>
                                </div>
                                <div className="flex gap-1">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${blog.status === 'Live' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {blog.status}
                                    </span>
                                    <div className="relative group/menu">
                                        <button className="h-8 w-8 flex items-center justify-center text-gray-400 hover:text-gray-600 text-right">
                                            <span className="material-symbols-outlined">more_vert</span>
                                        </button>
                                        <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden hidden group-hover/menu:block z-10">
                                            <button onClick={() => openEditModal(blog)} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200">Edit</button>
                                            <button onClick={() => deleteBlog(blog.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20">Delete</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4 lg:mb-6">
                                <h3 className="text-lg lg:text-xl font-bold font-heading mb-1">{blog.name}</h3>
                                <p className="text-primary text-sm font-medium flex items-center gap-1">
                                    {blog.customDomain || `${blog.subdomain}.cms.com`}
                                    <span className="material-symbols-outlined text-xs">open_in_new</span>
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-b border-gray-100 dark:border-gray-800 mb-4 lg:mb-6">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Posts</p>
                                    <p className="text-lg font-bold">{blog.posts}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">Visitors</p>
                                    <p className="text-lg font-bold">{blog.visitors}</p>
                                </div>
                            </div>
                            <button className={`w-full h-10 lg:h-11 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${blog.status === 'Live' ? 'bg-primary text-white hover:bg-primary/90' : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200'}`}>
                                <span>{blog.status === 'Live' ? 'Manage Blog' : 'Resume Setup'}</span>
                                <span className="material-symbols-outlined text-sm">{blog.status === 'Live' ? 'arrow_forward' : 'edit_note'}</span>
                            </button>
                        </div>
                    ))}

                    {/* Create New Card */}
                    <div
                        onClick={openCreateModal}
                        className="relative bg-transparent border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 lg:p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all min-h-[280px]"
                    >
                        <div className="h-14 lg:h-16 w-14 lg:w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 mb-4">
                            <span className="material-symbols-outlined text-3xl">add</span>
                        </div>
                        <h3 className="text-lg font-bold font-heading mb-1">Create New Blog</h3>
                        <p className="text-gray-500 text-sm max-w-[200px]">Launch another professional tenant in seconds.</p>
                    </div>
                </div>
            )}

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingBlog ? 'Edit Blog Settings' : 'Create New Blog'}
            >
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-charcoal dark:text-gray-300">Blog Name</span>
                        <input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="h-10 px-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder="My Awesome Blog"
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-charcoal dark:text-gray-300">Subdomain</span>
                        <div className="flex items-center h-10 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                            <input
                                required
                                value={formData.subdomain}
                                onChange={e => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                className="flex-1 h-full px-3 bg-transparent text-sm outline-none"
                                placeholder="my-blog"
                            />
                            <span className="px-3 text-sm text-gray-400 bg-gray-100 dark:bg-gray-700 h-full flex items-center border-l dark:border-gray-600">.cms.com</span>
                        </div>
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-charcoal dark:text-gray-300">Status</span>
                        <select
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                            className="h-10 px-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        >
                            <option value="Draft">Draft</option>
                            <option value="Live">Live</option>
                            <option value="Maintenance">Maintenance</option>
                        </select>
                    </label>
                    <div className="flex gap-3 mt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-10 rounded border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                        <button type="submit" className="flex-1 h-10 rounded bg-charcoal dark:bg-white text-white dark:text-charcoal text-sm font-bold hover:opacity-90">
                            {editingBlog ? 'Save Changes' : 'Create Blog'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default MultiBlogPage
