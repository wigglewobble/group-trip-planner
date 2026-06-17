const OptionCard = ({ label, description, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 text-left p-4 rounded-xl border transition-colors duration-150 ${
        selected
          ? 'border-gray-900 dark:border-gray-100 bg-gray-50 dark:bg-gray-800'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-[#2f2f2f] hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-0.5">{label}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </button>
  )
}

export default OptionCard