export default function SettingsSection({ title, items, onEdit }) {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3 border-b border-gray-200 pb-1">{title}</h3>
      <div className="space-y-4">
        {items.map(({ label, value, editable }, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0"
          >
            <div>
              <p className="font-medium text-gray-800">{label}</p>
              <p className="text-gray-500 text-sm">{value || "N/A"}</p>
            </div>
            {editable && (
              <button
                onClick={() => onEdit(label, value)}
                className="text-blue-600 text-sm font-medium hover:underline"
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
