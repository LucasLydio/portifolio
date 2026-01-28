export function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

export function ok(data, message = "ok") {
  return json(200, { success: true, data, message });
}

export function badRequest(message = "bad request", details) {
  return json(400, { success: false, message, details });
}

export function serverError(message = "server error", details) {
  return json(500, { success: false, message, details });
}
