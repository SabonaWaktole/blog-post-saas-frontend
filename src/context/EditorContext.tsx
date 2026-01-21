import { createContext, useContext, useState, ReactNode } from 'react'

interface EditorContextType {
    title: string
    setTitle: (title: string) => void
    content: string
    setContent: (content: string) => void

    handleSave: () => void
    setHandleSave: (fn: () => void) => void

    handlePublish: () => void
    setHandlePublish: (fn: () => void) => void

    handlePreview: () => void
    setHandlePreview: (fn: () => void) => void

    isSaving: boolean
    setIsSaving: (isSaving: boolean) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [handleSave, setHandleSaveState] = useState<() => void>(() => () => { })
    const [handlePublish, setHandlePublishState] = useState<() => void>(() => () => { })
    const [handlePreview, setHandlePreviewState] = useState<() => void>(() => () => { })

    const setHandleSave = (fn: () => void) => {
        setHandleSaveState(() => fn)
    }

    const setHandlePublish = (fn: () => void) => {
        setHandlePublishState(() => fn)
    }

    const setHandlePreview = (fn: () => void) => {
        setHandlePreviewState(() => fn)
    }

    return (
        <EditorContext.Provider value={{
            title, setTitle,
            content, setContent,
            handleSave, setHandleSave,
            handlePublish, setHandlePublish,
            handlePreview, setHandlePreview,
            isSaving, setIsSaving
        }}>
            {children}
        </EditorContext.Provider>
    )
}

export function useEditor() {
    const context = useContext(EditorContext)
    if (context === undefined) {
        throw new Error('useEditor must be used within an EditorProvider')
    }
    return context
}
