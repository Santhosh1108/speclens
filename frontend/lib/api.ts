const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://speclens-production.up.railway.app";

// Detailed error messages for different failure modes
async function handleResponse(response: Response, errorPrefix: string) {
  const text = await response.text();

  if (!response.ok) {
    let message = text;
    let detailedError = "";

    try {
      const data = JSON.parse(text);
      message = data.detail || data.message || text;
    } catch {
      // Use raw text if response isn't JSON
    }

    // Add context based on status code
    if (response.status === 0 || response.status === undefined) {
      detailedError = "Network error: Backend is not responding. Check your internet connection.";
    } else if (response.status === 404) {
      detailedError = `API endpoint not found. Backend URL might be incorrect: ${API_URL}`;
    } else if (response.status === 500) {
      detailedError = `Server error: ${message}. Backend may have crashed.`;
    } else if (response.status === 429) {
      detailedError = "Rate limited. Please wait a moment and try again.";
    } else if (response.status >= 400 && response.status < 500) {
      detailedError = `Client error: ${message}`;
    }

    const finalError = detailedError || `${errorPrefix}: ${message}`;
    throw new Error(finalError);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// Health check to verify backend is alive
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    return response.ok;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
}

export async function discover(
  message: string,
  productState: any = null
) {
  const response = await fetch(`${API_URL}/discover`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message,
      current_state: productState,
    }),
  });

  return handleResponse(response, "Discovery failed");
}

export async function generatePRD(product: any) {
  const response = await fetch(`${API_URL}/api/generate-prd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return handleResponse(response, "PRD generation failed");
}

export async function critiquePRD(product: any) {
  const response = await fetch(`${API_URL}/api/critique-prd`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return handleResponse(response, "PRD critique failed");
}

export async function generatePrototype(product: any) {
  const response = await fetch(`${API_URL}/api/generate-prototype`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  return handleResponse(response, "Prototype generation failed");
}

export async function exportPRDDocx(
  product: any,
  critique: any = null,
  includeCritique = true
) {
  const response = await fetch(`${API_URL}/api/export-prd-docx`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      product,
      critique,
      include_critique: includeCritique,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Word export failed: ${text}`);
  }

  return response.blob();
}
