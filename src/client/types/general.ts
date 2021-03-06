import { InputProps } from '@chakra-ui/react';
import { SetStateAction } from 'react';
import { FieldValues, UseFormReset } from 'react-hook-form';

export interface ProviderProps {
  children: React.ReactNode;
}

export type FormMode = 'Register' | 'Login';

export interface FormProps {
  formMode: 'Register' | 'Login';
  setFormMode: Dispatch<SetStateAction<FormMode>>;
  reset: UseFormReset<FieldValues>;
}

export interface RegisterProps {
  required: string;
  minLength: { value: number; message: string };
  maxLength: { value: number; message: string };
  pattern: { value: RegExp; message: string };
}

export interface InputFieldType {
  type: 'text' | 'password';
  placeholder: string;
  stateName: string;
  register: Partial<RegisterProps>;
  labelTitle?: string;
  styleProps?: InputProps;
  autoComplete?: string;
}

export type ComponentVariant = 'primary' | 'secondary';

export type Dispatch<T> = (value: T) => void;
