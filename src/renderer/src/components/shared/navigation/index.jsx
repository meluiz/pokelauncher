import * as Tabs from '@radix-ui/react-tabs'

import { SettingsIcon } from '../../icons'

import Avatar from './parts/avatar'
import Triggers from './parts/triggers'
import Trigger from './parts/triggers/trigger'

export const Navigation = function () {
  return (
    <Tabs.List
      className="w-20 h-full shrink-0 grow-0 block border-r border-solid border-accents-5 top-0 left-0 overflow-hidden z-50 bg-accents-1"
      aria-label="Manage your account"
    >
      <div className="w-full h-full flex flex-col relative px-4 py-6 overflow-hidden">
        <div className="w-full flex flex-col space-y-16 flex-1 relative">
          <Avatar />
          <Triggers />
          <ul className="space-y-4 shrink-0 grow-0" role="list">
            <Trigger label="settings">
              <SettingsIcon />
            </Trigger>
          </ul>
        </div>
      </div>
    </Tabs.List>
  )
}
