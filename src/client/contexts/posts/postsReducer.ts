type ACTIONTYPE = { type: 'SET_POSTS'; payload: any };

export const initState = {
  posts: null,
};

export const postsReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'SET_POSTS':
      return { ...state, posts: action.payload };

    default:
      throw new Error(`Unable to execute action: ${action}`);
  }
};
