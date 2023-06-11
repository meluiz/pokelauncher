import navigation from '@renderer/data/navigation'
import Trigger from './trigger'

const Triggers = function () {
  return (
    <ul className="space-y-4 h-full" role="list">
      {navigation.map(({ label, ...props }, idx) => (
        <Trigger key={`${label}-${idx}`} label={label} {...props} />
      ))}
    </ul>
  )
}

export default Triggers
