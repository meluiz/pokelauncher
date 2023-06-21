import PropTypes from "prop-types";

import { FiCornerUpLeft } from "react-icons/fi";
import { MDXProvider } from "@mdx-js/react";

const Dialog = function ({ isOpen, article, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="w-full min-h-0 relative px-4 py-12">
      <div className="w-full min-h-0 flex flex-end relative py-10">
        <div className="w-full flex flex-col start px-16 space-y-20">
          <button
            type="button"
            className="flex center text-accents-8 hover:text-white text-sm space-x-4"
            onClick={onClose}
          >
            <FiCornerUpLeft className="-translate-y-0.5 text-base" />
            <span>Voltar</span>
          </button>
          {article ? (
            <article className="w-full prose prose-accents-9 prose-headings:text-accents-10 prose-p:text-accents-9 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-accents-9 prose-li:text-accents-9 prose-li:py-0 prose-li:m y-0 prose:text-accents-9 relative">
              <MDXProvider>{article}</MDXProvider>
            </article>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Dialog;

Dialog.propTypes = {
  article: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
