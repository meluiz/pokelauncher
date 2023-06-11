import React from 'react'

export const Updater = function () {
  const [, updateProgress] = React.useState(0)

  React.useEffect(() => {
    window.electron.ipcRenderer.on('download-progress', (_, progress) => {
      updateProgress(progress.total)
    })
  }, [])

  return (
    <div className="w-screen h-screen flex center fixed top-0 right-0 bottom-0 left-0 bg-black/50 backdrop-blur-[6px] z-[100]">
      <div className="w-28 h-28 bg-gradient-to-tr rounded-full p-2 from-orange-6 to-[#FF6536] relative hover:scale-110 transition-all duration-150 ease-in-out">
        <div className="w-28 h-28 absolute rounded-full p-2 bg-[#FF6536]/10 top-0 left-0 animate-ping" />
      </div>
    </div>
  )
}
