export class OwlClient {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string
  ) {}

  async makeRequest<T>(
    uri: string,
    method: string = "GET",
    body?: unknown
  ): Promise<T | null> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-API-Key": this.apiKey,
    };

    const url = `${this.baseUrl}${uri}`;

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(
        `Error making request to the Owl API: ${method} ${uri}`,
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }
}
