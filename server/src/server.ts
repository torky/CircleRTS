import express, { Application } from "express";
import path from "path";
import * as http from "http";
import { Server } from "socket.io";

const app: Application = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static( path.join( __dirname, "public")));

app.get("/", (req, res) => {
    // res.sendFile(__dirname + "/index.html");
    res.render("index");
});

io.on("connection", (socket) => {
    console.log("a user connected");
    socket.broadcast.emit('hi');
    socket.on("disconnect", () => {
        console.log("user disconnected");
    });
    socket.on("chat message", (msg) => {
        console.log("message: " + msg);
        io.emit('chat message', msg);
    });
});

server.listen(8080, () => {
    console.log("listening on *:8080");
});

