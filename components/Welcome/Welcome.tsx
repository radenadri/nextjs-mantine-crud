import { Box, Title, Text, Anchor, Container } from '@mantine/core';
import useStyles from './Welcome.styles';

export function Welcome() {
  const { classes } = useStyles();

  return (
    <>
      <Box className={classes.container} py={80}>
        <Container>
          <Title className={classes.title} align="center">
            Next.js {' '} + {' '}
            <Text inherit component="span">
              Mantine
            </Text>
          </Title>
          <Text className={classes.text} align="center" size="lg" sx={{ maxWidth: 580 }} mx="auto" mt="xl">
            This starter Next.js project includes a minimal setup for server side rendering,
            if you want to learn more on Mantine + Next.js integration follow{' '}
            <Anchor href="https://mantine.dev/theming/next/" size="lg" color="violet">
              this guide
            </Anchor>
            . To get started edit index.tsx file.
          </Text>
        </Container>
      </Box>
    </>
  );
}
