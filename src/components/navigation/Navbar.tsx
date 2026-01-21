import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'

function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { theme, toggleTheme } = useTheme()
    const location = useLocation()
    const navigate = useNavigate()

    const handleAnchorClick = (e: React.MouseEvent, sectionId: string) => {
        e.preventDefault()
        setMobileMenuOpen(false)

        // If not on landing page, navigate there first
        if (location.pathname !== '/') {
            navigate('/', { state: { scrollTo: sectionId } })
            return
        }

        const element = document.getElementById(sectionId)
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
    }

    const navLinks = [
        { id: 'features', label: 'Features' },
        { id: 'workflow', label: 'Workflow' },
        { id: 'newsletter', label: 'Newsletter' },
    ]

    return (
        <header className="sticky top-0 z-50 w-full bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-border-light dark:border-white/10">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="text-primary">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight dark:text-white">Mindful CMS</h2>
                    </Link>
                </div>

                <nav className="hidden md:flex items-center gap-10">
                    {navLinks.map(link => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={(e) => handleAnchorClick(e, link.id)}
                            className="text-sm font-medium hover:text-primary transition-colors underline-offset-8 hover:underline dark:text-gray-200 cursor-pointer"
                        >
                            {link.label}
                        </a>
                    ))}
                    <Link to="/blog" className="text-sm font-medium hover:text-primary transition-colors underline-offset-8 hover:underline dark:text-gray-200">
                        Blog
                    </Link>
                </nav>

                <div className="flex items-center gap-4">
                    <button
                        onClick={toggleTheme}
                        className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                        </span>
                    </button>

                    <Link to="/dashboard" className="text-sm font-bold px-6 py-2 hover:text-primary transition-colors dark:text-gray-200">
                        Login
                    </Link>
                    <Link to="/dashboard" className="bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:brightness-110 transition-all">
                        Get Started
                    </Link>

                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className="material-symbols-outlined dark:text-white">
                            {mobileMenuOpen ? 'close' : 'menu'}
                        </span>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-border-light dark:border-gray-800 bg-white dark:bg-background-dark">
                    <nav className="flex flex-col p-4 gap-2">
                        {navLinks.map(link => (
                            <a
                                key={link.id}
                                href={`#${link.id}`}
                                onClick={(e) => handleAnchorClick(e, link.id)}
                                className="text-sm font-medium py-2 hover:text-primary transition-colors dark:text-gray-200"
                            >
                                {link.label}
                            </a>
                        ))}
                        <Link
                            to="/blog"
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-sm font-medium py-2 hover:text-primary transition-colors dark:text-gray-200"
                        >
                            Blog
                        </Link>
                        <button
                            onClick={toggleTheme}
                            className="flex items-center gap-2 text-sm font-medium py-2 hover:text-primary transition-colors dark:text-gray-200"
                        >
                            <span className="material-symbols-outlined text-lg">
                                {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                            </span>
                            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </nav>
                </div>
            )}
        </header>
    )
}

export default Navbar
