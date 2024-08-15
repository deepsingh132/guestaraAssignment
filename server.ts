import app from "./src/app";

const PORT = process.env.PORT || 5000; // default port to listen

// start the Express server on the defined port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});