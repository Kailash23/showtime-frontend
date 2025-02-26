import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  Alert as RNAlert,
  AlertButton,
  AlertStatic,
  Platform,
  Modal,
} from "react-native";

import { AnimatePresence, MotiView } from "moti";
import { RemoveScrollBar } from "react-remove-scroll-bar";

import { Divider } from "@showtime-xyz/universal.divider";
import { tw } from "@showtime-xyz/universal.tailwind";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { AlertOption } from "./alert-option";

type AlertContext = {
  alert: (...params: Parameters<AlertStatic["alert"]>) => void;
  /**
   * check out AlertProvider is installed
   */
  isMounted?: boolean;
};

// eslint-disable-next-line no-redeclare
export const AlertContext = createContext<AlertContext>({
  /**
   * use Alert.alert instead of Alert?.alert
   */
  alert: () => undefined,
  isMounted: false,
});

export const AlertProvider: React.FC<{ children: JSX.Element }> = ({
  children,
}) => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [buttons, setButtons] = useState<AlertButton[]>([]);
  const closeAlert = useCallback(() => {
    setShow(false);
  }, []);

  const value = useMemo(
    () => ({
      alert: (...params: Parameters<AlertStatic["alert"]>) => {
        setShow(true);
        setTitle(params[0]);
        params[1] && setMessage(params[1]);
        params[2] && setButtons(params[2]);
      },
      isMounted: true,
    }),
    []
  );
  const onModalDismiss = useCallback(() => {
    setTitle("");
    setMessage("");
    setButtons([]);
  }, []);

  const renderBtns = useMemo(() => {
    if (buttons?.length === 0) {
      return <AlertOption hide={closeAlert} />;
    }
    if (buttons?.length === 1) {
      return <AlertOption {...buttons[0]} hide={closeAlert} />;
    }
    if (buttons?.length === 2) {
      return (
        <View tw="flex-row items-center justify-between">
          {buttons.map((btn, i) => (
            <View key={`alert-option-${btn.text ?? i}`}>
              <AlertOption {...btn} hide={closeAlert} />
            </View>
          ))}
        </View>
      );
    }
    return buttons.map((btn, i) => (
      <View key={`alert-option-${btn.text ?? i}`} tw="mb-4 last:mb-0">
        <AlertOption {...btn} hide={closeAlert} />
      </View>
    ));
  }, [buttons, closeAlert]);

  return (
    <AlertContext.Provider value={value}>
      {children}
      <Modal
        animationType="none"
        transparent
        visible={show}
        onDismiss={onModalDismiss}
        statusBarTranslucent
      >
        {/* prevent scrolling/shaking when modal is open */}
        {Platform.OS === "web" && <RemoveScrollBar />}
        <AnimatePresence>
          <MotiView
            style={tw.style("h-full w-full bg-black bg-opacity-60 absolute")}
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "timing", duration: 120 }}
          />
          <View tw="h-full w-full items-center justify-center">
            <MotiView
              style={tw.style(
                "max-w-xs w-4/5 px-4 py-4 bg-white dark:bg-gray-900 shadow-2xl rounded-2xl"
              )}
              from={{ transform: [{ scale: 1.1 }], opacity: 0 }}
              animate={{ transform: [{ scale: 1 }], opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: "timing", duration: 250 }}
            >
              <Text tw="text-center text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </Text>
              {Boolean(message) && (
                <>
                  <View tw="h-4" />
                  <Text tw="text-center text-base text-gray-900 dark:text-white">
                    {message}
                  </Text>
                </>
              )}
              <Divider tw="my-4" />
              {renderBtns}
            </MotiView>
          </View>
        </AnimatePresence>
      </Modal>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const Alert = useContext(AlertContext);

  if (Platform.OS === "web") {
    if (!Alert.isMounted) {
      console.error("Trying to use useAlert without a AlertProvider");
    }
    return Alert;
  } else {
    return RNAlert;
  }
};

// If we need to use the same Alert style on the cross-platform, use this hooks.
export const useCustomAlert = () => {
  const Alert = useContext(AlertContext);
  if (!Alert.isMounted) {
    console.error("Trying to use useAlert without a AlertProvider");
  }
  return Alert;
};
