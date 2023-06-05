import React from 'react'

import Icon from '../icon'

export const HomeIcon = React.forwardRef((props, ref) => {
  return (
    <Icon ref={ref} viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_324_190)">
        <path
          d="M25.4801 5.5C26.2401 5.5 27.0001 5.79 27.5701 6.38L45.2501 24.49C46.7601 26.04 45.6801 28.65 43.5101 28.67H41.7901V42.6C41.7901 44.22 40.4801 45.53 38.8601 45.53H31.3001C30.2201 45.53 29.3501 44.66 29.3501 43.58V34.48C29.3501 33.32 28.4101 32.38 27.2501 32.38H23.6801C22.5201 32.38 21.5801 33.32 21.5801 34.48V43.58C21.5801 44.66 20.7101 45.53 19.6301 45.53H12.0701C10.4501 45.53 9.14007 44.22 9.14007 42.6V28.68H7.42007C5.25007 28.65 4.17007 26.04 5.68007 24.49L23.3801 6.38C23.9501 5.79 24.7101 5.5 25.4701 5.5M25.4701 0.5C23.3201 0.5 21.3001 1.35 19.8001 2.89L2.12007 21C0.0300689 23.15 -0.579931 26.32 0.570069 29.08C1.28007 30.79 2.57007 32.13 4.16007 32.91V42.61C4.16007 46.98 7.72007 50.54 12.0901 50.54H19.6501C22.0901 50.54 24.2401 49.28 25.4801 47.37C26.7201 49.28 28.8701 50.54 31.3101 50.54H38.8701C43.2401 50.54 46.8001 46.98 46.8001 42.61V32.91C48.3901 32.13 49.6801 30.79 50.3901 29.08C51.5401 26.32 50.9301 23.15 48.8401 21L31.1501 2.89C29.6501 1.35 27.6301 0.5 25.4801 0.5H25.4701Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_324_190">
          <rect width="50.96" height="50.03" fill="currentColor" transform="translate(0 0.5)" />
        </clipPath>
      </defs>
    </Icon>
  )
})

HomeIcon.displayName = 'HomeIcon'
