import express from "express";
import cors from "cors";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { registerTools } from "./tools.js";

const app = express();
app.use(cors());

// Initialize the MCP Server
const server = new McpServer({
    name: "DwellMint Studio MCP Server",
    version: "1.0.0",
});

// Register the tools
registerTools(server);

// Store active transports
let transport: SSEServerTransport | null = null;

// Route for establishing an SSE connection
app.get("/sse", async (req, res) => {
    transport = new SSEServerTransport("/messages", res);
    await server.connect(transport);
});

// Route for handling incoming messages from the client
app.post("/messages", express.json(), async (req, res) => {
    if (!transport) {
        res.status(400).send("No active SSE connection. Connect to /sse first.");
        return;
    }
    await transport.handlePostMessage(req, res);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DwellMint MCP Server running on port ${PORT}`);
});
