import { Usuario } from "./models/Usuario.js";
import { Mensaje } from "./models/Mensaje.js";

export default (io) => {
    io.on("connection", (socket) => {
        console.log("Nuevo cliente conectado");

        const emitUsers = async () => {
            try {
                const usuarios = await Usuario.find();
                io.emit("users", usuarios);
            } catch (err) {
                console.error("Error al obtener los usuarios:", err);
            }
        };

        // Emitir la lista de usuarios cuando un cliente se conecta
        emitUsers();

        // Escuchar eventos para nuevos mensajes
        socket.on("mensaje", async (data) => {
            const { mensaje, usuarioId } = data;
            try {
                const nuevoMensaje = new Mensaje({
                    mensaje,
                    usuario: usuarioId
                });
                await nuevoMensaje.save();
                const mensajeConUsuario = await Mensaje.findById(nuevoMensaje._id).populate('usuario', 'nombre email');
                io.emit("mensaje", mensajeConUsuario);
            } catch (err) {
                console.error("Error al guardar el mensaje:", err);
            }
        });

        // Escuchar eventos para registrar nuevos usuarios
        socket.on("nuevoUsuario", async (data) => {
            const { nombre, email, password } = data;
            try {
                const nuevoUsuario = new Usuario({
                    nombre,
                    email,
                    password
                });
                await nuevoUsuario.save();
                emitUsers();  // Actualizar la lista de usuarios después de registrar un nuevo usuario
            } catch (err) {
                console.error("Error al registrar el usuario:", err);
            }
        });

        // Escuchar eventos para desconexión de clientes
        socket.on("disconnect", () => {
            console.log("Cliente desconectado");
        });
    });
};
