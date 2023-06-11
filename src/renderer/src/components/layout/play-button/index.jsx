import React from 'react'

import { useAuthStore } from '@renderer/stores'
import useMemoryStore from '@renderer/stores/memory'

import { FaPlay, FaStop } from 'react-icons/fa'
import { CgSpinner } from 'react-icons/cg'

import { useImmer } from 'use-immer'
import { useEffectOnce } from 'usehooks-ts'

import classes from './classes'
import { CircularProgress } from '@renderer/components/layout'

export const PlayButton = function () {
  const { user } = useAuthStore()
  const { memory } = useMemoryStore()

  const [stats, setStats] = useImmer({
    status: 'idle',
    isPressed: false,
    downloadProgress: 0
  })

  const handleOnClick = React.useCallback(() => {
    window.electron.ipcRenderer.invoke('launch-game', { user, memory })
    setStats((d) => {
      d.isPressed = true
    })
  }, [user, memory])

  useEffectOnce(() => {
    window.electron.ipcRenderer.on('game-progress', (_, { downloaded, totalSize }) => {
      const progress = ((downloaded / totalSize) * 100).toFixed(0)
      setStats((d) => {
        d.status = 'downloading'
        d.downloadProgress = parseInt(progress, 10)
      })
    })

    window.electron.ipcRenderer.on('game-check', (_, { checked, totalSize }) => {
      const progress = ((checked / totalSize) * 100).toFixed(0)
      setStats((d) => {
        d.status = 'checking'
        d.downloadProgress = parseInt(progress, 10)
      })
    })

    window.electron.ipcRenderer.on('game-close', () => {
      setStats((d) => {
        d.isPressed = false
        d.status = 'idle'
      })
    })

    window.electron.ipcRenderer.on('game-error', (_, err) => {
      console.log(err)
    })

    window.electron.ipcRenderer.on('game-speed', (ev, { time, tried }) => {
      const band = (time / 1067008).toFixed(2)

      if (parseInt(band, 10) === 0) {
        window.electron.ipcRenderer.send('launch-download-restart', { tried })
      }

      console.log(`(${tried}) - ${(time / 1067008).toFixed(2)} Mb/s`)
    })
  })

  return (
    <div className="w-[168px] flex center rounded-3xl space-x-3 group bg-sage-1 transition-all duration-200 absolute top-full right-20 -translate-y-1/2">
      <button
        type="button"
        className={classes}
        onClick={handleOnClick}
        disabled={stats.status !== 'idle' || stats.isPressed}
      >
        <span className="w-11 h-11 flex center group-hover:scale-110 group-hover:-rotate-12 transition-all duration-200">
          <CircularProgress
            size={44}
            strokeWidth={2}
            percentage={isNaN(stats.downloadProgress) ? 0 : stats.downloadProgress}
          />
          <span className="w-10 h-10 flex center bg-sand-1 text-base rounded-full shadow-md shadow-red-900/70 absolute ">
            {stats.status === 'checking' ? <CgSpinner className="animate-spin" /> : null}
            {stats.status === 'downloading' ? <FaStop /> : null}
            {stats.status === 'idle' ? <FaPlay /> : null}
          </span>
        </span>
        <span>Jogar</span>
      </button>
    </div>
  )
}
