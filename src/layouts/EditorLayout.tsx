import { Outlet, Link } from 'react-router-dom'
import { EditorProvider, useEditor } from '../context/EditorContext'

function EditorLayoutContent() {
    const { handleSave, handlePublish, handlePreview, isSaving } = useEditor()

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-charcoal dark:text-gray-200 antialiased">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-4 lg:px-6 py-3">
                <div className="flex items-center gap-4 lg:gap-6">
                    <Link to="/dashboard/posts" className="flex items-center gap-2 text-gray-500 hover:text-charcoal dark:hover:text-white transition-colors">
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                        <span className="text-sm font-medium hidden sm:inline">Dashboard</span>
                    </Link>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <div className="flex items-center gap-2 text-gray-400">
                        {isSaving ? (
                            <>
                                <span className="material-symbols-outlined text-sm animate-spin">sync</span>
                                <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline">Saving...</span>
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-sm">cloud_done</span>
                                <span className="text-xs font-medium uppercase tracking-wider hidden sm:inline">Saved</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 lg:gap-4">
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                        <button onClick={handleSave} className="px-3 lg:px-4 py-1.5 text-xs font-bold rounded-md bg-white dark:bg-gray-700 shadow-sm text-charcoal dark:text-white hover:bg-gray-50 transition-colors">
                            Save Draft
                        </button>
                        <button onClick={handlePreview} className="px-3 lg:px-4 py-1.5 text-xs font-bold text-gray-500 hover:text-charcoal dark:hover:text-white transition-colors">
                            Preview
                        </button>
                    </div>
                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
                    <button onClick={handlePublish} className="flex min-w-[80px] lg:min-w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 lg:px-6 bg-charcoal text-white text-sm font-bold leading-normal tracking-wide hover:bg-black transition-all">
                        Publish
                    </button>
                    <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-9 border border-gray-200 hidden sm:block"
                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC09-44GlCDktchaLJW2p6ILicCRpAe2edFHd8cNleotpaBEdjvm6Ac1CRv4iXX1Zu2z5zdEP9qD7Q10q4_Q6RgaLstcujOsKKnFqRqZQlWQg8Np_FB867NIxZJKp7mq-IA1UhQGEMivfGRLBVYba18AoGp9OSAyJ7OzbJqVmTvD0BUOAzhdEYObK-jxixO0-Fxf6Sjf1xJRmogIVaM0ES1wrKgCGcVhpLZpfBoSeaEV8isqeIRN7S7L5vRJzrbR1njTMkjx1I4I38')" }}
                    />
                </div>
            </header>

            <Outlet />
        </div>
    )
}

function EditorLayout() {
    return (
        <EditorProvider>
            <EditorLayoutContent />
        </EditorProvider>
    )
}

export default EditorLayout
