import React from "react";

export const useDisclosure = function (initialValue?: boolean) {
  const [isOpen, setValue] = React.useState(initialValue || false);

  const onOpen = React.useCallback(() => setValue(true), []);
  const onClose = React.useCallback(() => setValue(false), []);
  const onToggle = React.useCallback(() => setValue(prev => !prev), []);

  return { isOpen, onOpen, onClose, onToggle };
};
