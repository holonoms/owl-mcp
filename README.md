# How to run the Owl MCP server (typescript edition)

Update your claude mcp configuration:

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

## TODO

- Grab env vars from .env file
