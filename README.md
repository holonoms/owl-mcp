# Owl MCP server

## Basic info

### What is Owl?

Owl is a spaced repetition application which helps people retain more information and generate more ideas. You can find out more and sign up at [owl.cards](https://owl.cards).

### What is Model Context Protocol?

Model Context Protocol (MCP) is an open protocol that allows you to provide custom tools to agentic LLMs (Large Language Models). Find out more at [modelcontextprotocol.io](https://modelcontextprotocol.io).

### What can I do with this MCP server?

By using this MCP server, you can integrate Owl with MCP clients like Claude Desktop, Cursor, etc. You can then have your language model act on your behalf, to do things like create decks and cards for you, etc. Here's an example:

## Getting started

> [!IMPORTANT]
> This MCP server needs to be configured with an API key. Get one from Owl first.

### Building Owl MCP

1. Check out the repository and install dependencies:

   ```bash
   git clone https://github.com/holonoms/owl-mcp.git
   cd owl-mcp
   pnpm install # You can also use npm or yarn
   ```

2. Set the project to auto-build on changes:

   ```bash
   pnpm run dev
   ```

### Configure your MCP client

#### Claude Desktop

Update claude desktop configuration:

```json
{
  "mcpServers": {
    "owl": {
      "command": "/path/to/node",
      "args": ["</path/to/owl-mcp>/build/index.js"],
      "env": {
        "OWL_API_KEY": "your-api-key-here",
        "OWL_API_URL": "https://api.owl.cards"
      },
      "description": "Study with Owl using Claude"
    }
  }
}
```

#### Cursor

- Open Cursor Settings
  - Navigate to Cursor Settings > MCP
  - Click the "+ Add new global MCP server" button
- Add the Owl MCP server to the list

```json
{
  "mcpServers": {
    "owl": {
      "command": "/path/to/node",
      "args": ["</path/to/owl-mcp>/build/index.js"],
      "env": {
        "OWL_API_KEY": "your-api-key-here",
        "OWL_API_URL": "https://api.owl.cards"
      },
      "description": "Study with Owl using Claude"
    }
  }
}
```

#### Other MCP clients

Other clients typically follow a similar setup and configuration structure. If you find a tool that requires different instructions, please let us know at team@owl.cards!
