import { Link } from 'react-router-dom'
import { useState, Dispatch, SetStateAction, FormEvent } from 'react'
import { useToast } from '../../components/ui/Toast'
import { landingFeatures, landingSteps } from '../../data/landing'

function LandingPage() {
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const toast = useToast()

    const validateEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    }

    const handleNewsletterSubmit = async (e: FormEvent, emailValue: string, setEmailValue: Dispatch<SetStateAction<string>>) => {
        e.preventDefault()

        if (!emailValue.trim()) {
            toast.warning('Please enter your email address')
            return
        }

        if (!validateEmail(emailValue)) {
            toast.error('Please enter a valid email address')
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        toast.success('Welcome aboard! Check your inbox for confirmation.')
        setEmailValue('')
        setIsSubmitting(false)
    }

    return (
        <>
            {/* Hero Section */}
            <section className="relative pt-16 lg:pt-24 pb-20 lg:pb-32 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="serif-headline text-4xl md:text-5xl lg:text-7xl font-light mb-8 leading-[1.1]">
                        The Home for <br /><span className="italic font-normal">Mindful Writing.</span>
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl text-muted-gray dark:text-gray-400 font-normal leading-relaxed mb-12 max-w-2xl mx-auto">
                        A CMS designed for clarity, built for professionals. Manage multiple publications from a single, serene dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 lg:mb-20">
                        <Link
                            to="/auth/register"
                            className="w-full sm:w-auto bg-primary text-white text-base font-bold px-8 lg:px-10 py-4 rounded-xl hover:brightness-110 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            Start Writing Today
                        </Link>
                        <Link
                            to="/blog"
                            className="w-full sm:w-auto border border-border-light dark:border-white/20 px-8 lg:px-10 py-4 rounded-xl text-base font-bold hover:bg-white dark:hover:bg-white/5 transition-all"
                        >
                            View Demo
                        </Link>
                    </div>
                </div>

                {/* Dashboard Preview */}
                <div className="max-w-6xl mx-auto mt-6 lg:mt-10">
                    <div className="relative bg-white dark:bg-zinc-900 rounded-xl editorial-shadow border border-border-light dark:border-white/10 p-4 md:p-8 overflow-hidden">
                        <div className="w-full aspect-video bg-background-light dark:bg-zinc-800 rounded flex flex-col">
                            {/* Fake UI Mockup */}
                            <div className="flex items-center gap-4 border-b border-border-light dark:border-white/5 p-4">
                                <div className="flex gap-1.5">
                                    <div className="size-3 rounded-full bg-red-400/20"></div>
                                    <div className="size-3 rounded-full bg-yellow-400/20"></div>
                                    <div className="size-3 rounded-full bg-green-400/20"></div>
                                </div>
                                <div className="h-6 w-32 bg-border-light dark:bg-white/5 rounded-full"></div>
                            </div>
                            <div className="flex flex-1">
                                <div className="w-48 border-r border-border-light dark:border-white/5 p-6 space-y-4 hidden md:block">
                                    <div className="h-4 w-full bg-border-light dark:bg-white/5 rounded"></div>
                                    <div className="h-4 w-3/4 bg-border-light dark:bg-white/5 rounded"></div>
                                    <div className="h-4 w-5/6 bg-border-light dark:bg-white/5 rounded"></div>
                                </div>
                                <div className="flex-1 p-6 md:p-8 lg:p-12 space-y-6">
                                    <div className="h-8 lg:h-10 w-2/3 bg-border-light dark:bg-white/5 rounded mb-8 lg:mb-10"></div>
                                    <div className="space-y-4">
                                        <div className="h-4 w-full bg-border-light/50 dark:bg-white/5 rounded"></div>
                                        <div className="h-4 w-full bg-border-light/50 dark:bg-white/5 rounded"></div>
                                        <div className="h-4 w-4/5 bg-border-light/50 dark:bg-white/5 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
                    </div>
                </div>
            </section>

            {/* Feature Grid */}
            <section id="features" className="py-16 lg:py-24 px-6 bg-white dark:bg-zinc-900/50">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12 lg:mb-16">
                        <h2 className="serif-headline text-2xl lg:text-3xl font-medium mb-4">Crafted for the Editorial Mind</h2>
                        <div className="h-1 w-20 bg-primary"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {landingFeatures.map((feature, i) => (
                            <div
                                key={i}
                                className={`${feature.isLarge || feature.isWide ? 'md:col-span-2' : ''} border border-border-light dark:border-white/10 p-6 lg:p-8 rounded-xl bg-background-light dark:bg-zinc-800 flex flex-col ${feature.isWide ? 'md:flex-row items-center gap-6 lg:gap-8' : ''} hover:border-primary/30 transition-colors group ${!feature.image ? 'cursor-pointer hover:border-primary/50' : ''}`}
                            >
                                <div className={feature.isWide ? 'flex-1' : (feature.isLarge ? 'max-w-md' : '')}>
                                    <span className={`material-symbols-outlined text-primary text-3xl lg:text-4xl mb-4 lg:mb-6 ${!feature.image ? 'group-hover:scale-110 transition-transform' : ''}`}>{feature.icon}</span>
                                    <h3 className={`text-xl lg:text-2xl font-bold mb-4 ${!feature.isLarge ? 'text-lg lg:text-xl' : ''}`}>{feature.title}</h3>
                                    <p className="text-muted-gray dark:text-gray-400 leading-relaxed text-sm lg:text-base">
                                        {feature.description}
                                    </p>
                                </div>
                                {feature.image && !feature.isWide && (
                                    <div className="mt-8 lg:mt-12 h-36 lg:h-48 bg-white dark:bg-zinc-900 rounded border border-border-light dark:border-white/5 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-center bg-cover opacity-80" style={{ backgroundImage: `url('${feature.image}')` }}></div>
                                    </div>
                                )}
                                {feature.isWide && (
                                    <div className="flex-1 w-full bg-background-light dark:bg-zinc-900 h-32 lg:h-40 rounded flex items-center justify-center mt-6 md:mt-0">
                                        <div className="w-full px-6 flex items-end gap-2 h-20 lg:h-24">
                                            <div className="w-full bg-primary/20 h-1/2 rounded-t animate-pulse"></div>
                                            <div className="w-full bg-primary/40 h-2/3 rounded-t animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-full bg-primary h-full rounded-t animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                            <div className="w-full bg-primary/60 h-3/4 rounded-t animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                            <div className="w-full bg-primary/30 h-1/3 rounded-t animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section id="workflow" className="py-20 lg:py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12 lg:mb-20">
                        <h2 className="serif-headline text-3xl lg:text-4xl font-medium mb-4">The Editorial Path</h2>
                        <p className="text-muted-gray dark:text-gray-400">Simple to setup, delightful to maintain.</p>
                    </div>

                    <div className="relative">
                        {/* Vertical Line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-px bg-border-light dark:bg-white/10 hidden md:block"></div>

                        <div className="space-y-16 lg:space-y-24">
                            {landingSteps.map((step) => (
                                <div key={step.number} className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 group">
                                    <div className={`flex-1 ${step.order.text === 'md:order-1' ? 'text-center md:text-right' : (step.order.text === 'md:order-3' ? 'text-center md:text-left' : '')} text-center ${step.order.text.replace('md:', '')} md:${step.order.text.replace('md:', '')}`}>
                                        <h3 className="text-xl lg:text-2xl font-bold mb-4">{step.number}. {step.title}</h3>
                                        <p className="text-muted-gray dark:text-gray-400 leading-relaxed text-sm lg:text-base">{step.description}</p>
                                    </div>
                                    <div className={`z-10 bg-background-light dark:bg-background-dark p-2 order-1 md:order-2`}>
                                        <div className="size-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg editorial-shadow group-hover:scale-110 transition-transform">{step.number}</div>
                                    </div>
                                    <div className={`flex-1 ${step.order.image.replace('md:', '')} md:${step.order.image.replace('md:', '')}`}>
                                        <div className="h-36 lg:h-48 bg-white dark:bg-zinc-900 rounded-lg editorial-shadow border border-border-light dark:border-white/10 p-4 group-hover:shadow-lg transition-shadow">
                                            <div className="w-full h-full bg-background-light dark:bg-zinc-800 rounded opacity-50 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-border-light dark:text-white/10 text-4xl lg:text-5xl">{step.icon}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA after workflow */}
                    <div className="mt-20 lg:mt-32 text-center">
                        <Link
                            to="/auth/register"
                            className="inline-flex items-center gap-2 bg-primary text-white text-base font-bold px-8 py-4 rounded-xl hover:brightness-110 transition-all shadow-lg hover:shadow-xl"
                        >
                            Get Started Now
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </section>


            {/* Newsletter Section */}
            <section id="newsletter" className="py-20 lg:py-32 px-6 bg-charcoal">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="serif-headline text-3xl lg:text-4xl font-medium mb-4 text-white">Stay in the Loop</h2>
                    <p className="text-gray-400 mb-8 lg:mb-10">
                        Get early access, product updates, and editorial insights delivered to your inbox.
                    </p>
                    <form onSubmit={(e) => handleNewsletterSubmit(e, email, setEmail)} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-5 py-3 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            placeholder="you@example.com"
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-white px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin">progress_activity</span>
                                    Subscribing...
                                </>
                            ) : (
                                <>
                                    Subscribe
                                    <span className="material-symbols-outlined text-lg">send</span>
                                </>
                            )}
                        </button>
                    </form>
                    <p className="mt-4 text-gray-500 text-xs">No spam. Only curated insights. Unsubscribe anytime.</p>
                </div>
            </section>
        </>
    )
}

export default LandingPage
