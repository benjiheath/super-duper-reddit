import { FormControl, FormLabel } from '@chakra-ui/react';
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form';
import { InputFieldType } from '../../types/general';
import InputField from '../generic/InputField';

interface Props {
  inputFields: InputFieldType[];
  formMode?: 'Register' | 'Login';
  register: UseFormRegister<FieldValues>;
  errors: DeepMap<FieldValues, FieldError>;
}

export const InputFields = (props: Props) => {
  const { inputFields, formMode, register, errors } = props;

  if (formMode) {
    const inputFieldsToRender = inputFields.filter((field) =>
      formMode === 'Register' ? field : field.stateName !== 'email'
    );

    return (
      <>
        {inputFieldsToRender.map((field) => (
          <InputField field={field} register={register} errors={errors} key={field.stateName} />
        ))}
      </>
    );
  }

  return (
    <>
      {inputFields.map((field) => (
        <FormControl key={field.stateName}>
          <FormLabel color='prim.800'>{field.labelTitle}</FormLabel>
          <InputField field={field} register={register} errors={errors} key={field.stateName} />
        </FormControl>
      ))}
    </>
  );
};
