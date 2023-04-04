import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowDownward } from "@mui/icons-material";

interface AutoScrollComponentProps {
  children: React.ReactNode;
}

const AutoScrollComponent: React.FC<AutoScrollComponentProps> = ({children}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  const scrollHandler = () => {
    if (!scrollRef.current) {
      return;
    }

    const {scrollTop, scrollHeight, clientHeight} = scrollRef.current;
    const isAtBottom = scrollTop + clientHeight === scrollHeight;

    setAutoScroll(isAtBottom);
  };

  const scrollToBottom = () => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", scrollHandler);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", scrollHandler);
      }
    };
  }, []);

  useEffect(() => {
    if (autoScroll) {
      scrollToBottom();
    }
  }, [children, autoScroll]);

  return (
    <>
      <Box ref={scrollRef} style={{overflowY: 'scroll'}}>
        {children}
      </Box>
      {!autoScroll && (
        <IconButton
          onClick={scrollToBottom}
          size="small"
          sx={{
            position: "fixed",
            right: 10,
            bottom: 150,
          }}
        >
          <ArrowDownward/>
        </IconButton>
      )}
    </>
  );
};

export default AutoScrollComponent;
