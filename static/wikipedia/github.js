const maxFetches = 1;

/**
 * Retrieve a random (summary) quote from Wikipedia
 *
 * @param {string} language the target language prefix (e.g. `en` for english)
 * @return {Promise<{
 *   title:string,
 *   quote: string,
 *   url:string,id:string
 * } | null>} Quote
 */
export async function fetchRandomGist(language) {
  // prevent infinite loop
  for (let i = 0; i < maxFetches; i++) {
    const result = await fetch("https://api.github.com/gists/public", {
      headers: {
        // "Access-Control-Allow-Headers": "accept, per_page, page",
        "Content-Type": "application/json",
        // "Accept": "application/vnd.github.v3+json",
        // "Per_Page": "20",
        // "Page": Math.round(Math.random() * 1000).toString()
      },
    });

    /**
     * Type is incomplete
     * https://docs.github.com/en/rest/reference/gists#list-public-gists
     *
     * @type {
     * Array<{
     *  url: string,
     *  id: string,
     *  description: string,
     *  files: Record<string, {
     *      filename: string,
     *      type: string,
     *      language: string,
     *      raw_url: string,
     *      size: string,
     *    }>,
     * }>}
     */
    const body = await result.json();

    for (const gist of body) {
      for (const fileKey in gist.files) {
        if (!gist.files.hasOwnProperty(fileKey)) continue;

        /**
         * Type is incomplete
         *
         * @type {{
         *   filename: string,
         *   type: string,
         *   language: string,
         *   raw_url: string,
         *   size: string,
         * }}
         */
        const fileMeta = gist.files[fileKey];
        if (fileMeta.language === language) {
          const file = await fetch(fileMeta.raw_url);

          return {
            id: gist.id,
            quote: await file.text(),
            title: gist.description,
            url: fileMeta.raw_url,
          };
        }
      }
    }
  }

  // no matching gist found
  return null;
}
