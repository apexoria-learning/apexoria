// Google Form request stub — every LeadForm submit spec MUST use this.
//
// The site posts directly to `REACT_APP_GF_ACTION_URL` (a Google Form
// `formResponse` endpoint) from the browser with `mode: 'no-cors'`. Hitting
// the real endpoint from a test pollutes the production Google Sheet, so
// we intercept the request, respond with a stubbed 200, and record the
// FormData payload for assertions.

/**
 * Install the Google Form route stub on a page.
 *
 * @param {import('@playwright/test').Page} page
 * @returns {{ requests: Array<{ url: string, fields: Record<string, string> }> }}
 *   A live-updated array of intercepted requests. Read after the submit.
 */
export function installGoogleFormStub(page) {
  const requests = [];

  page.route('**/formResponse*', async (route) => {
    const request = route.request();
    const postData = request.postData() || '';
    const fields = parseFormData(postData);

    requests.push({
      url: request.url(),
      method: request.method(),
      fields,
    });

    await route.fulfill({
      status: 200,
      contentType: 'text/html; charset=utf-8',
      body: '<html><body>OK</body></html>',
    });
  });

  return { requests };
}

/**
 * Parse a URL-encoded FormData body into a plain key/value map.
 * FormData submits from `fetch({ body: FormData })` arrive as
 * `multipart/form-data`, but Google Form's `mode: 'no-cors'` path
 * downgrades to `application/x-www-form-urlencoded`. Handle both.
 *
 * @param {string} postData
 * @returns {Record<string, string>}
 */
function parseFormData(postData) {
  const fields = {};
  if (!postData) return fields;

  // Multipart boundary detection.
  // NOTE: match exactly `--` (not `-{2,}`) so we capture the true boundary
  // token — a greedy `-{2,}` eats the leading dashes of the delimiter
  // and leaves `\r\n----` glued to every value. The boundary token itself
  // often starts with dashes (e.g. `----WebKitFormBoundaryXYZ`), so the
  // captured group must allow leading dashes too.
  const boundaryMatch = postData.match(/^--([^\r\n]+)\r?\n/);
  if (boundaryMatch) {
    const delimiter = `--${boundaryMatch[1]}`;
    const parts = postData.split(delimiter);
    for (const part of parts) {
      const nameMatch = part.match(/name="([^"]+)"\r?\n\r?\n([\s\S]*?)\r?\n?$/);
      if (nameMatch) fields[nameMatch[1]] = nameMatch[2].trim();
    }
    return fields;
  }

  // URL-encoded fallback
  for (const pair of postData.split('&')) {
    const [k, v = ''] = pair.split('=');
    if (!k) continue;
    fields[decodeURIComponent(k.replace(/\+/g, ' '))] =
      decodeURIComponent(v.replace(/\+/g, ' '));
  }
  return fields;
}
