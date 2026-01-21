import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastData {
    id: number
    type: ToastType
    message: string
}

interface ToastContextType {
    toasts: ToastData[]
    addToast: (options: { type?: ToastType; message: string; duration?: number }) => number
    removeToast: (id: number) => void
    success: (message: string) => number
    error: (message: string) => number
    info: (message: string) => number
    warning: (message: string) => number
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

interface ToastProviderProps {
    children: ReactNode
}

export function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastData[]>([])

    const addToast = useCallback(({ type = 'info', message, duration = 4000 }: { type?: ToastType; message: string; duration?: number }) => {
        const id = Date.now() + Math.random()
        setToasts(prev => [...prev, { id, type, message }])

        if (duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, duration)
        }

        return id
    }, [])

    const removeToast = useCallback((id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
    }, [])

    const success = useCallback((message: string) => addToast({ type: 'success', message }), [addToast])
    const error = useCallback((message: string) => addToast({ type: 'error', message }), [addToast])
    const info = useCallback((message: string) => addToast({ type: 'info', message }), [addToast])
    const warning = useCallback((message: string) => addToast({ type: 'warning', message }), [addToast])

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast, success, error, info, warning }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

export function useToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

interface ToastContainerProps {
    toasts: ToastData[]
    removeToast: (id: number) => void
}

function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
    if (toasts.length === 0) return null

    return (
        <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    )
}

interface ToastProps {
    toast: ToastData
    onClose: () => void
}

function Toast({ toast, onClose }: ToastProps) {
    const icons: Record<ToastType, string> = {
        success: 'check_circle',
        error: 'error',
        warning: 'warning',
        info: 'info'
    }

    const colors: Record<ToastType, string> = {
        success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
        error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
        warning: 'bg-amber-50 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
        info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
    }

    const iconColors: Record<ToastType, string> = {
        success: 'text-green-600 dark:text-green-400',
        error: 'text-red-600 dark:text-red-400',
        warning: 'text-amber-600 dark:text-amber-400',
        info: 'text-blue-600 dark:text-blue-400'
    }

    return (
        <div
            className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm animate-slide-in ${colors[toast.type]}`}
            role="alert"
        >
            <span className={`material-symbols-outlined ${iconColors[toast.type]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                {icons[toast.type]}
            </span>
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={onClose}
                className="text-current opacity-60 hover:opacity-100 transition-opacity"
            >
                <span className="material-symbols-outlined text-lg">close</span>
            </button>
        </div>
    )
}
