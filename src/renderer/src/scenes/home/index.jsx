import React from "react";

import * as Tabs from "@radix-ui/react-tabs";

import { useDisclosure } from "@renderer/hooks";

import Dialog from "./elements/dialog";

import ExampleThree from "./articles/example-three.mdx";
import { PlayButton } from "@renderer/components/layout";
import ArticleCard from "@renderer/components/layout/article-card";

export const Homepage = function () {
  const [article, updateArticle] = React.useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure(false);

  const handleOnClick = React.useCallback(article => {
    updateArticle(article);
    onOpen();
  }, []);

  return (
    <Tabs.Content className="tab-content relative" value="homepage" forceMount>
      <Dialog isOpen={isOpen && article} article={article} onClose={onClose} />
      <div style={{ display: isOpen ? "none" : "block" }}>
        <div className="w-full h-36 flex flex-col justify-end relative bg-sand-3/30 border-b border-solid border-sand-4 z-10">
          <PlayButton />
        </div>
        <div className="w-full min-h-0 relative px-4 py-12">
          <div className="w-full min-h-0 flex flex-end relative py-10">
            <div className="w-full flex flex-col end-start px-16 space-y-20">
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
                <ArticleCard
                  title="Title"
                  description="lorem ipsum dolor sit"
                  thumbnail="https://images.indianexpress.com/2022/07/Minecraft-splash-screen-technoblade-tribute.jpg"
                  onClick={() => handleOnClick(<ExampleThree />)}
                />
                <ArticleCard
                  title="Title"
                  description="lorem ipsum dolor sit"
                  thumbnail="https://images.indianexpress.com/2022/07/Minecraft-splash-screen-technoblade-tribute.jpg"
                  onClick={() => handleOnClick(<ExampleThree />)}
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    </Tabs.Content>
  );
};
