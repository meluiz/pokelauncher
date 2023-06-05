import React from 'react'

import * as Tabs from '@radix-ui/react-tabs'

import ArticleCard from '../../shared/article-card'
import { useDisclosure } from '@renderer/hooks'
import { PlayButton } from '../../shared'

import Dialog from './partials/dialog'

import ExampleOne from './articles/example-one.mdx'
import ExampleTwo from './articles/example-two.mdx'

export const Homepage = function () {
  const [article, updateArticle] = React.useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure(false)

  const handleOnClick = React.useCallback((article) => {
    updateArticle(article)
    onOpen()
  }, [])

  return (
    <Tabs.Content value="homepage">
      <Dialog isOpen={isOpen && article} article={article} onClose={onClose} />
      <div className="w-full h-36 flex flex-col justify-end relative bg-sand-3/30 border-b border-solid border-sand-4 z-10">
        <PlayButton />
      </div>
      <div className="w-full min-h-0 relative px-4 py-12">
        <div className="w-full min-h-0 flex flex-end relative py-10">
          <div className="w-full flex flex-col end-start px-16 space-y-20">
            <section className="w-full h-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
              <ArticleCard
                title="Hello World"
                href="/"
                description="lorem ipsum dolor sit"
                thumbnail="https://images.indianexpress.com/2022/07/Minecraft-splash-screen-technoblade-tribute.jpg"
                onClick={() => handleOnClick(<ExampleOne />)}
              />
              <ArticleCard
                title="Hello World"
                href="/"
                description="lorem ipsum dolor sit"
                thumbnail="https://images.indianexpress.com/2022/07/Minecraft-splash-screen-technoblade-tribute.jpg"
                onClick={() => handleOnClick(<ExampleTwo />)}
              />
            </section>
          </div>
        </div>
      </div>
    </Tabs.Content>
  )
}
