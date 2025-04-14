export interface RequestOptions {
  method?: string;
  params?: Record<string, unknown>;
  headers?: Record<string, any>;
  body?: unknown;
}

export class OwlError extends Error {
  readonly status: number;
  readonly details: string[];

  constructor(status: number, details: string[]) {
    super(details.join(", "));
    this.name = "OwlError";
    this.status = status;
    this.details = details;
  }
}

export class OwlClient {
  constructor(
    private readonly apiKey: string,
    private readonly baseUrl: string
  ) {}

  async makeRequest<T>(
    uri: string,
    { method = "GET", params, headers, body }: RequestOptions = {}
  ): Promise<T> {
    headers = headers ?? {};
    headers["Content-Type"] = "application/json";
    headers["X-API-Key"] = this.apiKey;

    let url = `${this.baseUrl}${uri}`;
    if (params) {
      const query = Object.entries(params)
        .filter(([, value]) => value !== undefined)
        .map(
          ([k, v]) =>
            // String arrays will be serialized as `key=value1,value2`
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
        )
        .join("&");

      if (query) {
        url += `?${query}`;
      }
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      await throwErrorWithDetails(response);
    }

    const data = await response.json();
    return data as T;
  }
}

/**
 * Extracts error details from a failed HTTP response and throws exception.
 */
async function throwErrorWithDetails(response: Response): Promise<never> {
  const status = response.status;
  let errorDetails: string[] = [];

  // Try to parse the response as JSON
  try {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      // Extract errors array if it exists
      if (errorData && Array.isArray(errorData.errors)) {
        errorDetails = errorData.errors;
      } else {
        errorDetails = ["Unknown error"];
      }
    } else {
      // If not JSON, get the text
      const errorText = await response.text();
      errorDetails = [errorText];
    }
  } catch (parseError) {
    // If JSON parsing fails, get the text
    const errorText = await response.text();
    errorDetails = [errorText];
  }

  throw new OwlError(status, errorDetails);
}
