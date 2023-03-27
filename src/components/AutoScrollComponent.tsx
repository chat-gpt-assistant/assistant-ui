import React, { useEffect, useRef } from 'react';
import { Box } from "@mui/material";

interface AutoScrollComponentProps {
  children: React.ReactNode;
}

const AutoScrollComponent: React.FC<AutoScrollComponentProps> = ({ children }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  return (
    <Box ref={scrollRef} style={{ overflowY: 'scroll' }}>
      {children}
    </Box>
  );
};

export default AutoScrollComponent;
