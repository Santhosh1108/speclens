const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://speclens-production.up.railway.app";

async function handleResponse(response: Response, errorPrefix: string) {
  const text = await response.text();

  if (!response.ok) {
    let message = text;

    try {
      const data = JSON.parse(text);
      message = data.detail || data.message || text;
    } catch {
      // Use raw text if response isn't JSON
    }

    throw new Error(`${errorPrefix}: ${message}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
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
    throw new Error("Word export failed");
  }

  return response.blob();
}
