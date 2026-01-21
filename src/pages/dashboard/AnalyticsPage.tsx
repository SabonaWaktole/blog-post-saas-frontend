import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    fetchAnalyticsOverview,
    fetchAnalyticsActivity,
    fetchTrafficSources,
    fetchTopArticles,
    AnalyticsStat,
    ChartDataPoint,
    TrafficSource,
    TopArticle
} from '../../data/analytics'

function AnalyticsPage() {
    const [dateRange, setDateRange] = useState('30d')
    const [overviewStats, setOverviewStats] = useState<AnalyticsStat[]>([])
    const [viewsOverTime, setViewsOverTime] = useState<ChartDataPoint[]>([])
    const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([])
    const [topArticles, setTopArticles] = useState<TopArticle[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const loadAnalytics = async () => {
            setIsLoading(true)
            try {
                const [overview, activity, traffic, articles] = await Promise.all([
                    fetchAnalyticsOverview(),
                    fetchAnalyticsActivity(),
                    fetchTrafficSources(),
                    fetchTopArticles()
                ])
                setOverviewStats(overview)
                setViewsOverTime(activity)
                setTrafficSources(traffic)
                setTopArticles(articles)
            } catch (error) {
                console.error('Failed to load analytics', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadAnalytics()
    }, [dateRange])

    // Simple SVG Line Chart Generator
    const renderLineChart = () => {
        if (viewsOverTime.length === 0) return <div>No data</div>

        const maxVal = Math.max(...viewsOverTime.map(d => d.value))

        const points = viewsOverTime.map((d, i) => {
            const x = (i / (viewsOverTime.length - 1)) * 100
            const y = 100 - (d.value / maxVal) * 100
            return `${x},${y}`
        }).join(' ')

        return (
            <div className="relative w-full h-[200px] mt-4">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map(y => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeOpacity="0.1" vectorEffect="non-scaling-stroke" />
                    ))}

                    {/* Area path */}
                    <path
                        d={`M0,100 ${points} 100,100 Z`}
                        fill="currentColor"
                        className="text-primary/10"
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* Line path */}
                    <polyline
                        points={points}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-primary"
                        vectorEffect="non-scaling-stroke"
                    />

                    {/* Points */}
                    {viewsOverTime.map((d, i) => {
                        const x = (i / (viewsOverTime.length - 1)) * 100
                        const y = 100 - (d.value / maxVal) * 100
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                className="fill-white stroke-primary stroke-2"
                                vectorEffect="non-scaling-stroke"
                            />
                        )
                    })}
                </svg>
                {/* Labels */}
                <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    {viewsOverTime.map((d, i) => (
                        <span key={i}>{d.label}</span>
                    ))}
                </div>
            </div>
        )
    }

    if (isLoading) {
        return <div className="min-h-screen text-center pt-20">Loading analytics...</div>
    }

    return (
        <div className="space-y-4 lg:space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-black tracking-tight font-heading">Insights</h2>
                    <p className="text-sm text-gray-500">Real-time performance for <span className="text-primary font-semibold">The Editorial Review</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 items-center gap-1">
                        {['7d', '30d', '90d'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${dateRange === range ? 'bg-primary text-white shadow-sm' : 'text-gray-500 hover:text-charcoal dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center justify-center size-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:text-primary hover:border-primary transition-colors">
                        <span className="material-symbols-outlined text-lg">download</span>
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {overviewStats.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 p-4 lg:p-6 border border-gray-200 dark:border-gray-800 rounded-xl hover:shadow-md transition-shadow">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.label}</p>
                        <div className="flex items-end gap-2">
                            <span className="text-xl lg:text-3xl font-black text-charcoal dark:text-white">{stat.value}</span>
                            <span className={`text-xs font-bold pb-1 flex items-center ${stat.positive ? 'text-green-600' : 'text-red-500'}`}>
                                <span className="material-symbols-outlined text-sm font-bold">{stat.positive ? 'arrow_upward' : 'arrow_downward'}</span>
                                {stat.change}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Line Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-4 lg:p-6 border border-gray-200 dark:border-gray-800 rounded-xl flex flex-col">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
                        <div>
                            <h3 className="text-lg font-bold font-heading">Views over time</h3>
                            <p className="text-xs text-gray-400">Traffic trends across all channels</p>
                        </div>
                        <div className="flex gap-3">
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 dark:text-gray-300"><span className="size-2 rounded-full bg-primary"></span>Views</span>
                            <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400"><span className="size-2 rounded-full bg-gray-300 dark:bg-gray-700"></span>Prev Period</span>
                        </div>
                    </div>
                    <div className="flex-1 w-full flex items-end">
                        {renderLineChart()}
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="bg-white dark:bg-gray-900 p-4 lg:p-6 border border-gray-200 dark:border-gray-800 rounded-xl">
                    <h3 className="text-lg font-bold font-heading mb-1">Traffic Sources</h3>
                    <p className="text-xs text-gray-400 mb-6 lg:mb-8">Where readers discover you</p>
                    <div className="space-y-4 lg:space-y-6">
                        {trafficSources.map((source) => (
                            <div key={source.label} className="space-y-2">
                                <div className="flex justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                                    <span>{source.label}</span>
                                    <span>{source.value}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className={`h-full ${source.color} rounded-full`} style={{ width: `${source.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Top Articles Table */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
                <div className="px-4 lg:px-6 py-4 lg:py-5 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <h3 className="text-lg font-bold font-heading">Top Performing Articles</h3>
                        <p className="text-xs text-gray-400">Most engaging content based on views and read depth</p>
                    </div>
                    <button className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1 hover:gap-2 transition-all">
                        View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800/50 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                <th className="px-4 lg:px-6 py-3">Article Title</th>
                                <th className="px-4 lg:px-6 py-3 hidden sm:table-cell">Publish Date</th>
                                <th className="px-4 lg:px-6 py-3 text-right">Views</th>
                                <th className="px-4 lg:px-6 py-3">Read Rate</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                            {topArticles.map((article) => (
                                <tr
                                    key={article.id}
                                    onClick={() => navigate(`/blog/${article.slug}`)}
                                    className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer"
                                    title="View article"
                                >
                                    <td className="px-4 lg:px-6 py-4">
                                        <span className="text-sm font-bold text-charcoal dark:text-gray-200 group-hover:text-primary transition-colors cursor-pointer">{article.title}</span>
                                    </td>
                                    <td className="px-4 lg:px-6 py-4 text-xs font-mono text-gray-500 hidden sm:table-cell">{article.date}</td>
                                    <td className="px-4 lg:px-6 py-4 font-bold text-sm text-right text-charcoal dark:text-gray-300">{article.views}</td>
                                    <td className="px-4 lg:px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-gray-500 w-8">{article.readRate}%</span>
                                            <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                <div className={`h-full ${article.readRate >= 70 ? 'bg-green-500' : 'bg-primary'}`} style={{ width: `${article.readRate}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AnalyticsPage
