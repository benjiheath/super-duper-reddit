import { useDisclosure } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function HorizontalCollapse({ children, show }: { children: React.ReactNode; show: boolean }) {
  const { getDisclosureProps } = useDisclosure();

  const [hidden, setHidden] = useState(!show);

  return (
    <div>
      <motion.div
        {...getDisclosureProps()}
        hidden={hidden}
        initial={false}
        onAnimationStart={() => setHidden(false)}
        onAnimationComplete={() => setHidden(!show)}
        animate={{ width: show ? 160 : 0 }}
        style={{
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          position: 'absolute',
          right: '0',
          height: '20vh',
          top: 0,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
