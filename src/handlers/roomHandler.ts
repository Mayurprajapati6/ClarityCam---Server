import { Socket } from "socket.io";
import { v4 as UUIDv4 } from "uuid";

const roomHandler = (socket: Socket) => {

    const createRoom = () => {
        //this will be our unique room id which multiple connection will exchange data
        const roomId = UUIDv4();
        socket.join(roomId); // we will make the socket connection enter a new room
        socket.emit("room-create", { roomId }); // we will emit an event from server side that socket connection has been added to a room 
        console.log("Room created with id", roomId);
    };

    // The below funtion is executed everytime a user(creator or joinee) joings a new room
    const joinedRoom = ({ roomId, peerId }: { roomId: string, peerId: string }) => {
        
        console.log("New user has joined room", roomId, "with peer id as",peerId);
    };

    //when to call the above two function ?

    // we will call the above two function when the client will emit events to create room and join room
    socket.on("create-room", createRoom);
    socket.on("joined-room", joinedRoom);
};

export default roomHandler;
