import { extendTheme } from '@chakra-ui/react'

export const chakraTheme = extendTheme({
  components: {
    Button: {
      variants: {
        primary: {
          background: '#001662',
          color: '#FFFFFF',
          fontSize: '1.1rem',
          _hover: {
            shadow: 'lg',
            opacity: '0.8',
          },
          _active: {
            transform: 'scale(0.95)',
          },
          _disabled: {
            background: '#001662 !important',
            opacity: '0.6 !important',
          },
        },
      },
    },
  },
})
