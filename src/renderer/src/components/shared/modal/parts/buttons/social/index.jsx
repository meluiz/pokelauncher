import React from 'react'
import PropTypes from 'prop-types'

import { useAuthStore } from '../../../../../../stores'
import { BsWindows } from 'react-icons/bs'

export const SocialButton = function ({
  nickname,
  handleReset,
  isMicrosoftSending,
  updateMicrosoftSend
}) {
  const { auth } = useAuthStore()

  const handleMicrosoftLogin = React.useCallback(
    async (ev) => {
      ev.preventDefault()
      updateMicrosoftSend(true)

      const session = await window.electron.ipcRenderer.invoke('auth-microsoft', nickname)

      if (session === null || session.error) {
        return handleReset()
      }

      await auth.login(session)
      await auth.addUserToAccounts(session)

      handleReset()
    },
    [nickname]
  )

  return (
    <button
      className="w-full h-16 flex center rounded-xl relative bg-sand-5 hover:bg-sand-4 text-white text-xl font-bold transition-all duration-200 active:scale-[.98] disabled:opacity-40 overflow-hidden group"
      onClick={handleMicrosoftLogin}
      disabled={isMicrosoftSending}
    >
      <BsWindows className="relative" />
    </button>
  )
}

SocialButton.propTypes = {
  nickname: PropTypes.string.isRequired,
  handleReset: PropTypes.func.isRequired,
  isMicrosoftSending: PropTypes.bool.isRequired,
  updateMicrosoftSend: PropTypes.func.isRequired
}
