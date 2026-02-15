import { Link } from 'react-router-dom'
import { useState, useEffect, FormEvent } from 'react'

import {
    fetchArticles,
    fetchFeaturedArticle,
    fetchArticlesByCategory,
    Article
} from '../../data/articles'
import { siteConfig } from '../../data/site'
import { useToast } from '../../components/ui/Toast'

function BlogHomePage() {
    const [activeCategory, setActiveCategory] = useState<string>('All')
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [displayedArticles, setDisplayedArticles] = useState<Article[]>([])
    const [featuredArticle, setFeaturedArticle] = useState<Article | undefined>(undefined)
    const [categoriesList] = useState<string[]>(['All'])
    const [isLoading, setIsLoading] = useState(true)

    // Newsletter state
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // In a real app, this would come from subdomain or config
    // For this demo, we assume a default blog slug
    const BLOG_SLUG = 'default-blog'
    const toast = useToast()

    useEffect(() => {
        const loadInitialData = async () => {
            setIsLoading(true)
            try {
                // Fetch featured article
                const featured = await fetchFeaturedArticle(BLOG_SLUG)
                setFeaturedArticle(featured)

                // Note: Categories would typically be fetched here
                // but our current API requires blogId for categories.
                // We'll skip it for this public view demo or hardcode common ones if needed.
                // setCategoriesList(['All', ...fetchedCats.map(c => c.name)])
            } catch (error) {
                console.error('Failed to load initial data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadInitialData()
    }, [])

    useEffect(() => {
        const loadArticles = async () => {
            try {
                let items: Article[] = [];
                if (searchQuery.trim()) {
                    items = await fetchArticles(BLOG_SLUG, searchQuery)
                } else if (activeCategory !== 'All') {
                    // We are passing category name as ID for now because we don't have IDs
                    // This might not work if backend expects UUIDs.
                    // If so, we'd need to map names to IDs.
                    // For now, let's assume 'All' or search.
                    items = await fetchArticlesByCategory(BLOG_SLUG, activeCategory)
                } else {
                    items = await fetchArticles(BLOG_SLUG)
                }
                setDisplayedArticles(items)
            } catch (error) {
                console.error('Failed to fetch articles:', error)
            }
        }

        const timeoutId = setTimeout(() => {
            loadArticles()
        }, 300)
        return () => clearTimeout(timeoutId)
    }, [activeCategory, searchQuery])


    const handleNewsletterSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !email.includes('@')) {
            toast.error('Please enter a valid email')
            return
        }

        setIsSubmitting(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        toast.success('Successfully subscribed!')
        setEmail('')
        setIsSubmitting(false)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 text-center text-gray-500">
                Loading content...
            </div>
        )
    }

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <div className="px-6 md:px-20 lg:px-40 flex flex-1 justify-center py-2 md:py-5 border-b border-border-light dark:border-gray-800">
                <div className="flex flex-col max-w-[1200px] flex-1">
                    <header className="flex items-center justify-between whitespace-nowrap px-4 py-3">
                        <div className="flex items-center gap-6 lg:gap-12">
                            <Link to="/blog" className="flex items-center gap-3 text-primary">
                                <div className="size-6">
                                    <span className="material-symbols-outlined text-3xl">architecture</span>
                                </div>
                                <h2 className="text-charcoal dark:text-white text-lg lg:text-xl font-black leading-tight tracking-tight uppercase">{siteConfig.name}</h2>
                            </Link>
                            <div className="hidden md:flex items-center gap-6 lg:gap-8">
                                {siteConfig.nav.map(item => (
                                    <Link key={item.label} className="text-charcoal dark:text-gray-300 text-sm font-semibold leading-normal hover:text-primary transition-colors" to={item.path}>{item.label}</Link>
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-1 justify-end gap-4">
                            <div className="hidden sm:flex items-center bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 focus-within:border-primary transition-all">
                                <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
                                <input
                                    className="w-24 lg:w-48 bg-transparent border-none focus:ring-0 text-sm py-0 placeholder:text-gray-400 dark:text-white"
                                    placeholder="Search insights..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button
                                className="flex items-center justify-center rounded-lg h-10 w-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-charcoal dark:text-white hover:border-primary transition-colors sm:hidden"
                                onClick={() => {
                                    const query = prompt('Search articles:')
                                    if (query !== null) setSearchQuery(query)
                                }}
                            >
                                <span className="material-symbols-outlined">search</span>
                            </button>
                        </div>
                    </header>
                </div>
            </div>

            <main className="flex-1">
                <div className="px-6 md:px-20 lg:px-40 flex flex-1 justify-center py-6 lg:py-10">
                    <div className="flex flex-col max-w-[1200px] flex-1">
                        {/* Featured Article */}
                        {activeCategory === 'All' && !searchQuery && featuredArticle && (
                            <div className="p-0 mb-12 lg:mb-16">
                                <div className="flex flex-col items-stretch justify-start rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-sm lg:flex-row lg:items-stretch">
                                    <div
                                        className="w-full lg:w-3/5 bg-center bg-no-repeat aspect-video lg:aspect-auto bg-cover min-h-[200px] lg:min-h-[400px]"
                                        style={{ backgroundImage: `url('${featuredArticle.image || 'https://images.unsplash.com/photo-1518385732269-8260da7f7b5f'}')` }}
                                    />
                                    <div className="flex w-full lg:w-2/5 flex-col items-stretch justify-center gap-4 lg:gap-6 p-6 lg:p-12">
                                        <div className="flex items-center gap-2">
                                            <span className="inline-block w-8 h-[1px] bg-primary"></span>
                                            <p className="text-primary text-xs font-bold uppercase tracking-widest">Featured Insight</p>
                                        </div>
                                        <h1 className="text-charcoal dark:text-white text-2xl lg:text-5xl font-black leading-[1.1] tracking-tight">
                                            {featuredArticle.title}
                                        </h1>
                                        <div className="flex flex-col gap-4 lg:gap-6">
                                            <p className="text-muted-gray dark:text-gray-400 text-base lg:text-lg font-light leading-relaxed">
                                                {featuredArticle.excerpt}
                                            </p>
                                            <div className="flex items-center justify-between mt-2 lg:mt-4">
                                                <p className="text-muted-gray dark:text-gray-500 text-sm font-medium">{featuredArticle.date} • {featuredArticle.readTime}</p>
                                                <Link to={`/blog/${featuredArticle.slug}`} className="flex items-center gap-2 text-primary text-sm font-bold uppercase tracking-wider hover:translate-x-1 transition-transform">
                                                    <span>Read Story</span>
                                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Category Filtering */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 border-b border-gray-200 dark:border-gray-800 pb-4 gap-4">
                            <h3 className="text-xl font-bold dark:text-white"> Recent Perspectives {searchQuery && `for "${searchQuery}"`}</h3>
                            <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto">
                                {categoriesList.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`flex h-9 shrink-0 items-center justify-center gap-x-2 rounded-full px-4 lg:px-5 cursor-pointer transition-colors ${activeCategory === category
                                            ? 'bg-primary text-white'
                                            : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-charcoal dark:text-gray-300 hover:border-primary'
                                            }`}
                                    >
                                        <p className="text-xs font-bold uppercase tracking-wider">{category}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Article Grid */}
                        {displayedArticles.filter(a => a.id !== featuredArticle?.id).length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 lg:gap-x-8 gap-y-8 lg:gap-y-12 mb-16 lg:mb-20">
                                {displayedArticles.filter(a => a.id !== featuredArticle?.id).map((article) => (
                                    <Link key={article.id} to={`/blog/${article.slug}`} className="group flex flex-col gap-4 cursor-pointer">
                                        <div className="relative overflow-hidden rounded-lg aspect-[16/10]">
                                            <div
                                                className="w-full h-full bg-center bg-no-repeat bg-cover transition-transform duration-500 group-hover:scale-105"
                                                style={{ backgroundImage: `url('${article.image || 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc'}')` }}
                                            />
                                            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest text-primary">
                                                {article.category}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-charcoal dark:text-white text-lg lg:text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="text-muted-gray dark:text-gray-400 text-sm font-normal leading-relaxed line-clamp-2">
                                                {article.excerpt}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-muted-gray dark:text-gray-500 text-xs font-medium uppercase tracking-tighter">{article.date}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                                <span className="text-muted-gray dark:text-gray-500 text-xs font-medium uppercase tracking-tighter">{article.readTime}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="py-20 text-center text-gray-400">
                                <span className="material-symbols-outlined text-4xl mb-4">search_off</span>
                                <p>No articles found matching your criteria.</p>
                                <button
                                    onClick={() => { setActiveCategory('All'); setSearchQuery('') }}
                                    className="mt-4 text-primary font-bold hover:underline"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {/* Newsletter CTA */}
                        <div className="relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 p-6 md:p-12 lg:p-16 mb-12 lg:mb-20 text-center flex flex-col items-center">
                            <div className="absolute top-0 right-0 p-4 text-primary/10 hidden md:block">
                                <span className="material-symbols-outlined text-[150px] lg:text-[200px] rotate-12">mail</span>
                            </div>
                            <div className="relative z-10 max-w-2xl">
                                <h2 className="text-charcoal dark:text-white text-2xl md:text-3xl lg:text-4xl font-black mb-4">The Monday Dispatch</h2>
                                <p className="text-muted-gray dark:text-gray-400 text-base lg:text-lg mb-6 lg:mb-8">
                                    Join 15,000+ architects and designers receiving our weekly editorial on the future of built environments.
                                </p>
                                <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-lg mx-auto">
                                    <input
                                        className="flex-1 rounded-lg border-gray-200 dark:border-gray-700 dark:bg-background-dark dark:text-white px-4 lg:px-5 h-12 text-base focus:ring-primary focus:border-primary"
                                        placeholder="you@example.com"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-6 lg:px-8 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isSubmitting ? 'Subscribing...' : (
                                            <>
                                                <span>Subscribe</span>
                                                <span className="material-symbols-outlined text-[20px]">send</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                                <p className="mt-4 text-muted-gray dark:text-gray-500 text-xs">No spam. Only curated high-quality architectural insights. Unsubscribe at any time.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Blog Footer */}
            <footer className="px-6 md:px-20 lg:px-40 py-8 lg:py-12 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-primary">
                            <span className="material-symbols-outlined text-2xl">architecture</span>
                            <span className="text-lg font-black uppercase tracking-tight dark:text-white">{siteConfig.name}</span>
                        </div>
                        <p className="text-muted-gray dark:text-gray-400 text-sm max-w-xs">{siteConfig.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-x-8 lg:gap-x-12 gap-y-6">
                        <div className="flex flex-col gap-3">
                            <h4 className="text-xs font-black uppercase tracking-widest text-charcoal dark:text-white">Journal</h4>
                            {siteConfig.footer.journal.map(link => (
                                <Link key={link.label} className="text-muted-gray dark:text-gray-400 text-sm hover:text-primary transition-colors" to={link.path}>{link.label}</Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-xs font-black uppercase tracking-widest text-charcoal dark:text-white">Connect</h4>
                            {siteConfig.socials.map(link => (
                                <Link key={link.name} className="text-muted-gray dark:text-gray-400 text-sm hover:text-primary transition-colors" to={link.url}>{link.name}</Link>
                            ))}
                        </div>
                        <div className="flex flex-col gap-3">
                            <h4 className="text-xs font-black uppercase tracking-widest text-charcoal dark:text-white">About</h4>
                            {siteConfig.footer.about.map(link => (
                                <Link key={link.label} className="text-muted-gray dark:text-gray-400 text-sm hover:text-primary transition-colors" to={link.path}>{link.label}</Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto mt-8 lg:mt-12 pt-6 lg:pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between text-muted-gray dark:text-gray-500 text-xs gap-4">
                    <p>{siteConfig.copyright}</p>
                    <div className="flex gap-6">
                        {siteConfig.footer.legal.map(link => (
                            <Link key={link.label} className="hover:text-primary" to={link.path}>{link.label}</Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default BlogHomePage
