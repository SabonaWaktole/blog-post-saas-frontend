import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/ui/Toast'
import AppRoutes from './routes'

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <ToastProvider>
                    <BrowserRouter>
                        <AppRoutes />
                    </BrowserRouter>
                </ToastProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App

