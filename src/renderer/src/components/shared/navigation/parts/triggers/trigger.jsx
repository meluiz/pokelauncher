import * as Tabs from '@radix-ui/react-tabs'
import PropTypes from 'prop-types'

const Trigger = function ({ label, href, children }) {
  if (typeof href !== 'undefined' && href !== null) {
    return (
      <li role="listitem">
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="w-11 h-11 flex center rounded-2xl hover:rounded-3xl bg-accents-5 text-xl text-accents-7 hover:text-sand-12 overflow-hidden cursor-pointer transition-all duration-200 ease-in-out"
          role="link"
        >
          {children}
        </a>
      </li>
    )
  }

  return (
    <Tabs.Trigger
      className="w-11 h-11 flex center rounded-2xl hover:rounded-3xl bg-accents-5 text-xl text-accents-7 hover:text-sand-12 overflow-hidden cursor-pointer transition-all duration-200 ease-in-out data-[state=active]:bg-orange-7 data-[state=active]:text-white"
      value={label}
      asChild
    >
      <li role="listitem">{children}</li>
    </Tabs.Trigger>
  )
}

export default Trigger

Trigger.propTypes = {
  label: PropTypes.string.isRequired,
  href: PropTypes.string,
  children: PropTypes.element.isRequired
}
