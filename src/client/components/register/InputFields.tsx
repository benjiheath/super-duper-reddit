import React from 'react';
import { regEmailPattern } from '../../constants';
import { DeepMap, FieldError, FieldValues, UseFormRegister } from 'react-hook-form';
import InputField from '../generic/InputField';
import { InputFieldType } from '../../types/general';

const INPUTFIELDS: InputFieldType[] = [
  {
    type: 'text',
    placeholder: 'Username',
    stateName: 'username',
    register: {
      required: 'Please enter a username',
      minLength: { value: 4, message: 'Username must have at least 4 characters' },
      maxLength: { value: 20, message: 'Username must have less than 20 characters' },
      pattern: { value: /^[A-Za-z0-9]+$/i, message: 'Username can only include letters & numbers' },
    },
  },
  {
    type: 'text',
    placeholder: 'Email',
    stateName: 'email',
    register: {
      required: 'Please enter an email',
      pattern: { value: regEmailPattern, message: 'Please enter a valid email' },
    },
  },
  {
    type: 'password',
    placeholder: 'Password',
    stateName: 'password',
    register: {
      required: 'Please enter a password',
      minLength: { value: 4, message: 'Password must have at least 4 characters' },
    },
  },
];

interface Props {
  formMode: 'Register' | 'Login';
  register: UseFormRegister<FieldValues>;
  errors: DeepMap<FieldValues, FieldError>;
}

export const InputFields = ({ formMode, register, errors }: Props) => {
  const registerFields = INPUTFIELDS.map((field) => (
    <InputField field={field} register={register} errors={errors} key={field.stateName} />
  ));
  const loginFields = INPUTFIELDS.filter((field) => field.stateName !== 'email').map((field) => (
    <InputField field={field} register={register} errors={errors} key={field.stateName} />
  ));

  // register? show all 3 fields. login? only show username & password
  return <>{formMode === 'Register' ? registerFields : loginFields}</>;
};
