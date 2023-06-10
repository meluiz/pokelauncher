import React from 'react'
import PropTypes from 'prop-types'

import { ColorExtractor } from 'react-color-extractor'

import { Cancel } from 'iconoir-react'
import { useAuthStore } from '../../../../../../../stores'
import { classes, textClasses } from './classes'

const uuidRegx = /([a-zA-Z0-9]{8})([a-zA-Z0-9]{4})([a-zA-Z0-9]{4})([a-zA-Z0-9]{4})([a-zA-Z0-9]{12})/

const Card = function ({ name, uuid, ...props }) {
  const { user, auth } = useAuthStore()
  const [bgColor, updateBgColor] = React.useState('rgb(255 255 255 / 0.05)')

  const imageUrl = `https://minotar.net/armor/bust/${name}/80.png`

  const handleSelect = React.useCallback(async () => {
    await auth.login({ name, uuid, ...props })
  }, [])

  const handleDeleteAccount = React.useCallback(async (e) => {
    e.stopPropagation()
    await auth.removeUpdateAccount({ name, uuid, ...props })
  }, [])

  const handleExtractionComplete = React.useCallback((colorPalette) => {
    const leastProminentColor = colorPalette[colorPalette.length - 1]
    updateBgColor(leastProminentColor)
  }, [])

  return (
    <div
      className={classes(user, name)}
      role="button"
      onClick={handleSelect}
      style={{
        background: user?.name.toLowerCase() === name.toLowerCase() ? bgColor : 'transparent'
      }}
    >
      <button
        className="absolute top-2 right-3 rounded-md bg-sand-1 text-sand-12 text-xs p-px hover:bg-sand-4"
        role="button"
        onClick={handleDeleteAccount}
      >
        <Cancel strokeWidth={2} />
      </button>
      <div className="flex center-start space-x-4 relative">
        <ColorExtractor getColors={handleExtractionComplete}>
          <img
            className="w-20 h-auto relative drop-shadow"
            src={imageUrl}
            alt={`Avatar do ${name}`}
            draggable={false}
          />
        </ColorExtractor>
        <div className="pb-4 overflow-hidden">
          <h3 className="text-lg text-sand-12 font-semibold">{name}</h3>
          <p className={textClasses(user)}>{uuid.replace(uuidRegx, '$1-$2-$3-$4-$5')}</p>
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
