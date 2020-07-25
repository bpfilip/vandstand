const fetch = require("node-fetch");

const express = require("express");
const cors = require("cors");
const app = express();

// app.use(cors());

app.use(express.static("public"))

app.get("/data", async (req, res) => {
	const dmiRes = await fetch("https://www.dmi.dk/fileadmin/user_upload/Bruger_upload/Tidevand/2020/Juelsminde.tmp.txt")
	const data = await dmiRes.text();
	res.send(data);
})

app.listen(8080)