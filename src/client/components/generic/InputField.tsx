import { Input } from '@chakra-ui/react';
import React from 'react';
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form';
import { InputFieldType } from '../../types/general';
import AlertPop from '../register/AlertPop';

interface Props {
  field: InputFieldType;
  register: UseFormRegister<FieldValues>;
  errors: DeepMap<FieldValues, FieldError>;
}

const InputField = ({ field, errors, register }: Props) => {
  return (
    <>
      <Input
        type={field.type}
        placeholder={field.placeholder}
        {...register(field.stateName, field.register)}
        focusBorderColor='prim.200'
      />
      {errors[field.stateName] && <AlertPop title={errors[field.stateName].message} />}
    </>
  );
};

export default InputField;
