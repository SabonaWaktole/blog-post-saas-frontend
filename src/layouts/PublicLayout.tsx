import { Outlet } from 'react-router-dom'
import Navbar from '../components/navigation/Navbar'
import Footer from '../components/sections/Footer'

function PublicLayout() {
    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-charcoal dark:text-white transition-colors duration-300">
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default PublicLayout
