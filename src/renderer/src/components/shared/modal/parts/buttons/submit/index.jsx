import { CgChevronRight, CgSpinner } from "react-icons/cg";
import PropTypes from "prop-types";

export const SubmitButton = function ({ isDisabled, isLoading }) {
  return (
    <button
      type="submit"
      className="w-16 h-16 flex shrink-0 grow-0 center rounded-2xl font-bold bg-gradient-to-tr from-orange-6 to-[#FF6536] text-white text-3xl transition-all duration-200 active:scale-[.98] disabled:opacity-40"
      disabled={isDisabled}
    >
      {isLoading ? (
        <CgSpinner className="animate-spin" />
      ) : (
        <CgChevronRight className="-translate-x-0.5" />
      )}
    </button>
  );
};

SubmitButton.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired
};
