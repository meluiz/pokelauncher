import React from 'react'
import { useAuthStore } from '../../../../stores'

import { ColorExtractor } from 'react-color-extractor'

const Avatar = function () {
  const { user } = useAuthStore()
  const [bgColor, updateBgColor] = React.useState('rgb(255 255 255 / 0.05)')

  const imageUrl = `https://minotar.net/armor/bust/${user ? user.name : 'undefined'}/80.png`

  const handleExtractionComplete = React.useCallback((colorPalette) => {
    const leastProminentColor = colorPalette[colorPalette.length - 1]
    updateBgColor(leastProminentColor)
  }, [])

  return (
    <button
      className="w-12 h-12 flex center shrink-0 grow-0 rounded-b-2xl rounded-t-md bg-white/5 overflow-hidden cursor-pointer group"
      style={{ background: bgColor }}
    >
      <ColorExtractor getColors={handleExtractionComplete}>
        <img
          src={imageUrl}
          className="w-full h-full object-cover object-center relative transition-all duration-200 ease-in-out"
          alt={`Avatar do ${user?.name}`}
          draggable={false}
        />
      </ColorExtractor>
    </button>
  )
}

export default Avatar
