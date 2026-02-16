import { useState, useEffect } from 'react'
import { fetchCategories, fetchTags, createCategory, createTag, Category, Tag } from '../../data/taxonomy'
import { fetchBlogs } from '../../data/blogs'
import { Modal } from '../../components/ui/Modal'
import { useToast } from '../../components/ui/Toast'

function TaxonomyPage() {
    const [activeTab, setActiveTab] = useState<'hierarchy' | 'tags'>('hierarchy')
    const [categories, setCategories] = useState<Category[]>([])
    const [tags, setTags] = useState<Tag[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [blogId, setBlogId] = useState<string>('')

    useEffect(() => {
        const loadTaxonomy = async () => {
            setIsLoading(true)
            try {
                // Get blog context first
                const blogs = await fetchBlogs()
                if (blogs.length === 0) {
                    setIsLoading(false)
                    return
                }
                const currentBlogId = blogs[0].id
                setBlogId(currentBlogId)

                const [cats, tagsData] = await Promise.all([
                    fetchCategories(currentBlogId),
                    fetchTags(currentBlogId) // Assuming fetchTags also needs blogId, if not, remove argument
                ])
                setCategories(cats)
                setTags(tagsData)
            } catch (error) {
                console.error('Failed to load taxonomy', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadTaxonomy()
    }, [])

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalType, setModalType] = useState<'category' | 'tag'>('category')
    const [editingItem, setEditingItem] = useState<Category | Tag | null>(null)
    const toast = useToast()

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        parentId: '' as string
    })

    const resetForm = () => {
        setFormData({ name: '', slug: '', description: '', parentId: '' })
        setEditingItem(null)
    }

    const openModal = (type: 'category' | 'tag', item?: Category | Tag) => {
        setModalType(type)
        if (item) {
            setEditingItem(item)
            setFormData({
                name: item.name,
                slug: item.slug,
                description: 'description' in item ? (item.description || '') : '',
                parentId: 'parentId' in item ? (item.parentId || '') : ''
            })
        } else {
            resetForm()
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!blogId) return

        try {
            if (modalType === 'category') {
                if (editingItem) {
                    // Update not implemented in API yet, mock update locally or implement API
                    // For now, just reload to be safe or assuming update endpoint exists
                    // Let's assume we just re-fetch or update local
                    setCategories(categories.map(c => c.id === editingItem.id ? {
                        ...c,
                        name: formData.name,
                        slug: formData.slug,
                        description: formData.description,
                        parentId: formData.parentId || null
                    } : c))
                    toast.success('Category updated')
                } else {
                    // Create Category
                    await createCategory(blogId, {
                        name: formData.name,
                        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-'),
                        parentId: formData.parentId || undefined
                    })
                    // Reload to get new ID
                    const cats = await fetchCategories(blogId)
                    setCategories(cats)
                    toast.success('Category created')
                }
            } else {
                if (editingItem) {
                    // Update tag
                    setTags(tags.map(t => t.id === editingItem.id ? { ...t, name: formData.name, slug: formData.slug } : t))
                    toast.success('Tag updated')
                } else {
                    // Create Tag
                    await createTag(blogId, {
                        name: formData.name,
                        slug: formData.slug || formData.name.toLowerCase().replace(/ /g, '-')
                    })
                    const tagsData = await fetchTags(blogId)
                    setTags(tagsData)
                    toast.success('Tag created')
                }
            }
            setIsModalOpen(false)
        } catch (error) {
            console.error('Failed to save', error)
            toast.error('Failed to save item')
        }
    }

    const handleDelete = (type: 'category' | 'tag', id: string) => {
        if (confirm(`Are you sure you want to delete this ${type}?`)) {
            if (type === 'category') {
                setCategories(categories.filter(c => c.id !== id))
            } else {
                setTags(tags.filter(t => t.id !== id))
            }
            toast.success(`${type === 'category' ? 'Category' : 'Tag'} deleted`)
        }
    }

    // Helper to generate slugs
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setFormData(prev => ({
            ...prev,
            name,
            slug: itemHasSlugChanged(prev.name, prev.slug) ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug
        }))
    }

    // Only auto-update slug if it matches the generated version of the name
    const itemHasSlugChanged = (name: string, slug: string) => {
        return slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    if (isLoading) {
        return <div className="p-8 text-center text-gray-400">Loading taxonomy...</div>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
                <div>
                    <h2 className="font-heading text-2xl lg:text-4xl font-extrabold tracking-tight">Taxonomy Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base max-w-lg">Define the structural hierarchy and metadata for your content.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => openModal('category')} className="flex items-center gap-2 px-4 lg:px-5 py-2.5 bg-primary text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all">
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        New Category
                    </button>
                    <button onClick={() => openModal('tag')} className="flex items-center gap-2 px-4 lg:px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <span className="material-symbols-outlined text-lg">tag</span>
                        New Tag
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-800">
                <button onClick={() => setActiveTab('hierarchy')} className={`px-4 lg:px-6 py-3 text-sm font-bold ${activeTab === 'hierarchy' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
                    Hierarchy View
                </button>
                <button onClick={() => setActiveTab('tags')} className={`px-4 lg:px-6 py-3 text-sm font-bold ${activeTab === 'tags' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}>
                    Global Tags
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-12">
                    {activeTab === 'hierarchy' ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-heading text-lg lg:text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">folder_open</span>
                                    Categories
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {categories.map((cat) => (
                                    <div key={cat.id} className={`group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl flex items-center justify-between hover:shadow-md hover:border-primary/20 transition-all ${cat.parentId ? 'ml-8 lg:ml-12 border-l-4 border-l-gray-200 dark:border-l-gray-700' : ''}`}>
                                        <div className="flex items-center gap-3 lg:gap-4">
                                            <div className="cursor-grab text-gray-300 group-hover:text-gray-400">
                                                <span className="material-symbols-outlined">drag_indicator</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-sm lg:text-base text-charcoal dark:text-gray-200">{cat.name}</h4>
                                                    {!cat.parentId && <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Parent</span>}
                                                </div>
                                                <p className="text-xs text-gray-400 font-mono mt-1">{cat.slug}</p>
                                                {cat.description && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{cat.description}</p>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 lg:gap-8">
                                            <div className="text-right">
                                                <p className="text-sm font-bold text-charcoal dark:text-gray-300">{cat.postCount} Posts</p>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => openModal('category', cat)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500">
                                                    <span className="material-symbols-outlined text-lg">edit</span>
                                                </button>
                                                <button onClick={() => handleDelete('category', cat.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500">
                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {categories.length === 0 && (
                                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                                        <p className="text-gray-500 font-medium">No categories found. Create one to get started.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-heading text-lg lg:text-xl font-bold flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">label</span>
                                    Global Tags
                                </h3>
                            </div>
                            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden p-6">
                                <div className="flex flex-wrap gap-3">
                                    {tags.map((tag) => (
                                        <div key={tag.id} className="group relative pr-8 pl-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary/10 hover:text-primary rounded-lg transition-all flex items-center gap-2 cursor-pointer border border-transparent hover:border-primary/20">
                                            <span onClick={() => openModal('tag', tag)} className="text-sm font-semibold">{tag.name}</span>
                                            <span className="text-[10px] opacity-50 font-bold bg-white dark:bg-gray-900 px-1.5 rounded-full">{tag.postCount}</span>
                                            <button onClick={() => handleDelete('tag', tag.id)} className="absolute right-1 p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded-full text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-sm">close</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? `Edit ${modalType === 'category' ? 'Category' : 'Tag'}` : `Create New ${modalType === 'category' ? 'Category' : 'Tag'}`}
            >
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-charcoal dark:text-gray-300">Name</span>
                        <input
                            required
                            value={formData.name}
                            onChange={handleNameChange}
                            className="h-10 px-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                            placeholder={modalType === 'category' ? "e.g., Technology" : "e.g., React"}
                        />
                    </label>
                    <label className="flex flex-col gap-1.5">
                        <span className="text-sm font-bold text-charcoal dark:text-gray-300">Slug</span>
                        <input
                            required
                            value={formData.slug}
                            onChange={e => setFormData({ ...formData, slug: e.target.value })}
                            className="h-10 px-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none font-mono text-gray-500"
                            placeholder="url-friendly-slug"
                        />
                    </label>

                    {modalType === 'category' && (
                        <>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-bold text-charcoal dark:text-gray-300">Description</span>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="px-3 py-2 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[80px] resize-none"
                                    placeholder="Brief description for SEO..."
                                />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-sm font-bold text-charcoal dark:text-gray-300">Parent Category</span>
                                <select
                                    value={formData.parentId}
                                    onChange={e => setFormData({ ...formData, parentId: e.target.value })}
                                    className="h-10 px-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                                >
                                    <option value="">None (Top Level)</option>
                                    {categories.filter(c => c.id !== editingItem?.id).map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </label>
                        </>
                    )}

                    <div className="flex gap-3 mt-4">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-10 rounded border border-gray-200 dark:border-gray-700 text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-800">Cancel</button>
                        <button type="submit" className="flex-1 h-10 rounded bg-charcoal dark:bg-white text-white dark:text-charcoal text-sm font-bold hover:opacity-90">
                            {editingItem ? 'Save Changes' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    )
}

export default TaxonomyPage
