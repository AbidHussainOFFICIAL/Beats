/**
 * Chrome DevTools asks every dev server for this file on each page load. With
 * no route it hit the 404 page (and logged a warning) every time; answering
 * "nothing here" quietly keeps the dev log readable. It has no effect on the
 * site itself.
 */
export function GET() {
  return new Response(null, { status: 204 });
}