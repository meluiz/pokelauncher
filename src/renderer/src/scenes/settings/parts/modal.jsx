import React from "react";

import PropTypes from "prop-types";

import { BsWindows } from "react-icons/bs";

import { useEffectOnce } from "usehooks-ts";
import { useAuthStore } from "../../../../stores";

import IconImage from "../../../../assets/static/icon.png";
import Loader from "./loader";
import { motion } from "framer-motion";
import { AnimatePresence } from "framer-motion";

let timing;
const Modal = function ({ isOpen, onClose }) {
  const { auth } = useAuthStore();
  const [username, updateUsername] = React.useState("");

  const [isLoading, updateLoading] = React.useState(false);
  const [isDisabled, updateDisabled] = React.useState(true);
  const [isMicrosoftSending, updateMicrosoftSend] = React.useState(false);

  function reset() {
    updateLoading(false);
    updateDisabled(true);
    updateMicrosoftSend(false);
    updateUsername("");
    onClose();
  }

  const addNewAccount = React.useCallback(
    async ev => {
      ev.preventDefault();

      updateLoading(true);
      clearTimeout(timing);

      const session = await window.electron.ipcRenderer.invoke(
        "auth-offline",
        username
      );

      if (session === null || session.error) {
        updateLoading(false);
        return;
      }

      timing = setTimeout(async () => {
        clearTimeout(timing);

        await auth.login(session);
        await auth.addUserToAccounts(session);
        reset();
      }, 1200);
    },
    [username]
  );

  const addNewMicrosoftAccount = React.useCallback(
    async ev => {
      ev.preventDefault();
      updateMicrosoftSend(true);

      const session = await window.electron.ipcRenderer.invoke(
        "auth-microsoft",
        username
      );

      if (session === null || session.error) {
        return reset();
      }

      await auth.login(session);
      await auth.addUserToAccounts(session);

      reset();
    },
    [username]
  );

  const handleOnChange = React.useCallback(function (e) {
    const value = e.target.value;

    const isInvalidLenght = value.length < 3 || value.length > 16;
    const hasAcceptedChar = /[a-zA-Z0-9_]+/g.test(value);
    const hasInvalidChar = /[ `!@#$%^&*()+\-=[\]{};':"\\|,.<>/?~]+/g.test(
      value
    );

    updateUsername(value);
    updateDisabled(isInvalidLenght || !hasAcceptedChar || hasInvalidChar);
  }, []);

  useEffectOnce(() => {
    document.addEventListener("keydown", ev => {
      if (ev.key === "Escape") {
        onClose();
      }
    });

    return () => {
      document.addEventListener("keydown", ev => {
        if (ev.key === "Escape") {
          onClose();
        }
      });
    };
  });

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          className="w-screen h-screen flex center fixed top-0 right-0 bottom-0 left-0 bg-black/50 backdrop-blur-[2px] z-[100]"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full h-auto min-h-0 flex flex-col center space-y-6 p-6 max-w-md rounded-md bg-sand-2"
            onClick={e => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.75 }}
          >
            <div className="flex flex-col center space-y-6">
              <div className="w-20 h-20 flex center rounded-full bg-orange-10/5 border border-solid border-white/5 overflow-hidden">
                <figure className="translate-y-1">
                  <img
                    className="w-14 animate-bounce"
                    src={IconImage}
                    alt="Logo"
                  />
                </figure>
              </div>
              <h3 className="font-bold text-xl text-center uppercase">
                Nova conta com
              </h3>
            </div>
            <div className="w-full max-w-xs flex flex-col space-y-4">
              <button
                type="button"
                className="w-full h-14 flex center rounded-xl font-bold bg-sand-1 hover:bg-white/5 transition-all duration-200 active:scale-[.98] disabled:opacity-40"
                onClick={addNewMicrosoftAccount}
                disabled={isMicrosoftSending}
              >
                <BsWindows />
              </button>
              <div className="w-full flex center relative before:contents-[''] before:w-full before:h-px before:absolute before:top-1/2 before:-translate-y-1/2 before:bg-sand-6">
                <span className="flex px-2 text-white bg-sand-2 z-10">ou</span>
              </div>
              <form
                className="flex flex-col space-y-3"
                method="GET"
                onSubmit={addNewAccount}
              >
                <input
                  type="text"
                  placeholder="Steve"
                  value={username}
                  onChange={handleOnChange}
                  className="w-full h-12 rounded-xl py-2 px-4 bg-sand-1 border-2 border-solid border-sand-4 focus:outline-none text-white placeholder:text-sand-11 disabled:opacity-40"
                  readOnly={isLoading || isMicrosoftSending}
                  disabled={isLoading || isMicrosoftSending}
                />
                <button
                  type="submit"
                  className="w-full h-14 flex center rounded-xl font-bold bg-red-8 hover:bg-red-7 transition-all duration-200 active:scale-[.98] disabled:opacity-40"
                  disabled={isDisabled || isLoading || isMicrosoftSending}
                >
                  {isLoading ? <Loader /> : "Entrar"}
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

export default Modal;
