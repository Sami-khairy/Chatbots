import { EndpointRequestInit as EndpointRequestInit_1 } from "@vaadin/hilla-frontend";
import client_1 from "./connect-client.default.js";
async function chat_1(question: string, init?: EndpointRequestInit_1): Promise<string> { return client_1.call("ChatAiService", "chat", { question }, init); }
async function rag_1(question: string, init?: EndpointRequestInit_1): Promise<string> { return client_1.call("ChatAiService", "rag", { question }, init); }
export { chat_1 as chat, rag_1 as rag };
