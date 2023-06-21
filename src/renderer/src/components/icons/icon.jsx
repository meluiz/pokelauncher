import React from "react";

const Icon = React.forwardRef((props, ref) => {
  return (
    <svg
      ref={ref}
      className="w-[1em] h-[1em] inline-block vertical-center shrink-0 leading-4 text-current"
      {...props}
    />
  );
});

export default Icon;

Icon.displayName = "Icon";
