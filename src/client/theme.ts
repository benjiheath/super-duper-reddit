import { extendTheme } from '@chakra-ui/react';

export const primaryColors = {
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
      100: '#E3FFF2',
      200: '#C6FFE5',
      300: '#B0FFDB',
      400: '#99FFD1',
      500: '#83FFC7',
      600: '#6BFFBC',
      700: '#50FFAF',
      800: '#3DFFA7',
      900: '#00EC81',
      950: '#00CD70',
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
          border: '2px solid transparent',
          _hover: {
            bg: 'prim.100',
            _disabled: { bg: 'prim.800', color: 'white' },
            color: 'prim.900',
            border: '2px solid',
            borderColor: 'prim.900',
          },
        },
        secondary: {
          bg: 'sec.900',
          border: '1px solid transparent',
          color: 'white',

          _hover: {
            bg: 'sec.100',
            _disabled: { bg: 'sec.900' },
            color: 'sec.900',
            border: '1px dotted',
            borderColor: 'sec.900',
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
          border: `2px solid ${primaryColors[600]}`,
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
