# How to run the Owl MCP server

> [!IMPORTANT]
> This MCP server needs to be configured with an API key. Get one from Owl first.

1. Set the project to auto-build on changes:

   ```bash
   pnpm run dev
   ```

2. Update claude desktop configuration:

   ```json
   {
     "mcpServers": {
       "owl": {
         "command": "/path/to/node",
         "args": ["/path/to/owl-mcp/build/index.js"],
         "env": {
           "OWL_API_KEY": "your-api-key-here",
           "OWL_API_URL": "https://api.owl.cards"
         },
         "description": "Study with Owl using Claude"
       }
     }
   }
   ```

3. Let Claude cook!

## TODO

- Un/Archive card
- Un/Archive deck
- Delete card
- Delete deck
- Stats
