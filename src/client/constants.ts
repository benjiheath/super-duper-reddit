import { InputFieldType } from './types/general';

// export const url = process.env.REACT_APP_ENV === 'dev' ? 'http://localhost:3001' : '??';
export const url = 'http://localhost:3000';

export const axiosOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
};

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
      // styleProps: {
      //   _hover: {
      //     borderColor: 'sec.400',
      //   },
      //   _focus: {
      //     boxShadow: '0px 0px 8px 2px #bcffe1b2',
      //     borderColor: 'sec.400',
      //   },
      // },
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
