import clsx from 'clsx'
import { twMerge as tw } from 'tailwind-merge'

import { FaPlay, FaStop } from 'react-icons/fa'
import { CircularProgressbarWithChildren } from 'react-circular-progressbar'
import React from 'react'
import { useAuthStore } from '@renderer/stores'
import useMemoryStore from '@renderer/stores/memory'
import { CgSpinner } from 'react-icons/cg'

export const PlayButton = function () {
  const { user } = useAuthStore()
  const { memory } = useMemoryStore()

  const [status, updateStatus] = React.useState('idle')
  const [isPressed, updatePressed] = React.useState(false)
  const [downloadProgress, updateDownloadProgress] = React.useState(false)

  const handleOnClick = React.useCallback(() => {
    updatePressed(true)
    window.electron.ipcRenderer.invoke('launch-game', { user, memory })
  }, [])

  const classes = tw(
    clsx(
      'w-auto min-h-0 flex center pl-3 pr-7 py-3 rounded-3xl space-x-3 group transition-all duration-200',
      'shadow-[0_0_56px_-6px] shadow-orange-7/80 hover:shadow-[0_0_64px_0] hover:shadow-orange-7/80',
      'bg-gradient-to-tr from-orange-6 to-orange-7',
      'text-sand-12 text-2xl font-semibold',
      'active:scale-[0.99] disabled:pointer-events-none disabled:select-none disabled:opacity-50'
    )
  )

  React.useEffect(() => {
    window.electron.ipcRenderer.on('game-check', (ev, { progress, size }) => {
      updateDownloadProgress(((progress / size) * 100).toFixed(0))
      updateStatus('checking')
    })

    window.electron.ipcRenderer.on('game-progress', (ev, { progress, size }) => {
      updateDownloadProgress(((progress / size) * 100).toFixed(0))
      updateStatus('downloading')
    })
  }, [])

  return (
    <div className="w-[168px] flex center rounded-3xl space-x-3 group bg-sage-1 transition-all duration-200 absolute top-full right-20 -translate-y-1/2">
      <button
        type="button"
        className={classes}
        onClick={handleOnClick}
        disabled={status !== 'idle' || isPressed}
      >
        <span className="w-11 h-11 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-200">
          <CircularProgressbarWithChildren
            value={downloadProgress >= 99 ? 0 : downloadProgress}
            styles={{
              path: {
                stroke: `rgba(255,255,255,1)`,
                transformOrigin: 'center center',
                transition:
                  downloadProgress >= 99
                    ? 'stroke-dashoffset 0ms ease 0s'
                    : 'stroke-dashoffset 500s ease 0s'
              },
              trail: {
                stroke: 'rgba(255,255,255,.1)',
                transform: 'rotate(0.25turn)',
                transformOrigin: 'center center'
              }
            }}
          >
            <span className="w-10 h-10 flex center bg-sand-1 text-base rounded-full shadow-md shadow-red-900/70">
              {status === 'checking' ? <CgSpinner className="animate-spin" /> : null}
              {status === 'downloading' ? <FaStop /> : null}
              {status === 'idle' ? <FaPlay /> : null}
            </span>
          </CircularProgressbarWithChildren>
        </span>
        <span>Jogar</span>
      </button>
    </div>
  )
}
