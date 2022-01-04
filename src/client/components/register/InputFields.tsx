import { FormControl, FormLabel, VStack } from '@chakra-ui/react';
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
    const registerFields = inputFields.map((field) => (
      <InputField field={field} register={register} errors={errors} key={field.stateName} />
    ));
    const loginFields = inputFields
      .filter((field) => field.stateName !== 'email')
      .map((field) => <InputField field={field} register={register} errors={errors} key={field.stateName} />);

    // register? show all 3 fields. login? only show username & password
    return <>{formMode === 'Register' ? registerFields : loginFields}</>;
  }

  return (
    <>
      {inputFields.map((field) => (
        <FormControl>
          <FormLabel color='prim.800'>{field.labelTitle}</FormLabel>
          <InputField field={field} register={register} errors={errors} key={field.stateName} />
        </FormControl>
      ))}
    </>
  );
};
