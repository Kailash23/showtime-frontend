import React from "react";
import { useWindowDimensions } from "react-native";

import { Button } from "@showtime-xyz/universal.button";
import { Text } from "@showtime-xyz/universal.text";
import { View } from "@showtime-xyz/universal.view";

import { useUser } from "app/hooks/use-user";
import { useNavigateToLogin } from "app/navigation/use-navigate-to";

import { breakpoints } from "design-system/theme";

type EmptyPlaceholderProps = {
  title?: string;
  text?: string;
  hideLoginBtn?: boolean;
  tw?: string;
};

const EmptyPlaceholder: React.FC<EmptyPlaceholderProps> = ({
  title = "",
  text = "",
  tw = "",
  hideLoginBtn,
}) => {
  const { isAuthenticated } = useUser();
  const { width } = useWindowDimensions();
  const isMdWidth = width >= breakpoints["md"];
  const navigateToLogin = useNavigateToLogin();

  return (
    <View tw={`items-center justify-center p-4 ${tw}`}>
      <Text tw="font-space-bold text-lg text-gray-900 dark:text-gray-100">
        {title}
      </Text>
      <View tw="h-4" />
      <Text tw="text-sm text-gray-600 dark:text-gray-400">{text}</Text>
      {!isAuthenticated && !hideLoginBtn && (
        <>
          <View tw="h-4" />
          <Button
            onPress={() => {
              navigateToLogin();
            }}
            variant="primary"
            size={isMdWidth ? "regular" : "small"}
            labelTW="font-semibold"
          >
            Sign&nbsp;In
          </Button>
        </>
      )}
    </View>
  );
};

export { EmptyPlaceholder };
