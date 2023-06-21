import PropTypes from "prop-types";

const ArticleCard = function ({ title, thumbnail, description, ...props }) {
  return (
    <button type="button" className="text-left" {...props}>
      <article className="w-full rounded-lg bg-sand-2 overflow-hidden">
        <figure className="w-full relative aspect-video bg-sand-1">
          <img
            className="w-full h-full relative object-cover object-center"
            src={thumbnail}
            alt={title}
            draggable={false}
          />
        </figure>
        <div className="w-full space-y-2 p-6">
          <h1 className="text-3xl font-bold text-sand-12">{title}</h1>
          <p className="text-sand-10 line-clamp-3 text-base">{description}</p>
        </div>
      </article>
    </button>
  );
};

export default ArticleCard;

ArticleCard.propTypes = {
  title: PropTypes.string.isRequired,
  thumbnail: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};
