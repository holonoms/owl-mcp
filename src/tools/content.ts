import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { OwlError } from "../owl-client.js";

export function owlErr(error: OwlError, context?: string): CallToolResult {
  const details = error.details.join(", ");
  let text = `Server responded with status ${error.status}\nDetails: ${details}`;
  if (context) {
    text = `${context}\n${text}`;
  }

  return {
    content: [{ type: "text", text }],
  };
}

export function err(error: unknown, context?: string): CallToolResult {
  if (error instanceof OwlError) {
    return owlErr(error, context);
  }

  let text = error instanceof Error ? error.message : String(error);
  if (context) {
    text = `${context}\n${text}`;
  }

  return {
    content: [{ type: "text", text }],
  };
}

export function text(message: string): CallToolResult {
  return {
    content: [{ type: "text", text: message }],
  };
}

export function texts(...messages: string[]): CallToolResult {
  return {
    content: messages.map((m) => ({ type: "text", text: m })),
  };
}
