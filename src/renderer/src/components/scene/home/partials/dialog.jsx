import PropTypes from 'prop-types'

import * as Scroll from '@radix-ui/react-scroll-area'

import { FiCornerUpLeft } from 'react-icons/fi'
import { MDXProvider } from '@mdx-js/react'

const Dialog = function ({ isOpen, article, onClose }) {
  if (!isOpen) {
    return null
  }

  return (
    <Scroll.Root>
      <Scroll.Viewport className="w-full h-screen absolute top-0 right-0 bottom-0 left-0 px-4 py-12 bg-accents-1 text-accents-10 z-50 overflow-auto">
        <div className="w-full flex justify-center relative py-14">
          <div className="w-full max-w-xl flex flex-col gap-10 items-start relative -translate-x-20  overflow-auto">
            <button
              type="button"
              className="flex center text-accents-8 hover:text-white text-sm space-x-4"
              onClick={onClose}
            >
              <FiCornerUpLeft className="-translate-y-0.5 text-base" />
              <span>Voltar</span>
            </button>
            {article ? (
              <article className="prose prose-accents-9 prose-headings:text-accents-10 prose-p:text-accents-9 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-accents-9 prose-li:text-accents-9 prose-li:py-0 prose-li:m y-0 prose:text-accents-9 relative">
                <MDXProvider>{article}</MDXProvider>
              </article>
            ) : null}
          </div>
        </div>
      </Scroll.Viewport>
      <Scroll.Scrollbar className="w-1 bg-transparent z-50" orientation="vertical">
        <Scroll.Thumb className="w-2 bg-sand-6" />
      </Scroll.Scrollbar>
      <Scroll.Corner className="ScrollAreaCorner" />
    </Scroll.Root>
  )
}

export default Dialog

Dialog.propTypes = {
  article: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
}
