
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Blog, fetchBlogs } from '../data/blogs'
import { useAuth } from './AuthContext'

interface BlogContextType {
    blogs: Blog[]
    currentBlog: Blog | null
    setCurrentBlog: (blog: Blog) => void
    isLoading: boolean
    refreshBlogs: () => Promise<void>
}

const BlogContext = createContext<BlogContextType | undefined>(undefined)

export function BlogProvider({ children }: { children: ReactNode }) {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [currentBlog, setCurrentBlog] = useState<Blog | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const { isAuthenticated } = useAuth()

    const loadBlogs = async () => {
        if (!isAuthenticated) {
            setBlogs([])
            setCurrentBlog(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)
        try {
            const data = await fetchBlogs()
            setBlogs(data)

            // Set first blog as default if none selected
            if (data.length > 0 && !currentBlog) {
                setCurrentBlog(data[0])
            } else if (data.length > 0 && currentBlog) {
                // Ensure current blog still exists/is updated
                const updatedCurrent = data.find(b => b.id === currentBlog.id)
                if (updatedCurrent) {
                    setCurrentBlog(updatedCurrent)
                } else {
                    setCurrentBlog(data[0])
                }
            }
        } catch (error) {
            console.error('Failed to load blogs:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadBlogs()
    }, [isAuthenticated])

    return (
        <BlogContext.Provider value={{
            blogs,
            currentBlog,
            setCurrentBlog,
            isLoading,
            refreshBlogs: loadBlogs
        }}>
            {children}
        </BlogContext.Provider>
    )
}

export function useBlog() {
    const context = useContext(BlogContext)
    if (context === undefined) {
        throw new Error('useBlog must be used within a BlogProvider')
    }
    return context
}
