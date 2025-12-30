import { memo } from "react";

const BlogCoverImage = memo(({ imageUrl, title }) => {
  if (!imageUrl) return null;

  return (
    <figure>
      <img
        src={imageUrl}
        alt={`Cover image for ${title}`}
        className="w-full h-64 md:h-96 object-cover rounded-lg"
        loading="lazy"
      />
    </figure>
  );
});

export default BlogCoverImage;
