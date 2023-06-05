import React from 'react'

import { CircularProgressbar } from 'react-circular-progressbar'
import 'react-circular-progressbar/dist/styles.css'

export const Updater = function () {
  const [progress, updateProgress] = React.useState(0)

  React.useEffect(() => {
    window.electron.ipcRenderer.on('download-progress', (ev, progress) => {
      updateProgress(progress.total)
    })
  }, [])

  return (
    <div className="w-screen h-screen flex center fixed top-0 right-0 bottom-0 left-0 bg-black/50 backdrop-blur-[6px] z-[100]">
      <div className="w-28 h-28 bg-gradient-to-tr rounded-full p-2 from-orange-6 to-orange-7 relative hover:scale-110 transition-all duration-150 ease-in-out">
        <div className="w-28 h-28 absolute rounded-full p-2 bg-orange-7/10 top-0 left-0 animate-ping" />
        <CircularProgressbar
          className="relative"
          value={progress}
          text={`${progress}%`}
          styles={{
            path: {
              stroke: `rgba(255,255,255,1)`,
              transition: 'stroke-dashoffset 0.5s ease 0s',
              transformOrigin: 'center center'
            },
            trail: {
              stroke: 'rgba(255,255,255,.1)',
              transform: 'rotate(0.25turn)',
              transformOrigin: 'center center'
            },
            text: {
              fill: '#fff',
              fontSize: '18px',
              fontWeight: '600'
            }
          }}
        />
      </div>
    </div>
  )
}
