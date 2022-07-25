import { createStyles } from '@mantine/core';

export default createStyles((theme) => ({
  container: {
    backgroundColor: theme.colors.violet[3],
  },
  title: {
    color: theme.colors.violet[7],
    fontSize: 100,
    fontWeight: 900,
    letterSpacing: -2,

    [theme.fn.smallerThan('md')]: {
      fontSize: 50,
    },
  },
  text: {
    color: theme.colorScheme === 'dark' ? theme.white : theme.colors.gray[9],
  },
}));
