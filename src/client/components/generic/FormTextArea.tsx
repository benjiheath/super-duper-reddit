import { Textarea } from '@chakra-ui/react';
import React from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form/dist/types';

interface Props {
  register: UseFormRegister<FieldValues>;
  minH?: number;
}

const FormTextArea = (props: Props) => {
  const { register, minH } = props;

  return (
    <Textarea
      minH={minH ?? 150}
      borderColor='prim.100'
      _hover={{ borderColor: 'sec.400' }}
      placeholder='Enter your text here...'
      focusBorderColor='sec.300'
      {...register('body', {
        required: 'Body required',
      })}
      _focus={{ boxShadow: '1px 1px 10px 3px #bcffe1b2', borderColor: 'sec.400' }}
    />
  );
};

export default FormTextArea;
