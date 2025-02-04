import app from "./app";

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});
