import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchArticleById, Article } from '../../data/articles'
import { fetchCategories, Category } from '../../data/taxonomy'
import { useToast } from '../../components/ui/Toast'
import { useEditor } from '../../context/EditorContext'

function EditorPage() {
    const { postId } = useParams<{ postId: string }>()
    const navigate = useNavigate()
    const toast = useToast()
    const {
        title, setTitle,
        content, setContent,
        setIsSaving, setHandleSave, setHandlePublish, setHandlePreview
    } = useEditor()

    const [showSettings, setShowSettings] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form State (Local)
    const [slug, setSlug] = useState('')
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState<Category[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [newTag, setNewTag] = useState('')
    const [featuredImage, setFeaturedImage] = useState<string | null>(null)
    const [metaDescription, setMetaDescription] = useState('')
    const [isLoading, setIsLoading] = useState(true)

    // Load data if editing
    useEffect(() => {
        const loadEditorData = async () => {
            setIsLoading(true)
            try {
                // Fetch categories for the settings dropdown
                const cats = await fetchCategories()
                setCategories(cats)

                if (postId) {
                    const article = await fetchArticleById(Number(postId))
                    if (article) {
                        setTitle(article.title)
                        setContent(article.content || '')
                        setSlug(article.slug)
                        setCategory(article.category)
                        setTags(article.tags || [])
                        setFeaturedImage(article.image)
                        setMetaDescription(article.excerpt)
                    } else {
                        toast.error('Article not found')
                        navigate('/dashboard/posts')
                    }
                }
            } catch (error) {
                console.error('Failed to load editor', error)
                toast.error('Failed to load editor')
            } finally {
                setIsLoading(false)
            }
        }
        loadEditorData()
    }, [postId, navigate, toast, setTitle, setContent])

    // Register handlers to context
    useEffect(() => {
        setHandleSave(saveDraft)
        setHandlePublish(publishPost)
        setHandlePreview(previewPost)
        // Cleanup
        return () => {
            setHandleSave(() => { })
            setHandlePublish(() => { })
            setHandlePreview(() => { })
        }
    }, [title, content, slug, category, tags, featuredImage])

    const saveDraft = () => {
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success('Changes saved to draft')
        }, 800)
    }

    const previewPost = () => {
        const previewArticle: Article = {
            id: -1, // Temporary ID
            slug: 'preview-mode',
            title: title || 'Untitled Preview',
            excerpt: metaDescription || 'No description',
            content: content || '',
            category: category || 'Uncategorized',
            author: { id: 1, name: 'Current User', avatar: null }, // Mock author
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            readTime: `${Math.ceil((content || '').trim().split(/\s+/).length / 200)} min read`,
            featured: false,
            image: featuredImage,
            status: 'Draft',
            tags: tags
        }
        localStorage.setItem('previewArticle', JSON.stringify(previewArticle))
        window.open('/blog/preview-mode', '_blank')
    }

    const publishPost = () => {
        if (!title || !content) {
            toast.error('Title and content are required')
            return
        }
        setIsSaving(true)
        setTimeout(() => {
            setIsSaving(false)
            toast.success(postId ? 'Article updated successfully' : 'Article published successfully')
            navigate('/dashboard/posts')
        }, 1200)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setFeaturedImage(url)
        }
    }

    const insertFormatting = (type: string) => {
        const textarea = document.querySelector('textarea')
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        let before = text.substring(0, start)
        let selection = text.substring(start, end)
        let after = text.substring(end)
        let newContent = ''

        switch (type) {
            case 'bold':
                newContent = before + `**${selection || 'bold text'}**` + after
                break
            case 'italic':
                newContent = before + `*${selection || 'italic text'}*` + after
                break
            case 'link':
                newContent = before + `[${selection || 'link text'}](url)` + after
                break
            case 'quote':
                newContent = before + `\n> ${selection || 'quote'}\n` + after
                break
            case 'code':
                newContent = before + `\`${selection || 'code'}\`` + after
                break
            case 'list':
                newContent = before + `\n- ${selection || 'item'}\n` + after
                break
            case 'image':
                newContent = before + `\n![Alt text](image-url)\n` + after
                break
            default:
                return
        }
        setContent(newContent)
        textarea.focus()
    }

    const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && newTag.trim()) {
            e.preventDefault()
            if (!tags.includes(newTag.trim())) {
                setTags([...tags, newTag.trim()])
            }
            setNewTag('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const wordCount = content.trim().split(/\s+/).filter(w => w.length > 0).length
    const readTime = Math.ceil(wordCount / 200)

    return (
        <main className="flex min-h-[calc(100vh-64px)] w-full">
            {/* Main Writing Canvas */}
            <div className="flex-1 flex justify-center py-8 lg:py-12 px-4 lg:px-6 overflow-y-auto">
                {isLoading ? (
                    <div className="text-center text-gray-500 pt-20">Loading editor...</div>
                ) : (
                    <div className="w-full max-w-[800px] flex flex-col gap-6 lg:gap-8">
                        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 lg:p-12 min-h-[600px] lg:min-h-[800px] flex flex-col shadow-sm animate-fade-in">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full border-none focus:ring-0 text-3xl lg:text-5xl font-heading font-bold text-charcoal dark:text-white placeholder:text-gray-200 dark:placeholder:text-gray-700 p-0 mb-6 lg:mb-8 bg-transparent transition-all"
                                placeholder="Untitled Story"
                                type="text"
                            />
                            <div className="flex-1 flex flex-col group">
                                <textarea
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    className="w-full flex-1 border-none focus:ring-0 text-base lg:text-lg leading-[1.8] text-gray-700 dark:text-gray-300 placeholder:text-gray-300 dark:placeholder:text-gray-600 p-0 resize-none bg-transparent min-h-[400px] lg:min-h-[500px]"
                                    placeholder="Start your story here..."
                                ></textarea>
                                {/* Formatting Bar */}
                                <div className="flex items-center gap-2 mt-6 lg:mt-8 border-t border-gray-100 dark:border-gray-800 pt-4 lg:pt-6 opacity-50 group-hover:opacity-100 transition-opacity delay-100">
                                    {[
                                        { icon: 'format_bold', action: 'bold', label: 'Bold' },
                                        { icon: 'format_italic', action: 'italic', label: 'Italic' },
                                        { icon: 'link', action: 'link', label: 'Link' },
                                        { icon: 'format_list_bulleted', action: 'list', label: 'List' },
                                        { icon: 'format_quote', action: 'quote', label: 'Quote' },
                                        { icon: 'code', action: 'code', label: 'Code' },
                                        { icon: 'image', action: 'image', label: 'Image' }
                                    ].map((btn) => (
                                        <button
                                            key={btn.action}
                                            onClick={() => insertFormatting(btn.action)}
                                            title={btn.label}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                                        >
                                            <span className="material-symbols-outlined">{btn.icon}</span>
                                        </button>
                                    ))}
                                    <div className="flex-1"></div>
                                    <div className="text-xs font-medium text-gray-400 uppercase tracking-widest hidden sm:block">
                                        {wordCount} words · {readTime} min read
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Settings Sidebar - Desktop */}
            <aside className="w-[320px] lg:w-[360px] border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 lg:p-6 flex-col gap-6 lg:gap-8 overflow-y-auto hidden xl:flex">
                <div>
                    <h3 className="text-charcoal dark:text-white font-bold text-lg mb-1">Post Settings</h3>
                    <p className="text-gray-500 text-sm">Manage visibility and metadata</p>
                </div>
                <div className="flex flex-col gap-4 lg:gap-6">
                    {/* General Section */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">General</span>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-charcoal dark:text-gray-300">URL Slug</span>
                            <input
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="h-10 px-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
                                placeholder="my-awesome-post"
                                type="text"
                            />
                        </label>
                        <label className="flex flex-col gap-1.5">
                            <span className="text-xs font-semibold text-charcoal dark:text-gray-300">Category</span>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="h-10 px-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-colors"
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    {/* Featured Image */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Featured Image</span>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center gap-2 hover:border-primary/50 cursor-pointer bg-gray-50 dark:bg-gray-800 transition-colors overflow-hidden relative"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            {featuredImage ? (
                                <>
                                    <img src={featuredImage} alt="Featured" className="w-full h-full object-cover" />
                                    <button onClick={(e) => { e.stopPropagation(); setFeaturedImage(null); }} className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70">
                                        <span className="material-symbols-outlined text-sm">close</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-gray-400">add_photo_alternate</span>
                                    <span className="text-xs text-gray-500 font-medium">Click to upload</span>
                                </>
                            )}
                        </div>
                    </div>
                    {/* Tags */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Tags</span>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <span key={tag} className="px-2.5 py-1 rounded bg-primary/10 text-primary text-xs font-bold flex items-center gap-1.5 animate-in fade-in zoom-in duration-200">
                                    {tag} <span onClick={() => removeTag(tag)} className="material-symbols-outlined text-sm cursor-pointer hover:text-primary-dark">close</span>
                                </span>
                            ))}
                            <input
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="+ Add Tag"
                                className="px-2.5 py-1 rounded border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-primary w-24 transition-colors"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                    <button
                        onClick={saveDraft}
                        className="w-full flex items-center justify-center gap-2 h-10 rounded border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">save</span>
                        Save Draft
                    </button>
                    <button
                        onClick={publishPost}
                        className="w-full flex items-center justify-center gap-2 h-10 rounded bg-charcoal dark:bg-white text-white dark:text-charcoal text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                        Publish
                    </button>
                </div>
            </aside>

            {/* Mobile Settings FAB */}
            <button onClick={() => setShowSettings(!showSettings)} className="fixed bottom-6 right-6 xl:hidden size-12 rounded-full bg-primary text-white shadow-xl flex items-center justify-center z-50 hover:bg-primary-dark transition-colors">
                <span className="material-symbols-outlined">{showSettings ? 'close' : 'settings'}</span>
            </button>

            {/* Mobile Settings Drawer */}
            {showSettings && (
                <div className="fixed inset-0 z-40 xl:hidden">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in" onClick={() => setShowSettings(false)} />
                    <aside className="absolute right-0 top-0 h-full w-[300px] bg-white dark:bg-gray-900 p-6 overflow-y-auto shadow-xl animate-in slide-in-from-right">
                        <h3 className="font-bold text-lg mb-4 text-charcoal dark:text-white">Post Settings</h3>
                        <div className="space-y-4">
                            {/* Reusing logic for mobile would ideally use a shared component, but copying for simplicity in this file */}
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold text-charcoal dark:text-gray-300">URL Slug</span>
                                <input value={slug} onChange={e => setSlug(e.target.value)} className="h-10 px-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm" type="text" />
                            </label>
                            <label className="flex flex-col gap-1.5">
                                <span className="text-xs font-semibold text-charcoal dark:text-gray-300">Category</span>
                                <select value={category} onChange={e => setCategory(e.target.value)} className="h-10 px-3 rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm">
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </label>
                            <div className="flex flex-col gap-3 pt-4">
                                <button onClick={saveDraft} className="w-full h-10 rounded border border-gray-200 text-sm font-bold">Save Draft</button>
                                <button onClick={publishPost} className="w-full h-10 rounded bg-charcoal text-white text-sm font-bold">Publish</button>
                            </div>
                        </div>
                    </aside>
                </div>
            )}
        </main>
    )
}

export default EditorPage
