import { FormControl, FormLabel, Textarea, TextareaProps } from '@chakra-ui/react';
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form/dist/types';
import AlertPop from '../register/AlertPop';

interface Props extends TextareaProps {
  register: UseFormRegister<FieldValues>;
  errors: DeepMap<FieldValues, FieldError>;
  labelTitle?: string;
  minH?: number;
  placeholder?: string;
}

const FormTextArea = (props: Props) => {
  const { register, minH, placeholder, errors, labelTitle, ...rest } = props;

  return (
    <FormControl>
      <FormLabel color='prim.800'>{labelTitle}</FormLabel>
      <Textarea
        minH={minH ?? 150}
        _hover={{ borderColor: 'prim.300' }}
        placeholder={placeholder ?? 'Enter your text here...'}
        focusBorderColor='prim.300'
        {...register('body', {
          required: 'Body required',
        })}
        _focus={{ outline: '1px solid', outlineColor: 'prim.200', outlineOffset: 0 }}
        {...rest}
      />
      {errors.body && <AlertPop title={errors.body.message} mt={2} />}
    </FormControl>
  );
};

export default FormTextArea;
