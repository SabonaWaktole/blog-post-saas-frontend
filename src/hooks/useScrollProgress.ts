import { useState, useEffect } from 'react'

export function useScrollProgress() {
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const updateProgress = () => {
            const currentScroll = window.scrollY
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight

            if (scrollHeight) {
                setProgress(Number((currentScroll / scrollHeight).toFixed(2)) * 100)
            }
        }

        window.addEventListener('scroll', updateProgress)
        updateProgress() // Initial check

        return () => window.removeEventListener('scroll', updateProgress)
    }, [])

    return progress
}
