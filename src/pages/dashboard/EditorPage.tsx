import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MoreHorizontal, ArrowLeft } from 'lucide-react'
import { Article, fetchArticleById, createPost, updatePost } from '../../data/articles'
import { fetchCategories, Category } from '../../data/taxonomy'
import { useBlog } from '../../context/BlogContext'

export default function EditorPage() {
    const { postId } = useParams()
    const navigate = useNavigate()
    const { currentBlog, isLoading: isBlogLoading } = useBlog()

    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    const [post, setPost] = useState<Partial<Article>>({
        title: '',
        slug: '', // Add slug to state
        content: '',
        excerpt: '',
        status: 'DRAFT',
        featured: false,
        tags: []
    })
    const [categories, setCategories] = useState<Category[]>([])

    // Slugify helper
    const slugify = (text: string) => {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')     // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-')   // Replace multiple - with single -
    }

    // Auto-update slug when title changes
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setPost(prev => {
            const currentSlug = prev.slug || ''
            const expectedSlug = slugify(prev.title || '')

            // If the slug was auto-generated from the old title (or empty), update it
            if (currentSlug === expectedSlug || currentSlug === '') {
                return { ...prev, title: newTitle, slug: slugify(newTitle) }
            }
            return { ...prev, title: newTitle }
        })
    }

    useEffect(() => {
        const init = async () => {
            if (isBlogLoading) return

            if (!currentBlog) {
                // No blog selected? Redirect to create blog or dashboard
                navigate('/dashboard/blogs')
                return
            }

            setIsLoading(true)
            try {
                // Fetch categories
                const cats = await fetchCategories(currentBlog.id)
                setCategories(cats)

                // If editing, fetch post
                if (postId) {
                    const article = await fetchArticleById(currentBlog.id, postId)
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
    }, [postId, navigate, currentBlog, isBlogLoading])

    const handleSave = async (status: 'DRAFT' | 'PUBLISHED' = 'DRAFT') => {
        if (!currentBlog) return

        // Validate
        if (!post.title) {
            alert('Title is required')
            return
        }

        const finalSlug = post.slug || slugify(post.title)

        setIsSaving(true)
        try {
            // Construct a clean payload with only allowed fields
            // Zod strict validation might fail if we send extra fields like 'author', 'date' etc.
            const dataToSave = {
                title: post.title,
                content: post.content,
                excerpt: post.excerpt,
                slug: finalSlug,
                status,
                featured: post.featured,
                coverImageUrl: post.coverImageUrl,
                seoTitle: post.seoTitle,
                seoDescription: post.seoDescription,
                // Map frontend 'category' (single ID) to backend 'categoryIds' (array)
                categoryIds: post.category ? [post.category] : [],
                tagIds: post.tags,
            }

            if (postId) {
                // Remove blogId from updatePost call
                await updatePost(postId, dataToSave)
            } else {
                await createPost(currentBlog.id, dataToSave)
            }
            navigate('/dashboard/posts')
        } catch (error) {
            console.error('Failed to save post:', error)
            alert('Failed to save post. Please check the console for details.')
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
                            onChange={handleTitleChange}
                        />

                        {/* Optional: URL/Slug display */}
                        <div className="flex items-center text-sm text-gray-500 mt-2">
                            <span className="mr-1">URL:</span>
                            <span className="text-gray-400">/posts/</span>
                            <input
                                type="text"
                                value={post.slug || ''}
                                onChange={(e) => setPost({ ...post, slug: slugify(e.target.value) })}
                                className="bg-transparent border-none p-0 text-sm text-gray-500 focus:ring-0 w-full"
                                placeholder="post-url-slug"
                            />
                        </div>

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
