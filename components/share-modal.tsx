interface ShareModalProps {
    project: any
    isOpen: boolean
    onClose: () => void
}

export function ShareModal({ project, isOpen, onClose }: ShareModalProps) {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-900 p-6 rounded-xl border border-gray-700">
                <h2 className="text-white text-xl mb-4">Share functionality coming soon!</h2>
                <button onClick={onClose} className="bg-yellow-400 text-black px-4 py-2 rounded">Close</button>
            </div>
        </div>
    )
}
