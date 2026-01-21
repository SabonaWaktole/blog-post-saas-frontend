import { Link } from 'react-router-dom'
import { useState, FormEvent } from 'react'
import { useToast } from '../ui/Toast'

function Footer() {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const toast = useToast()

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.warning('Please enter your email address')
            return
        }

        if (!validateEmail(email)) {
            toast.error('Please enter a valid email address')
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast.success('Successfully subscribed to The Monthly Journal!')
        setEmail('')
        setIsSubmitting(false)
    }

    return (
        <footer className="bg-charcoal text-gray-300 py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 text-white mb-6">
                            <div className="text-primary">
                                <svg className="w-8 h-8" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M36.7273 44C33.9891 44 31.6043 39.8386 30.3636 33.69C29.123 39.8386 26.7382 44 24 44C21.2618 44 18.877 39.8386 17.6364 33.69C16.3957 39.8386 14.0109 44 11.2727 44C7.25611 44 4 35.0457 4 24C4 12.9543 7.25611 4 11.2727 4C14.0109 4 16.3957 8.16144 17.6364 14.31C18.877 8.16144 21.2618 4 24 4C26.7382 4 29.123 8.16144 30.3636 14.31C31.6043 8.16144 33.9891 4 36.7273 4C40.7439 4 44 12.9543 44 24C44 35.0457 40.7439 44 36.7273 44Z" fill="currentColor"></path>
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight">Mindful CMS</h2>
                        </div>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            A boutique publishing platform for high-end digital journalism and corporate storytelling. Built for clarity and permanence.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link className="hover:text-primary transition-colors" to="/dashboard/posts/new">Editor Features</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/dashboard">Team Workflows</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="/dashboard/blogs">Integrations</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="#">API Reference</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-sm">
                            <li><Link className="hover:text-primary transition-colors" to="#">About Us</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="#">Our Philosophy</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="#">Careers</Link></li>
                            <li><Link className="hover:text-primary transition-colors" to="#">Sustainability</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold mb-6">Newsletter</h4>
                        <p className="text-xs text-gray-400 mb-4 uppercase tracking-widest font-bold">The Monthly Journal</p>
                        <form onSubmit={handleSubmit} className="flex">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-zinc-800 border-none rounded-l px-4 py-2 w-full focus:ring-1 focus:ring-primary text-sm text-white placeholder:text-gray-500"
                                placeholder="Email address"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary text-white px-4 py-2 rounded-r hover:brightness-110 disabled:opacity-50 transition-all"
                            >
                                {isSubmitting ? (
                                    <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                                ) : (
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-xs text-gray-500">© 2024 Mindful Publishing Systems Inc. All rights reserved.</p>
                    <div className="flex items-center gap-8">
                        <Link className="text-xs text-gray-500 hover:text-white transition-colors" to="#">Privacy Policy</Link>
                        <Link className="text-xs text-gray-500 hover:text-white transition-colors" to="#">Terms of Service</Link>
                        <Link className="text-xs text-gray-500 hover:text-white transition-colors" to="#">Cookie Settings</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
