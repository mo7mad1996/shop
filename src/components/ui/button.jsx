import { AbsoluteCenter, Button as ChakraButton } from "@chakra-ui/react";
import * as React from "react";

import Loader from "@/components/Loader";

export const Button = React.forwardRef(function Button(props, ref) {
  const { loading, disabled, loadingText, children, ...rest } = props;
  return (
    <ChakraButton disabled={loading || disabled} ref={ref} {...rest}>
      {loading && !loadingText ? (
        <Loader />
      ) : loading && loadingText ? (
        <>
          <Loader />
          {loadingText}
        </>
      ) : (
        children
      )}
    </ChakraButton>
  );
});
