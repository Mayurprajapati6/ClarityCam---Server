import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import IRoomParms from "../interfaces/IRoomParams";

     // the below map stores for a room what all peers have joined
    /*
        * {1:[u1,u2,u3],2:[u4,u5,u6]}
    * */
    const rooms : Record<string,string[]> = {};

const roomHandler = (socket: Socket) => {


    const createRoom = () => {
        // this will be our unique room id which multiple connection will exchange data
        const roomId = UUIDv4();
        socket.join(roomId); // we will make the socket connection enter a new room

        rooms[roomId] = []; // create a new entry for the room
        socket.emit("room-create", { roomId }); // we will emit an event from server side that socket connection has been added to a room
        console.log("Room created with id", roomId);
    };

    // The below funtion is executed everytime a user(creator or joinee) joins a new room
    const joinedRoom = ({ roomId, peerId }: IRoomParms) => {
        console.log("joined room called",rooms, roomId, peerId);
        if(rooms[roomId]) {
            // If the give roomId exist in the in memory db
        }
        console.log("New user has joined room", roomId, "with peer id as", peerId);
        rooms[roomId].push(peerId); // the moment new user joins , add the peerId to the key of roomId
        console.log("added peer to room",rooms);
        socket.join(roomId); // make the user join the socket room

        // whenever anyone joins the room

        socket.on("ready", () => {
            // from the frontend one someone joins the room we will emit a ready event
            // then from our server we will emit an event to all the clients conn that a new peer had added
            socket.to(roomId).emit("user-joined",{peerId});
        })

        // below event is for loggin purpose
        socket.emit("get-users", {
            roomId,
            participants: rooms[roomId]
        });
    };

    // when to call the above two function ?

    // we will call the above two function when the client will emit events to create room and join room
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};

export default roomHandler;
