export async function submitEnquiry(payload) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 15000);

  let response;
  try {
    response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("The request timed out. Please check your connection and try again.");
    }
    throw new Error("I couldn't reach the studio just now. Please try again or email hello@jordanellis.studio.");
  } finally {
    window.clearTimeout(timeout);
  }

  let data = null;
  try {
    data = await response.json();
  } catch {
    // The response was not JSON. Fall through to a generic message.
  }

  if (!response.ok || !data?.ok) {
    const error = new Error(
      data?.error ?? "Something went wrong. Please try again or email hello@jordanellis.studio."
    );
    error.status = response.status;
    error.fields = data?.fields ?? {};
    throw error;
  }

  return data;
}
