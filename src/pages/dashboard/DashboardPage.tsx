import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
    fetchDashboardStats,
    fetchDashboardActivity,
    seoScore,
    topTags,
    DashboardStat,
    ActivityItem
} from '../../data/dashboard'

function DashboardPage() {
    const [stats, setStats] = useState<DashboardStat[]>([])
    const [activities, setActivities] = useState<ActivityItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadDashboardData = async () => {
            setIsLoading(true)
            try {
                const [statsData, activityData] = await Promise.all([
                    fetchDashboardStats(),
                    fetchDashboardActivity()
                ])
                setStats(statsData)
                setActivities(activityData)
            } catch (error) {
                console.error('Failed to load dashboard data', error)
            } finally {
                setIsLoading(false)
            }
        }
        loadDashboardData()
    }, [])

    if (isLoading) {
        return <div className="p-8 text-center text-gray-400">Loading dashboard...</div>
    }

    return (
        <div className="space-y-6 lg:space-y-8 animate-fade-in">
            {/* Quick Start Banner */}
            <div className="p-4 lg:p-6 bg-charcoal dark:bg-gray-900 rounded-lg flex flex-col md:flex-row justify-between items-center gap-4 border border-charcoal shadow-lg">
                <div className="space-y-1 text-center md:text-left">
                    <h3 className="text-white text-lg font-bold font-heading">Ready for your next piece?</h3>
                    <p className="text-gray-400 text-sm">A new blank draft is just a click away. Your readers are waiting.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <Link to="/dashboard/posts/new" className="flex-1 md:flex-none px-4 lg:px-6 py-2.5 bg-primary text-white text-sm font-bold rounded hover:bg-primary/90 transition-all text-center">
                        Start Drafting
                    </Link>
                    <button className="flex-1 md:flex-none px-4 lg:px-6 py-2.5 bg-white/10 text-white text-sm font-bold rounded hover:bg-white/20 border border-white/10 text-center transition-colors">
                        Upload Assets
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                {stats.length > 0 ? stats.map((stat, index) => (
                    <div key={index} className={`bg-white dark:bg-gray-900 p-4 lg:p-6 border border-border-light dark:border-gray-800 rounded shadow-sm hover:shadow-md transition-shadow ${stat.users ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-muted-gray text-[11px] font-bold uppercase tracking-widest">{stat.label}</span>
                            {stat.trend && (
                                <span className={`${stat.trendType === 'positive' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : stat.trendType === 'neutral' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/20' : 'text-red-600 bg-red-50 dark:bg-red-900/20'} text-xs font-bold px-1.5 py-0.5 rounded`}>
                                    {stat.trend}
                                </span>
                            )}
                            {stat.chartBars && (
                                <span className="material-symbols-outlined text-muted-gray text-[18px]">verified</span>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-charcoal dark:text-white text-2xl lg:text-3xl font-bold font-heading tracking-tight">{stat.value}</span>
                            <span className="text-muted-gray text-sm">{stat.sublabel}</span>
                        </div>

                        {stat.progress !== undefined && (
                            <div className="mt-4 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${stat.progress}%` }}></div>
                            </div>
                        )}

                        {stat.chartBars && (
                            <div className="mt-4 flex gap-1 items-end h-4">
                                {stat.chartBars.map((bar, i) => (
                                    <div key={i} className={`flex-1 rounded-sm ${i < 3 ? 'bg-primary' : 'bg-gray-100 dark:bg-gray-800'}`} style={{ height: `${bar}%` }}></div>
                                ))}
                            </div>
                        )}

                        {stat.users && (
                            <div className="mt-4 flex -space-x-2">
                                {stat.users.map((user, i) => (
                                    <div key={i} className="size-6 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center text-[8px] font-bold text-charcoal dark:text-white">
                                        {user}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )) : <div className="col-span-3 text-center text-gray-500 py-10">No stats available</div>}
            </div>

            {/* Activity and Side Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-charcoal dark:text-white text-lg font-bold font-heading">Recent Activity</h2>
                        <button className="text-primary text-xs font-bold uppercase tracking-widest hover:underline">View All</button>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-border-light dark:border-gray-800 rounded-lg overflow-hidden shadow-sm">
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {activities.length > 0 ? activities.map((item) => (
                                <div key={item.id} className="p-4 flex gap-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-default">
                                    <div className="size-10 rounded bg-background-light dark:bg-gray-800 flex items-center justify-center shrink-0">
                                        <span className={`material-symbols-outlined ${item.color}`}>{item.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                            <p className="text-sm font-bold text-charcoal dark:text-white truncate">
                                                {item.user} <span className="font-medium text-muted-gray">{item.action}</span> {item.target}
                                            </p>
                                            <span className="text-[10px] text-muted-gray font-medium whitespace-nowrap">{item.time}</span>
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="p-4 text-center text-gray-500">No recent activity</div>}
                        </div>
                    </div>
                </div>

                {/* Blog Health */}
                <div className="space-y-4 lg:space-y-6">
                    <div className="px-2">
                        <h2 className="text-charcoal dark:text-white text-lg font-bold font-heading">Blog Health</h2>
                    </div>
                    <div className="bg-white dark:bg-gray-900 border border-border-light dark:border-gray-800 rounded-lg p-4 lg:p-5 space-y-4 lg:space-y-6 shadow-sm">
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-muted-gray uppercase tracking-widest">SEO Score</span>
                                <span className="text-primary">{seoScore}/100</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all duration-1000 ease-out" style={{ width: `${seoScore}%` }}></div>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-xs font-bold text-muted-gray uppercase tracking-widest">Top Tags</p>
                            <div className="flex flex-wrap gap-2">
                                {topTags.map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-background-light dark:bg-gray-800 text-[10px] font-bold text-charcoal dark:text-gray-300 rounded border border-border-light dark:border-gray-700 hover:border-primary transition-colors cursor-pointer">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-xs font-bold text-muted-gray uppercase tracking-widest">Support</p>
                            <div className="flex items-center gap-1.5">
                                <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-[10px] font-bold text-green-600 uppercase">All Systems Online</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage
