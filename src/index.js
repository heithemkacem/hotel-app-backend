const server = require("./server");
//server port
const port = process.env.PORT;
//starting the server
const startServer = () => {
  server.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
};
startServer();
