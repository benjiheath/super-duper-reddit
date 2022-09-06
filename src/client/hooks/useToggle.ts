import React from 'react';

export const useToggle = () => React.useReducer((prev) => !prev, false);
