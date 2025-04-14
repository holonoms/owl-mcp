import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

export function err(message: string): CallToolResult {
  return {
    content: [{ type: "text", text: message }],
  };
}

export function text(message: string): CallToolResult {
  return {
    content: [{ type: "text", text: message }],
  };
}
