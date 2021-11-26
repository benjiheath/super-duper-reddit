import { Heading, HStack, Stack, Stat, StatHelpText, StatLabel, Button } from '@chakra-ui/react';
import React, { useState } from 'react';

interface Props {
  Username: string;
  Password: string;
}

export default function UserData({ Username, Password }: Props) {
  const [showPW, setShowPW] = useState(false);

  return (
    <Stat mt={10}>
      <Heading my={2} as='h4' fontSize='20px' color='#B83280'>
        Congratulations!
      </Heading>
      <Heading my={2} as='h5' fontSize='16px'>
        Here are your details:
      </Heading>
      <Stack p={4} borderWidth='3px' borderRadius='md' direction='column' align='flex-start'>
        <HStack>
          <StatLabel>Username: {Username}</StatLabel>
        </HStack>
        <StatHelpText>
          Password:&nbsp;
          {showPW ? (
            Password
          ) : (
            <Button ml={3} fontSize='xs' height='22px' onClick={() => setShowPW(true)}>
              show
            </Button>
          )}
        </StatHelpText>
        {showPW && (
          <Button fontSize='xs' height='22px' onClick={() => setShowPW(false)}>
            hide
          </Button>
        )}
      </Stack>
    </Stat>
  );
}
