import {
  Button,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialog,
} from '@chakra-ui/react';
import React from 'react';

interface Props {
  title: string;
  onClick: () => void;
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

const AlertPopup = (props: Props) => {
  const { title, onClick, isOpen, setIsOpen } = props;
  const onClose = () => setIsOpen(false);
  const cancelRef = React.useRef<any>();

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {title}
          </AlertDialogHeader>

          <AlertDialogBody>Are you sure? You can't undo this action afterwards.</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button variant='primary' color='white' onClick={onClick} ml={3}>
              Remove
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertPopup;
