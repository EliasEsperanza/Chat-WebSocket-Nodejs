import UsuarioSchema from "./models/Usuario.js";

export default(io)=>{
    io.on("connection", (socket) => {
        const emitUsers = async()=>{
            const usuarios = await UsuarioSchema.find();
            io.emit("users", usuarios);
        }
        emitUsers();
    });
}