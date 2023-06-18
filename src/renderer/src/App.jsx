import React from 'react'

import { useEffectOnce } from 'usehooks-ts'

import { Loader } from './components/scene'
import { Layout } from './components/shared'

import useAuthStore from './stores/auth'
import useMemoryStore from './stores/memory'

const App = function () {
  const { auth } = useAuthStore()
  const { action } = useMemoryStore()

  const [isWindowUpdated, updateWindowUpdated] = React.useState(false)

  function checkForUpdate() {
    window.electron.ipcRenderer.invoke('updater-update-laucher').then((res) => {
      if (res && res.error) {
        return window.electron.ipcRenderer.send('main-window-close')
      }

      window.electron.ipcRenderer.send('main-window-open')
      updateWindowUpdated(true)
    })

    window.electron.ipcRenderer.send('main-window-open')
    updateWindowUpdated(true)
  }

  useEffectOnce(() => {
    ;(async () => await auth.verify())()
    ;(async () => await action.verify())()
  })

  React.useEffect(() => {
    window.electron.ipcRenderer.on('data', () => {
      window.electron.ipcRenderer.invoke('main-window-hide')
    })

    window.electron.ipcRenderer.on('close', () => {
      window.electron.ipcRenderer.invoke('main-window-show')
    })
  }, [])

  React.useEffect(() => {
    setTimeout(checkForUpdate, 1500)
  }, [])

  if (!isWindowUpdated) {
    return <Loader />
  }

  return <Layout />
}

export default App
