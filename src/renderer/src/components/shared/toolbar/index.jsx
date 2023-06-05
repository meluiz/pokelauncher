import { Cancel, Minus } from 'iconoir-react'

export const Toolbar = function () {
  return (
    <div className="w-full min-h-0 flex fixed top-0 left-0 z-[1000]">
      <span className="w-full flex-1 block relative draggable" />
      <ul className="flex shink-0 grow-0 relative z-10">
        <li className="text-white">
          <button
            className="w-12 h-8 flex center relative cursor-pointer bg-transparent hover:bg-sand-3 text-md"
            onClick={() => {
              window.electron.ipcRenderer.send('main-window-minimize')
            }}
          >
            <Minus />
          </button>
        </li>
        <li className="text-white">
          <button
            className="w-12 h-8 flex center relative cursor-pointer bg-transparent hover:bg-red-4 text-md"
            onClick={() => {
              window.electron.ipcRenderer.send('main-window-close')
            }}
          >
            <Cancel />
          </button>
        </li>
      </ul>
    </div>
  )
}
