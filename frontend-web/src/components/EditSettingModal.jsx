import { motion } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react"

export default function EditSettingModal({ field, value, onClose, onSave }) {
  const [newValue, setNewValue] = useState(value || "");

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        onClick={onClose}
        >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative"
            onClick={(e) => {e.stopPropagation()}}
        >
            <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
            <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit {field}</h2>

            <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter new ${field.toLowerCase()}`}
            />

            <div className="flex justify-end gap-3">
            <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
                Cancel
            </button>
            <button
                onClick={() => onSave(field, newValue)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                Save
            </button>
            </div>
        </motion.div>
    </motion.div>
  );
}
