import PropTypes from "prop-types";

import { useAuthStore } from "@renderer/stores";
import { AddCircle } from "iconoir-react";

const Button = function ({ onOpen }) {
  const { user } = useAuthStore();

  if (!user) {
    return null;
  }

  return (
    <button
      className="w-full h-16 flex center rounded-lg py-4 bg-[#FF6536] text-2xl text-white hover:opacity-90 active:opacity-80 active:scale-[0.99]  transition-all duration-200 ease-in-out"
      onClick={onOpen}
    >
      <AddCircle strokeWidth={2} />
    </button>
  );
};

Button.propTypes = {
  onOpen: PropTypes.func.isRequired
};

export default Button;
