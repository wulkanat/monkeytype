/**
 * Retrieve a random (summary) quote from Wikipedia
 *
 * @param {string} language the target language prefix (e.g. `en` for english)
 * @return {Promise<{title:string,quote: string,url:string,id:number}>} Quote
 */
export async function fetchRandomWikipediaQuote(language) {
  const result = await fetch(
    `https://${language}.wikipedia.org/api/rest_v1/page/random/summary`
  );
  /**
   * Type is incomplete
   *
   * @type {
   * {
   *  title: string,
   *  displaytitle: string,
   *  pageid: number,
   *  page: string,
   *  extract: string,
   * }}
   */
  const body = await result.json();

  return {
    title: body.displaytitle,
    quote: body.extract,
    url: body.page,
    id: body.pageid,
  };
}
