import React from 'react'
import PropTypes from 'prop-types'

import clsx from 'clsx'
import { twMerge as tw } from 'tailwind-merge'
import { Cancel } from 'iconoir-react'
import { useAuthStore } from '../../../../../stores'

const uuidRegx = /([a-zA-Z0-9]{8})([a-zA-Z0-9]{4})([a-zA-Z0-9]{4})([a-zA-Z0-9]{4})([a-zA-Z0-9]{12})/

const Card = function ({ name, uuid, ...props }) {
  const { user, auth } = useAuthStore()

  const handleSelect = React.useCallback(async () => {
    await auth.login({ name, uuid, ...props })
  }, [])

  const handleDeleteAccount = React.useCallback(async (e) => {
    e.stopPropagation()
    await auth.removeUpdateAccount({ name, uuid, ...props })
  }, [])

  const classes = tw(
    clsx(
      'w-full h-auto rounded-xl relative p-6 pb-0 bg-sand-3 cursor-pointer opacity-40 hover:opacity-100 group',
      'transition-all duration-200 ease-in-out overflow-hidden',
      'before:contents-[""] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-gradient-to-tr before:from-black/30 before:to-black/0',
      user?.name.toLowerCase() === name.toLowerCase() && 'bg-rose-500 opacity-100'
    )
  )

  const textClasses = tw(
    clsx(
      'text-sand-11 truncate',
      user?.name.toLowerCase() === name.toLowerCase() && 'text-rose-300'
    )
  )

  return (
    <div className={classes} role="button" onClick={handleSelect}>
      <button
        className="absolute top-2 right-3 rounded-md bg-sand-1 text-sand-12 text-xs p-px hover:bg-sand-4"
        role="button"
        onClick={handleDeleteAccount}
      >
        <Cancel strokeWidth={2} />
      </button>
      <div className="flex center-start space-x-4 relative">
        <img
          className="w-20 h-auto relative drop-shadow"
          src={`https://minotar.net/bust/${name}/80.png`}
          alt={`Avatar do ${name}`}
          draggable={false}
        />
        <div className="pb-4 overflow-hidden">
          <h3 className="text-lg text-sand-12 font-semibold">{name}</h3>
          <p className={textClasses}>{uuid.replace(uuidRegx, '$1-$2-$3-$4-$5')}</p>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  name: PropTypes.string.isRequired,
  uuid: PropTypes.string.isRequired
}

export default Card
