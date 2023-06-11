import React from 'react'

import { useToggle } from 'usehooks-ts'

import { motion } from 'framer-motion'
import { labelAnim } from './keyframes'
import { twMerge as tw } from 'tailwind-merge'
import clsx from 'clsx'

import PropTypes from 'prop-types'

const Input = function ({ nickname, isInvalid, updateNickname, updateInvalid }) {
  const [isFilled, , updateFilled] = useToggle()
  const [isFocused, , updateFocus] = useToggle()

  const handleOnChange = React.useCallback((e) => {
    const value = e.target.value

    const isInvalidLenght = value.length < 3 || value.length > 16
    const hasAcceptedChar = /[a-zA-Z0-9_]+/g.test(value)
    const hasInvalidChar = /[ `!@#$%^&*()+\-=[\]{};':"\\|,.<>/?~]+/g.test(value)

    updateInvalid(isInvalidLenght || !hasAcceptedChar || hasInvalidChar)
    updateFilled(value.length > 0)
    updateNickname(value)
  }, [])

  const handleOnFocus = React.useCallback(() => {
    updateFocus(true)
  }, [])

  const handleOnBlur = React.useCallback(() => {
    updateFilled(nickname.length > 0)
    updateFocus(false)
  }, [nickname])

  const classes = tw(
    clsx(
      'w-full h-16 shadow-[0_0_0_2px] shadow-sand-6 relative rounded-xl bg-accents-1/50 group',
      'transition-all duration ease-in-out',
      isInvalid && isFilled && 'shadow-red-6 shake'
    )
  )

  return (
    <label className={classes} data-focused={isFocused} data-filled={isFilled}>
      <motion.span
        className="absolute top-1/2 left-4 -translate-y-1/2 uppercase font-semibold pointer-events-none"
        variants={labelAnim}
        custom={[isFocused || isFilled, isInvalid && isFilled]}
        initial="initial"
        animate="animate"
      >
        Nickname
      </motion.span>
      <input
        className="w-full h-full bg-transparent px-4 pt-4 text-white"
        type="text"
        value={nickname}
        onChange={handleOnChange}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        spellCheck={false}
      />
    </label>
  )
}

export default Input

Input.propTypes = {
  nickname: PropTypes.string.isRequired,
  isInvalid: PropTypes.bool.isRequired,
  updateNickname: PropTypes.func.isRequired,
  updateInvalid: PropTypes.func.isRequired
}
