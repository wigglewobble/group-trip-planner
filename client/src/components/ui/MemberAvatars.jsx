const colors = [
  'bg-purple-100 text-purple-700',
  'bg-teal-100 text-teal-700',
  'bg-amber-100 text-amber-700',
  'bg-pink-100 text-pink-700',
  'bg-blue-100 text-blue-700',
]

const MemberAvatars = ({ members, max = 4 }) => {
  const visible = members.slice(0, max)
  const extra = members.length - max

  return (
    <div className="flex items-center">
      {visible.map((member, index) => (
        <div
          key={member.id}
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white -ml-2 first:ml-0 ${colors[index % colors.length]}`}
          title={member.name}
        >
          {member.name.charAt(0).toUpperCase()}
        </div>
      ))}

      {extra > 0 && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white -ml-2 bg-gray-100 text-gray-600">
          +{extra}
        </div>
      )}
    </div>
  )
}

export default MemberAvatars