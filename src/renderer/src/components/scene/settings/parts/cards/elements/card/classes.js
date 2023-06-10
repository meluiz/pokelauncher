import clsx from 'clsx'
import { twMerge as tw } from 'tailwind-merge'

export const classes = (user, name) =>
  tw(
    clsx(
      'w-full h-auto rounded-xl relative p-6 pb-0 bg-sand-3 cursor-pointer opacity-40 hover:opacity-100 group',
      'transition-all duration-200 ease-in-out overflow-hidden',
      'before:contents-[""] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-gradient-to-tr before:from-black/30 before:to-black/0',
      user?.name.toLowerCase() === name.toLowerCase() && `opacity-100`
    )
  )

export const textClasses = (user) =>
  tw(
    clsx(
      'text-sand-11 truncate',
      user?.name.toLowerCase() === name.toLowerCase() && 'text-white/50'
    )
  )
