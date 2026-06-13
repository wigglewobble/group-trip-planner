const InterestChip = ({ label, selected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-sm px-3 py-1.5 rounded-full border transition-colors duration-150 ${
        selected
          ? 'bg-gray-900 text-white border-gray-900'
          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
      }`}
    >
      {label}
    </button>
  )
}

export default InterestChip