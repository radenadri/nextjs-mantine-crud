import { useEffect, useState } from 'react';
import { Modal, Button, Container, Table, Group, Stack, TextInput, NumberInput, Select, Text, Box } from '@mantine/core';
import { faker } from '@faker-js/faker';
import { useForm } from '@mantine/form';
import { io } from 'socket.io-client';
import { ColorSchemeToggle } from '../ColorSchemeToggle/ColorSchemeToggle';

interface GuestInterface {
  id: number,
  name: string,
  email: string,
  age: number,
  gender: string,
}

const Guest = () => {
  const [opened, setOpened] = useState<boolean>(false);
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const [guests, setGuests] = useState<Array<GuestInterface>>([]);
  const [online, setOnline] = useState<number>(0);
  const [onlineText, setOnlineText] = useState<string>('');

  const form = useForm({
    initialValues: {
      id: 0,
      name: '',
      email: '',
      age: null,
      gender: null,
    },
    validate: {
      name: (value) => (value.length <= 0 ? 'Name must be filled' : null),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email format'),
      age: (value) => (value ? (value < 17 ? 'You must be above 17 to proceed' : null) : 'You must fill the age'),
      gender: (value) => (value ? null : 'You must choose the gender'),
    },
  });

  const handleAdd = async () => {
    form.setValues({
      id: 0,
      name: '',
      email: '',
      age: null,
      gender: null,
    });

    form.clearErrors();

    await fetch('/api/add-new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify('New guest will be added'),
    });

    setOpened(true);
  };

  const handleEdit = (guestId : number) => {
    const selectedGuest = guests.find(guest => guest.id === guestId);

    const {id, name, email, age, gender } = selectedGuest;

    form.setValues({
      id,
      name,
      email,
      age,
      gender,
    });

    setIsUpdate(true);
    setOpened(true);
  };

  const handleSubmit = (val : GuestInterface) => {
    if (isUpdate) {
      const newGuests = [...guests];
      newGuests[val.id] = val;
      setGuests(newGuests);
    } else {
      setGuests(current => [
        ...current,
        {
          id: guests.length + 1,
          name: val.name,
          email: val.email,
          age: val.age,
          gender: val.gender,
        },
      ]);
    }

    setIsUpdate(false);
    setOpened(false);
  };

  const handleDelete = (id : number) => setGuests(current => current.filter(obj => obj.id !== id));

  const socketInitializer = async () => {
    await fetch('/api/socketio');
    const socket = io();

    socket.on('add-new', (message) => {
      console.log(message);
    });

    socket.on('visitor enters', data => setOnline(data));
    socket.on('visitor exits', data => setOnline(data));
  };

  useEffect(() => {
    // Create 10 guests
    const guestArray : Array<GuestInterface> = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < 2; i++) {
      guestArray.push({
        id: i,
        name: faker.name.findName(),
        email: faker.internet.email(),
        age: faker.mersenne.rand(55, 18),
        gender: faker.name.gender(true).toLowerCase(),
      });
    }
    setGuests(guestArray);

    socketInitializer();
  }, []);

  useEffect(() => {
    const peopleOnline = online - 1;

    if (peopleOnline < 1) {
      setOnlineText('No one else is online');
    } else {
      setOnlineText(peopleOnline > 1 ? `${online - 1} people are online` : `${online - 1} person is online`);
    }
  }, [online]);

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Enter your info!"
      >
        <Stack
          spacing="lg"
          sx={(theme) => ({
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          })}
        >
          <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
            <Group>
              <TextInput
                label="Name"
                placeholder="John Doe"
                {...form.getInputProps('name')}
              />
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  {...form.getInputProps('email')}
                />
            </Group>
            <NumberInput
              mt={12}
              placeholder="Your age"
              label="Your age"
              hideControls
              {...form.getInputProps('age')}
            />
            <Select
              mt={12}
              label="Gender"
              placeholder="Pick one"
              data={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Prefer not to say' },
              ]}
              {...form.getInputProps('gender')}
            />
            <Group position="right" mt="md">
              <Button type="submit">Submit</Button>
            </Group>
          </form>
        </Stack>
      </Modal>

      <Container size="lg" my={25}>
        <Group>
          <Button
            onClick={() => handleAdd()}
            sx={(theme) => ({
              backgroundColor: theme.colors.violet[5],
              '&:hover': {
                backgroundColor: theme.colors.violet[7],
              },
            })}
          >
            Add New
          </Button>
          <Text size="md">{onlineText}</Text>
          <Box
            ml="auto"
          >
            <ColorSchemeToggle />
          </Box>
        </Group>
        <Table
          highlightOnHover
          verticalSpacing="md"
          mt={20}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id}>
                <td>{guest.name}</td>
                <td>{guest.email}</td>
                <td>{guest.age}</td>
                <td>{guest.gender}</td>
                <td>
                  <Group>
                    <Button onClick={() => handleEdit(guest.id)}>
                      Edit
                    </Button>
                    <Button color="red" onClick={() => handleDelete(guest.id)}>
                      Delete
                    </Button>
                  </Group>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default Guest;
