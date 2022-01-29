import { extendTheme } from '@chakra-ui/react';

export const primaryColors = {
  25: '#fff9fc',
  50: '#fff0f7e1',
  100: '#FFE3F0',
  200: '#FFC6E0',
  300: '#FFB0D4',
  400: '#FF99C7',
  500: '#FF83BB',
  600: '#FF6BAE',
  700: '#FF509F',
  800: '#FF3D95',
  900: '#FF1780',
  btn: '',
};

export const theme = extendTheme({
  styles: {
    global: {
      'html, body': {
        color: 'gray.600',
        bg: 'gray.50',
      },
    },
  },
  colors: {
    pinkR: {
      100: '#B83280',
      els: '#fff',
    },
    prim: primaryColors,
    sec: {
      100: '#dbfff4',
      200: '#9cffe1',
      300: '#85ffda',
      400: '#70ffd4',
      500: '#4affc9',
      600: '#2effc1',
      700: '#17ffba',
      800: '#00ffb3',
      900: '#00e39f',
      950: '#00d696',
    },
    // sec: {
    //   100: '#E6F7FF',
    //   200: '#D1F0FF',
    //   300: '#B9E8FF',
    //   400: '#A3E1FF',
    //   500: '#87D8FF',
    //   600: '#72D1FF',
    //   700: '#5BC9FF',
    //   800: '#3CBFFF',
    //   900: '#1CB4FF',
    //   950: '#02ACFF',
    // },
  },
  components: {
    Input: {
      baseStyle: {
        transition: 'all 5s',
      },
    },
    Text: {
      baseStyle: {
        fontSize: '14px',
      },
    },
    Menu: {
      baseStyle: {
        bg: 'red.400',
        fontSize: '50px',
      },
    },
    MenuItem: {
      variants: {
        primary: {
          bg: 'red',
        },
      },
    },
    Button: {
      baseStyle: {
        _disabled: {
          bg: 'grey',
        },
      },
      variants: {
        primary: {
          bg: 'prim.800',
          border: '1px solid transparent',
          _hover: {
            bg: 'prim.100',
            _disabled: { bg: 'prim.800', color: 'white' },
            color: 'prim.900',
            border: '1px solid',
            borderColor: 'prim.900',
          },
        },
        secondary: {
          bg: 'sec.800',
          border: '1px solid transparent',
          color: 'white',

          _hover: {
            bg: 'sec.100',
            _disabled: { bg: 'sec.800' },
            color: 'sec.800',
            border: '1px solid',
            borderColor: 'sec.800',
          },
        },
        primInv: {
          bg: 'prim.800',
          _hover: {
            bg: 'sec.700',
            _disabled: { bg: 'sec.800' },
          },
        },
        secInv: {
          bg: 'sec.700',
          _hover: {
            bg: 'prim.500',
            _disabled: { bg: 'prim.500' },
          },
        },
        basicInv: {
          border: `1px solid ${primaryColors[600]}`,
          bg: 'white',
          color: 'prim.800',
          _hover: {
            bg: 'prim.100',
          },
        },
        basicHoverInv: {
          border: `1px solid transparent`,
          bg: 'white',
          color: 'prim.800',
          _hover: {
            bg: 'prim.50',
            border: `1px dotted ${primaryColors[600]}`,
          },
        },
      },
    },
  },
});
