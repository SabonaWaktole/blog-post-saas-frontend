import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useToast } from '../../components/ui/Toast'
import { fetchArticlesByAuthor, Article } from '../../data/articles'
import { fetchAuthorById, AuthorProfile } from '../../data/authors'

function AuthorProfilePage() {
    const { authorId } = useParams<{ authorId: string }>()
    const toast = useToast()

    const [author, setAuthor] = useState<AuthorProfile | undefined>(undefined)
    const [authorArticles, setAuthorArticles] = useState<Article[]>([])
    const [displayedArticles, setDisplayedArticles] = useState<Article[]>([])
    const [activeTab, setActiveTab] = useState<'chronological' | 'popular'>('chronological')
    const [currentPage, setCurrentPage] = useState(1)
    const [isFollowing, setIsFollowing] = useState(false)

    const ARTICLES_PER_PAGE = 5

    useEffect(() => {
        const loadAuthorData = async () => {
            if (!authorId) return

            try {
                const foundAuthor = await fetchAuthorById(authorId)
                if (foundAuthor) {
                    setAuthor(foundAuthor)
                    const related = await fetchArticlesByAuthor(authorId)
                    setAuthorArticles(related)
                } else {
                    toast.error('Author not found')
                }
            } catch (error) {
                console.error('Failed to load author data', error)
                toast.error('Failed to load author profile')
            }
        }
        loadAuthorData()
    }, [authorId])

    useEffect(() => {
        let sorted = [...authorArticles]
        if (activeTab === 'popular') {
            // Mock popularity by mixing it up or just reverse chronological for now as mock
            // In real app, would sort by views/likes
            sorted = sorted.reverse()
        } else {
            // Chronological (assuming mock data is already sorted or sort by id desc)
            // String IDs might NOT sort numerically correctly if UUID, so use date
            sorted = sorted.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        }

        const start = (currentPage - 1) * ARTICLES_PER_PAGE
        const end = start + ARTICLES_PER_PAGE
        setDisplayedArticles(sorted.slice(start, end))
    }, [authorArticles, activeTab, currentPage])

    const handleFollow = () => {
        setIsFollowing(!isFollowing)
        if (!isFollowing) {
            toast.success(`You are now following ${author?.name}`)
        } else {
            toast.info(`Unfollowed ${author?.name}`)
        }
    }

    const totalPages = Math.ceil(authorArticles.length / ARTICLES_PER_PAGE)

    if (!author) return <div className="min-h-screen pt-20 text-center">Loading profile...</div>

    return (
        <div className="bg-background-light dark:bg-background-dark text-charcoal dark:text-gray-100">
            <main className="max-w-[1200px] mx-auto px-4 lg:px-10 pb-20">
                {/* Profile Header */}
                <section className="py-12 lg:py-24 border-b border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-16">
                        <div className="size-40 lg:size-52 rounded-lg bg-gray-300 dark:bg-gray-700 shadow-xl overflow-hidden">
                            {author.avatar ? (
                                <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold text-5xl">
                                    {author.name.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="mb-2 uppercase tracking-[0.2em] text-[10px] font-bold text-primary">{author.role}</div>
                            <h1 className="font-heading text-3xl lg:text-5xl font-bold mb-4">{author.name}</h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">{author.location}</p>
                            <p className="text-gray-500 dark:text-gray-300 max-w-2xl mb-8 text-sm lg:text-base leading-relaxed">
                                {author.bio}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 mb-8 text-sm">
                                <div className="flex flex-col items-center sm:items-start">
                                    <span className="font-bold text-xl">{author.stats.articles}</span>
                                    <span className="text-gray-400 text-xs uppercase tracking-wider">Articles</span>
                                </div>
                                <div className="flex flex-col items-center sm:items-start">
                                    <span className="font-bold text-xl">{author.stats.followers.toLocaleString()}</span>
                                    <span className="text-gray-400 text-xs uppercase tracking-wider">Followers</span>
                                </div>
                                <div className="flex flex-col items-center sm:items-start">
                                    <span className="font-bold text-xl">{author.stats.following}</span>
                                    <span className="text-gray-400 text-xs uppercase tracking-wider">Following</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="flex gap-2">
                                    <button className="size-10 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-xl">share</span>
                                    </button>
                                    <button className="size-10 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-xl">mail</span>
                                    </button>
                                </div>
                                <button
                                    onClick={handleFollow}
                                    className={`px-8 py-2.5 rounded font-bold text-sm uppercase tracking-widest transition-all ${isFollowing ? 'bg-zinc-800 text-white dark:bg-white dark:text-black' : 'bg-primary text-white hover:brightness-110'}`}
                                >
                                    {isFollowing ? 'Following' : 'Follow Author'}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Articles Section */}
                <section className="py-12 lg:py-16">
                    <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-6">
                        <div className="flex items-baseline gap-4">
                            <h2 className="font-heading text-2xl font-bold dark:text-white">Published Articles</h2>
                            <span className="text-sm text-gray-400">({authorArticles.length})</span>
                        </div>
                        <div className="flex border-b border-gray-200 dark:border-gray-700 gap-6 lg:gap-8">
                            <button
                                onClick={() => setActiveTab('chronological')}
                                className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'chronological' ? 'border-b-2 border-primary text-charcoal dark:text-white' : 'border-b-2 border-transparent text-gray-400 hover:text-primary'}`}
                            >
                                Chronological
                            </button>
                            <button
                                onClick={() => setActiveTab('popular')}
                                className={`pb-2 text-sm font-bold transition-colors ${activeTab === 'popular' ? 'border-b-2 border-primary text-charcoal dark:text-white' : 'border-b-2 border-transparent text-gray-400 hover:text-primary'}`}
                            >
                                Most Popular
                            </button>
                        </div>
                    </div>

                    <div className="space-y-12 lg:space-y-16">
                        {displayedArticles.length > 0 ? (
                            displayedArticles.map((article) => (
                                <article key={article.id} className="group flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[10px] font-bold tracking-widest uppercase text-primary">{article.category}</span>
                                            <span className="text-[10px] text-gray-300">—</span>
                                            <time className="text-[10px] font-bold tracking-widest uppercase text-gray-400">{article.date}</time>
                                        </div>
                                        <Link to={`/blog/${article.slug}`}>
                                            <h3 className="font-heading text-xl lg:text-2xl font-bold mb-4 group-hover:text-primary cursor-pointer dark:text-white dark:group-hover:text-primary transition-colors">
                                                {article.title}
                                            </h3>
                                        </Link>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm lg:text-base mb-6 line-clamp-2 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                        <Link to={`/blog/${article.slug}`} className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:gap-3 transition-all">
                                            Read Article
                                            <span className="material-symbols-outlined text-lg">arrow_forward</span>
                                        </Link>
                                    </div>
                                    <Link to={`/blog/${article.slug}`} className="w-full md:w-64 aspect-[4/3] rounded-sm bg-gray-200 dark:bg-gray-800 overflow-hidden">
                                        <img src={article.image ?? undefined} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </Link>
                                </article>
                            ))
                        ) : (
                            <div className="py-20 text-center text-gray-500">
                                No articles found.
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-16 lg:mt-20 pt-12 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm font-bold uppercase disabled:opacity-50 disabled:hover:text-gray-400"
                            >
                                <span className="material-symbols-outlined">chevron_left</span>Newer
                            </button>
                            <div className="flex gap-4">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`size-8 flex items-center justify-center rounded-sm text-sm font-bold transition-colors ${currentPage === i + 1 ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="flex items-center gap-2 text-gray-400 hover:text-primary text-sm font-bold uppercase disabled:opacity-50 disabled:hover:text-gray-400"
                            >
                                Older<span className="material-symbols-outlined">chevron_right</span>
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

export default AuthorProfilePage
