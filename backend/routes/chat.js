const Router = require("express")
const router= Router()

const setupChatRoutes = (io) => {
    const MessageArray = [];

    router.post('/message', (req, res) => {
        const { message, time, senderId, roomId, receiverId } = req.body;
        const messageObj = { message, time, senderId, roomId };

        // Save message to array (in memory, ideally this should be a database)
        MessageArray.push(messageObj);

        // Emit the message to the specific receiver
        io.to(receiverId).emit('message', messageObj);

        res.status(200).json({ message: "Message sent" });
    });

    return router;
};

module.exports = setupChatRoutes;
