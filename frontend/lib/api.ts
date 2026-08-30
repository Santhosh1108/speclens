const API_URL = "https://speclens-production.up.railway.app";

async function handleResponse(
  response: Response,
  errorPrefix: string
) {
  const text = await response.text();

  console.log(`${errorPrefix} STATUS:`, response.status);
  console.log(`${errorPrefix} RESPONSE:`, text);

  if (!response.ok) {
    throw new Error(
      `${errorPrefix} failed (${response.status}): ${text}`
    );
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      `${errorPrefix} returned invalid JSON: ${text}`
    );
  }
}


export async function discover(
  message: string,
  productState: any = null
) {
  const body = {
    message,
    product_state: productState,
  };

  console.log("DISCOVER REQUEST:", body);

  const response = await fetch(
    `${API_URL}/api/discover`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  return handleResponse(
    response,
    "Discovery"
  );
}


export async function generatePRD(
  productState: any
) {
  const response = await fetch(
    `${API_URL}/api/generate-prd`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productState),
    }
  );

  return handleResponse(
    response,
    "PRD generation"
  );
}


export async function critiquePRD(
  productState: any
) {
  const response = await fetch(
    `${API_URL}/api/critique-prd`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productState),
    }
  );

  return handleResponse(
    response,
    "PRD critique"
  );
}


export async function generatePrototype(
  productState: any
) {
  const response = await fetch(
    `${API_URL}/api/generate-prototype`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productState),
    }
  );

  return handleResponse(
    response,
    "Prototype generation"
  );
}


export async function exportPRDDocx(
  productState: any,
  includeCritique: boolean = true
) {
  const response = await fetch(
    `${API_URL}/api/export-prd-docx`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product: productState,
        include_critique: includeCritique,
      }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Word export failed (${response.status}): ${text}`
    );
  }

  const blob = await response.blob();

  const disposition = response.headers.get(
    "Content-Disposition"
  );
  const match = disposition?.match(
    /filename="?([^"]+)"?/
  );
  const filename = match?.[1] || "product-requirements.docx";

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
