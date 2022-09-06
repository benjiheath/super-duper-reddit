import { InputFieldType } from './types/general';

export const apiUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://s-d-r-test.herokuapp.com/api'
    : `http://localhost:3000/api`;

export const regEmailPattern =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const regEmailPatternSl =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

type InputFieldsObject = {
  registerLoginForm: InputFieldType[];
  createPost: InputFieldType[];
};

export const inputFields: InputFieldsObject = {
  registerLoginForm: [
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
      autoComplete: 'username',
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
      autoComplete: 'current-password',
    },
  ],
  createPost: [
    {
      type: 'text',
      placeholder: 'Title',
      stateName: 'title',
      labelTitle: 'Title',
      register: {
        required: 'Title required',
      },
    },
    {
      type: 'text',
      placeholder: 'Add a link here (optional)',
      stateName: 'contentUrl',
      labelTitle: 'Url',
      register: {
        // pattern: anynull as
      },
    },
  ],
};
