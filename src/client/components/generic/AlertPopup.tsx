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
  title?: string;
  body?: string;
  isOpen: boolean;
  isWorking?: boolean;
  confirmBtnText?: string;
  cancelBtnText?: string;
  benign?: boolean;
  onConfirm: () => void;
  onClose?: () => void;
}

const AlertPopup = (props: Props) => {
  const { title, body, isOpen, isWorking, benign, confirmBtnText, cancelBtnText, onConfirm, onClose } = props;
  const cancelRef = React.useRef<any>();

  return (
    <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={() => onClose?.()}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>{body ?? "Are you sure? You can't undo this action afterwards."}</AlertDialogBody>
          <AlertDialogFooter>
            {!benign && (
              <Button ref={cancelRef} onClick={onClose}>
                {cancelBtnText ?? 'Cancel'}
              </Button>
            )}
            <Button variant='primary' color='white' onClick={onConfirm} ml={3} isLoading={isWorking}>
              {confirmBtnText ?? benign ? 'Ok' : 'Confirm'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertPopup;
