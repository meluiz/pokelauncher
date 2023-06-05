import { useAuthStore } from '../../../../stores'

const Avatar = function () {
  const { user } = useAuthStore()

  return (
    <button className="w-12 h-12 flex center shrink-0 grow-0 rounded-b-2xl rounded-t-sm bg-white/5 overflow-hidden cursor-pointer transition-all duration-200 ease-in-out group">
      <img
        src={`https://minotar.net/armor/bust/${user ? user.name : 'undefined'}/80.png`}
        className="w-full h-full object-cover object-center relative transition-all duration-200 ease-in-out"
        alt={`Avatar do ${user?.name}`}
        draggable={false}
      />
    </button>
  )
}

export default Avatar
