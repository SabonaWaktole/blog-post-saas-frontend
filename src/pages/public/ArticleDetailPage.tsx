import { Link, useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { useToast } from '../../components/ui/Toast'
import { fetchArticleBySlug, fetchArticlesByCategory, Article } from '../../data/articles'
import { likePost, bookmarkPost } from '../../data/interactions'

// In a real app, this would come from subdomain or config
const BLOG_SLUG = 'default-blog'

function ArticleDetailPage() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const scrollProgress = useScrollProgress()
    const toast = useToast()

    const [article, setArticle] = useState<Article | undefined>(undefined)
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [isFollowing, setIsFollowing] = useState(false)
    const [isActionLoading, setIsActionLoading] = useState(false)

    useEffect(() => {
        const loadArticle = async () => {
            if (slug) {
                if (slug === 'preview-mode') {
                    const previewData = localStorage.getItem('previewArticle')
                    if (previewData) {
                        try {
                            const parsedArticle = JSON.parse(previewData)
                            setArticle(parsedArticle)
                            // Mock related articles for preview using fetching? Or just leave mock?
                            // Since preview is local, we probably can't easily fetch 'related' from API based on category of preview.
                            // But we can try fetching matching category.
                            try {
                                const related = (await fetchArticlesByCategory(BLOG_SLUG, parsedArticle.category))
                                    .slice(0, 3)
                                setRelatedArticles(related)
                            } catch (e) {
                                console.warn('Could not fetch related for preview')
                            }
                        } catch (e) {
                            toast.error('Failed to load preview')
                        }
                    } else {
                        toast.error('No preview data found')
                    }
                } else {
                    try {
                        const foundArticle = await fetchArticleBySlug(BLOG_SLUG, slug)
                        if (foundArticle) {
                            setArticle(foundArticle)
                            // Get related articles (same category, excluding current)
                            // Note: We need to pass the BLOG_SLUG
                            const related = (await fetchArticlesByCategory(BLOG_SLUG, foundArticle.category))
                                .filter(a => a.id !== foundArticle.id)
                                .slice(0, 3)
                            setRelatedArticles(related)
                        } else {
                            toast.error('Article not found')
                            navigate('/blog')
                        }
                    } catch (error) {
                        console.error('Failed to fetch article:', error)
                        toast.error('Failed to load article')
                        navigate('/blog')
                    }
                }
            }
        }
        loadArticle()
    }, [slug, navigate, toast])

    const handleShare = async () => {
        const url = window.location.href
        try {
            if (navigator.share) {
                await navigator.share({
                    title: article?.title,
                    text: article?.excerpt,
                    url
                })
            } else {
                await navigator.clipboard.writeText(url)
                toast.info('Link copied to clipboard')
            }
        } catch (err) {
            console.error('Share failed:', err)
        }
    }

    const checkAuth = () => {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error('Please login to continue')
            navigate('/login')
            return false
        }
        return true
    }

    const handleLike = async () => {
        if (!checkAuth() || !article) return
        if (isActionLoading) return
        
        setIsActionLoading(true)
        try {
            await likePost(article.id)
            setIsLiked(!isLiked)
            if (!isLiked) toast.success('Added to your likes')
        } catch (error) {
            console.error('Failed to like post', error)
            toast.error('Failed to like post')
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleBookmark = async () => {
        if (!checkAuth() || !article) return
        if (isActionLoading) return

        setIsActionLoading(true)
        try {
            await bookmarkPost(article.id)
            setIsBookmarked(!isBookmarked)
            if (!isBookmarked) toast.success('Article bookmarked')
        } catch (error) {
            console.error('Failed to bookmark post', error)
            toast.error('Failed to bookmark post')
        } finally {
            setIsActionLoading(false)
        }
    }

    const handleFollow = () => {
        if (!checkAuth()) return

        setIsFollowing(!isFollowing)
        if (!isFollowing) {
            toast.success(`Following ${article?.author.name}`)
        } else {
            toast.info(`Unfollowed ${article?.author.name}`)
        }
    }

    if (!article) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-100 pb-20">
            {/* Sticky Navigation */}
            <header className="sticky top-0 z-50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-all">
                <div className="max-w-screen-xl mx-auto px-4 lg:px-20 h-16 flex items-center justify-between">
                    <Link to="/blog" className="flex items-center gap-2 group">
                        <span className="material-symbols-outlined text-primary group-hover:-translate-x-1 transition-transform">arrow_back</span>
                        <span className="text-sm font-semibold uppercase tracking-widest text-gray-500 hidden sm:inline">Back to feed</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 mr-4 border-r border-gray-200 dark:border-gray-700 pr-4">
                            <button onClick={handleLike} disabled={isActionLoading} className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isLiked ? 'text-red-500' : 'text-gray-400'}`}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
                            </button>
                            <button onClick={handleBookmark} disabled={isActionLoading} className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isBookmarked ? 'text-primary' : 'text-gray-400'}`}>
                                <span className="material-symbols-outlined" style={{ fontVariationSettings: isBookmarked ? "'FILL' 1" : "'FILL' 0" }}>bookmark</span>
                            </button>
                            <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-400">
                                <span className="material-symbols-outlined">share</span>
                            </button>
                        </div>
                        <button className="bg-primary text-white px-5 py-2 text-sm font-bold rounded-lg hover:brightness-110 transition-all">Subscribe</button>
                    </div>
                </div>
                {/* Reading Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-800 h-[2px]">
                    <div className="bg-primary h-full transition-all duration-150 ease-out" style={{ width: `${scrollProgress}%` }}></div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 lg:px-6 py-8 lg:py-24">
                <div className="mb-12">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest mb-6">
                        <span className="w-8 h-[1px] bg-primary"></span>{article.category}
                    </div>
                    <h1 className="font-heading text-3xl md:text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
                        {article.title}
                    </h1>
                    <p className="text-xl text-gray-500 dark:text-gray-400 font-light max-w-2xl">
                        {article.excerpt}
                    </p>
                </div>

                <div className="flex items-center justify-between py-8 border-y border-gray-100 dark:border-gray-800 mb-16">
                    <Link to={`/author/${article.author.id}`} className="flex items-center gap-4 hover:opacity-80 transition-opacity">
                        <div className="size-14 rounded-full bg-gray-300 overflow-hidden">
                            {article.author.avatar ? (
                                <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-xl">
                                    {article.author.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold dark:text-gray-200">{article.author.name}</p>
                            <p className="text-sm text-gray-500">{article.date} · {article.readTime}</p>
                        </div>
                    </Link>
                    <button
                        onClick={handleFollow}
                        className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${isFollowing ? 'bg-zinc-800 text-white dark:bg-white dark:text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                    >
                        {isFollowing ? 'Following' : 'Follow'}
                    </button>
                </div>

                <article className="article-content max-w-[720px] mx-auto prose dark:prose-invert lg:prose-xl">
                    <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-700 rounded-xl mb-12 overflow-hidden">
                        {article.image ? (
                            <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <span className="material-symbols-outlined text-6xl">image</span>
                            </div>
                        )}
                    </div>
                    {/* Render content as HTML or markdown? For now assumes raw text/html */}
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </article>
            </main>

            {/* Related Articles */}
            <section className="max-w-screen-xl mx-auto px-4 lg:px-20 mt-20 pt-16 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-2xl font-bold mb-8 dark:text-white">Read Next</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {relatedArticles.map(related => (
                        <Link key={related.id} to={`/blog/${related.slug}`} className="group cursor-pointer">
                            <div className="aspect-[3/2] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
                                {related.image ? (
                                    <img src={related.image} alt={related.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <span className="material-symbols-outlined text-4xl">image</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">{related.category}</p>
                            <h4 className="text-lg font-bold group-hover:text-primary transition-colors dark:text-gray-200">{related.title}</h4>
                        </Link>
                    ))}
                </div>
            </section>

            <footer className="mt-20 py-16 border-t border-gray-200 dark:border-gray-800 text-center">
                <p className="text-sm text-gray-500">© 2024 Mindful Publishing Systems Inc. All rights reserved.</p>
            </footer>
        </div>
    )
}

export default ArticleDetailPage
