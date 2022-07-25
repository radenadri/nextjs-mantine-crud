export default (req, res) => {
  if (req.method === 'POST') {
    // get message
    const message = req.body;

    // dispatch to channel "message"
    res?.socket?.server?.io?.emit('add-new', message);

    // return message
    res.status(201).json(message);
  }
};
