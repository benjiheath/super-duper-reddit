import { Flex, Input, InputProps } from '@chakra-ui/react';
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form';
import { InputFieldType } from '../../types/general';
import AlertPop from '../resisterAndLogin/AlertPop';

interface Props extends InputProps {
  field: InputFieldType;
  register: UseFormRegister<FieldValues>;
  errors: DeepMap<FieldValues, FieldError>;
  renderSibling?: () => JSX.Element;
}

const InputField = (props: Props) => {
  const { field, register, errors, renderSibling } = props;
  return (
    <Flex alignItems='center'>
      <Input
        type={field.type}
        placeholder={field.placeholder}
        {...register(field.stateName, field.register)}
        focusBorderColor='prim.200'
        {...field.styleProps}
        autoComplete={field?.autoComplete}
      />
      {errors[field.stateName] && <AlertPop title={errors[field.stateName].message} mt={2} />}
      {renderSibling?.()}
    </Flex>
  );
};

export default InputField;
