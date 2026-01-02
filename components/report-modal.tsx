import { X, Flag } from "lucide-react"

interface ReportModalProps {
    isOpen: boolean
    onClose: () => void
    projectName: string
    onSubmit: (reason: string, customReason?: string) => void
}

export function ReportModal({ isOpen, onClose, projectName, onSubmit }: ReportModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-md border border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <Flag className="w-6 h-6 text-red-400" />
                        <h2 className="text-xl font-bold text-white">Report Project</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <p className="text-white mb-4">Reporting {projectName}. (Feature requires backend, showing stub)</p>
                <button onClick={() => { onSubmit("Abuse"); onClose(); }} className="w-full bg-red-500 text-white py-2 rounded">Submit Report</button>
            </div>
        </div>
    )
}
