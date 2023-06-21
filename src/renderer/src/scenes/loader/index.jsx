import Icon from '@renderer/assets/static/icon.png'

export const Loader = function () {
  return (
    <div className="w-screen h-screen flex center fixed top-0 right-0 bottom-0 left-0">
      <img className="max-w-sm animate-pulse" src={Icon} draggable="false" />
    </div>
  )
}
