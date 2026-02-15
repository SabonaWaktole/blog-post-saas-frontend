import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MoreHorizontal, ArrowLeft } from 'lucide-react'
import { Article, fetchArticleById, createPost, updatePost } from '../../data/articles'
import { fetchCategories, Category } from '../../data/taxonomy'
import { fetchBlogs } from '../../data/blogs'

export default function EditorPage() {
    const { postId } = useParams()
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [blogId, setBlogId] = useState<string>('')

    const [post, setPost] = useState<Partial<Article>>({
        title: '',
        content: '',
        excerpt: '',
        status: 'DRAFT',
        featured: false,
        tags: []
    })
    const [categories, setCategories] = useState<Category[]>([])

    useEffect(() => {
        const init = async () => {
            setIsLoading(true)
            try {
                // Get blog context first
                const blogs = await fetchBlogs()
                if (blogs.length === 0) {
                    // No blogs? Redirect to create blog
                    navigate('/dashboard/blogs')
                    return
                }
                const currentBlogId = blogs[0].id
                setBlogId(currentBlogId)

                // Fetch categories
                const cats = await fetchCategories(currentBlogId)
                setCategories(cats)

                // If editing, fetch post
                if (postId) {
                    const article = await fetchArticleById(currentBlogId, postId)
                    if (article) {
                        setPost(article)
                    } else {
                        // Error loading post
                        navigate('/dashboard/posts')
                    }
                }
            } catch (error) {
                console.error('Failed to init editor:', error)
            } finally {
                setIsLoading(false)
            }
        }
        init()
    }, [postId, navigate])

    const handleSave = async (status: 'DRAFT' | 'PUBLISHED' = 'DRAFT') => {
        if (!blogId) return
        setIsSaving(true)
        try {
            const dataToSave = { ...post, status }
            if (postId) {
                await updatePost(blogId, postId, dataToSave)
            } else {
                await createPost(blogId, dataToSave)
            }
            navigate('/dashboard/posts')
        } catch (error) {
            console.error('Failed to save post:', error)
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center">Loading editor...</div>
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                    <button onClick={() => navigate('/dashboard/posts')} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {postId ? 'Edit Post' : 'New Post'}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isSaving ? 'Saving...' : 'Changes saved'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={() => handleSave('DRAFT')}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={() => handleSave('PUBLISHED')}
                        disabled={isSaving}
                        className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                        {isSaving ? 'Publishing...' : 'Publish'}
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <input
                            type="text"
                            placeholder="Post Title"
                            className="w-full text-3xl font-bold border-none placeholder-gray-400 focus:ring-0 bg-transparent dark:text-white px-0"
                            value={post.title}
                            onChange={(e) => setPost({ ...post, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Write your story..."
                            rows={20}
                            className="w-full mt-4 text-lg text-gray-800 dark:text-gray-200 border-none resize-none focus:ring-0 bg-transparent px-0"
                            value={post.content}
                            onChange={(e) => setPost({ ...post, content: e.target.value })}
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Settings Card */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">Post Settings</h3>

                        {/* Excerpt */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Excerpt
                            </label>
                            <textarea
                                rows={3}
                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:text-white"
                                value={post.excerpt}
                                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
                            />
                        </div>

                        {/* Category */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:bg-gray-700 dark:text-white"
                                value={post.category || ''}
                                onChange={(e) => setPost({ ...post, category: e.target.value })}
                            >
                                <option value="">Select a category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
