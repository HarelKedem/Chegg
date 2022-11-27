const http = require("http");

http.get(
  {
    port: process.env.PORT || 8626,
    hostname: "localhost",
    path: "/api/people",
    headers: {},
  },
  (res) => {
    console.log("connected");
    res.on("data", (chunk) => {
      console.log("chunk", "" + chunk);
    });
    res.on("end", () => {
      console.log("No more data");
    });
    res.on("close", () => {
      console.log("Closing connection");
    });
  }
);