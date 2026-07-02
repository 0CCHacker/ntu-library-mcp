/**
 * NTU Singapore Library — Ex Libris Primo public API config.
 *
 * These values were captured from real `pnxs` requests against NTU's OneSearch
 * (ntu-sp.primo.exlibrisgroup.com). They are institution codes, not secrets —
 * the `/primaws/rest/pub/*` tier is public and needs no API key or token.
 *
 * If NTU ever migrates its Primo view, re-capture these from DevTools:
 *   1. Open NTU OneSearch, F12 → Network tab
 *   2. Search any keyword, filter requests by `pnxs`
 *   3. Copy host, `vid`, `scope`, `tab` from the Request URL query string
 */
export const CONFIG = {
  PRIMO_HOST: "ntu-sp.primo.exlibrisgroup.com",
  INST: "65NTU_INST",
  VID: "65NTU_INST:65NTU_INST",
  // Default "Everything" search across NTU holdings + the Central Discovery Index.
  SCOPE: "NTUcampus_and_CI",
  TAB: "NTU_Everything",
  // Central Discovery Index only (publisher articles, richer abstracts/DOIs).
  CDI_SCOPE: "CentralIndex",
  CDI_TAB: "CentralIndex",
  LANG: "en",
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 25,
  // Be a good citizen against Primo's rate limits.
  REQUEST_TIMEOUT_MS: 15000,
} as const;

/** Human label for the library (used in output). */
export const LIBRARY_NAME = "NTU Singapore Library (OneSearch)";

/**
 * Canonical public host of the deployed Worker. Setup snippets on the site
 * always point here — regardless of whether the page is served locally, from a
 * preview, or from the Worker itself. Update this if you move to a custom domain.
 */
export const PUBLIC_HOST = "ntu-library.openskillshub.org";
