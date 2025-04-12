# How to run the Owl MCP server (typescript edition)

Keep in mind that this needs an API key. Get one of from Owl first. Then do this:

Build the project:

```bash
pnpm run build
```

Update your claude desktop configuration. Make sure the args point to the built file, and that Claude can run the node executable.

```json
{
  "mcpServers": {
    "owl": {
      "command": "node",
      "args": ["/Users/fred/code/holo/owl/mcp/build/index.js"]
    }
  }
}
```

Let Claude cook!
