import React from 'react'

import PropTypes from 'prop-types'

import Input from './parts/input'
import { useToggle, useUpdateEffect } from 'usehooks-ts'
import Header from './parts/header'
import Divider from './parts/divider'
import { SocialButton, SubmitButton } from './parts/buttons'
import { AnimatePresence } from 'framer-motion'
import { useAuthStore } from '../../../stores'
import { motion } from 'framer-motion'
import { generalAnim, modalAnim } from './keyframes'

let timing
export const Modal = function ({ show, onClose }) {
  const { auth } = useAuthStore()
  const [nickname, updateNickname] = React.useState('')
  const [isInvalid, , updateInvalid] = useToggle(true)

  const [isLoading, updateLoading] = React.useState(false)
  const [isMicrosoftSending, updateMicrosoftSend] = React.useState(false)

  const handleReset = React.useCallback(() => {
    updateLoading(false)
    updateMicrosoftSend(false)
    updateNickname('')
  }, [])

  useUpdateEffect(() => {
    if (!show) {
      handleReset()
    }
  }, [show])

  const handleLogin = React.useCallback(
    async (ev) => {
      ev.preventDefault()

      updateLoading(true)
      clearTimeout(timing)

      const session = await window.electron.ipcRenderer.invoke('auth-offline', nickname)

      if (session === null || session.error) {
        updateLoading(false)
        return
      }

      timing = setTimeout(async () => {
        clearTimeout(timing)

        await auth.login(session)
        await auth.addUserToAccounts(session)

        handleReset()

        if (onClose) {
          onClose()
        }
      }, 1500)
    },
    [nickname]
  )

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          className="w-screen h-screen flex center fixed top-0 right-0 bottom-0 left-0 bg-black/50 backdrop-blur-[4px] z-[100]"
          onClick={onClose}
          variants={generalAnim}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <motion.div
            className="w-full h-auto min-h-0 max-w-md flex flex-col center rounded-3xl shadow-2xl space-y-6 px-6 pt-10 pb-16 bg-sand-2"
            onClick={(e) => e.stopPropagation()}
            variants={modalAnim}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <Header />
            <div className="w-full max-w-xs flex flex-col space-y-6">
              <SocialButton
                nickname={nickname}
                handleReset={handleReset}
                isMicrosoftSending={isMicrosoftSending}
                updateMicrosoftSend={updateMicrosoftSend}
              />
              <Divider />
              <form className="flex center space-x-4" method="GET" onSubmit={handleLogin}>
                <Input
                  nickname={nickname}
                  isInvalid={isInvalid}
                  updateNickname={updateNickname}
                  updateInvalid={updateInvalid}
                />
                <SubmitButton
                  isLoading={isLoading}
                  isDisabled={isInvalid || isLoading || isMicrosoftSending}
                />
              </form>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

Modal.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func
}
