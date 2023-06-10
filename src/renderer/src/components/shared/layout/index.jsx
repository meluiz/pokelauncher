import * as Tabs from '@radix-ui/react-tabs'

import { Homepage, Settings } from '../../scene'
import { Navigation } from '../navigation'
import { Toolbar } from '../toolbar'

import React from 'react'

import * as Scroll from '@radix-ui/react-scroll-area'

import { Modal } from '../modal'
import { useAuthStore } from '../../../stores'
import { Updater } from '../updater'

export const Layout = function () {
  const { user } = useAuthStore()
  const [hasAvailableUpdate, updateAvailableUpdate] = React.useState(true)

  React.useEffect(() => {
    if (process.env.NODE_ENV) {
      updateAvailableUpdate(false)
    }

    window.electron.ipcRenderer.on('update-available', () => {
      updateAvailableUpdate(true)
      window.electron.ipcRenderer.send('start-update')
    })

    window.electron.ipcRenderer.on('update-not-available', () => {
      updateAvailableUpdate(false)
    })
  }, [])

  return (
    <div className="w-screen h-screen block relative bg-accents-1 text-sand-10">
      <Toolbar />
      {!hasAvailableUpdate ? <Modal show={!user} /> : <Updater />}
      <Tabs.Root
        type="scroll"
        className="w-full h-screen flex flex-nowrap text-sand-10 overflow-hidden"
        defaultValue="homepage"
      >
        <Navigation />
        <Scroll.Root className="w-auto min-h-0 flex flex-1 relative">
          <Scroll.Viewport className="w-full h-full block relative overflow-hidden">
            <Homepage />
            <Settings />
          </Scroll.Viewport>
          <Scroll.Scrollbar className="w-1 bg-transparent z-50" orientation="vertical">
            <Scroll.Thumb className="w-2 bg-sand-6" data-state="hidden" />
          </Scroll.Scrollbar>
        </Scroll.Root>
      </Tabs.Root>
    </div>
  )
}
