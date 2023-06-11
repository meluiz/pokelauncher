export const labelAnim = {
  initial: {
    color: 'hsl(var(--sand12) / var(--tw-text-opacity))',
    opacity: 1,
    fontSize: '1em',
    top: '50%'
  },
  animate: ([isActive, isInvalid]) => ({
    color: isInvalid
      ? 'rgb(244 45 45 / var(--tw-text-opacity))'
      : 'hsl(var(--sand12) / var(--tw-text-opacity))',
    opacity: isActive && !isInvalid ? 0.8 : 1,
    fontSize: isActive ? '0.75em' : '1em',
    top: isActive ? '20px' : '50%'
  })
}
