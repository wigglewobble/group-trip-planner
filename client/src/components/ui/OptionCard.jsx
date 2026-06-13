const OptionCard = ({ label, description, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 text-left p-4 rounded-xl border transition-colors duration-150 ${
        selected
          ? 'border-gray-900 bg-gray-50'
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <p className="text-sm font-medium text-gray-900 mb-0.5">{label}</p>
      <p className="text-xs text-gray-500">{description}</p>
    </button>
  )
}

export default OptionCard