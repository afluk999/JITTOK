# JITTOK admin setup and release checklist

The code now permits admin access only to **jittokofficial@gmail.com** with verified Firebase email ownership. The same check is in the application and `firestore.rules`. The application check alone does not secure Firestore: the rules must also be published.

## Before publishing

1. In Firebase Authentication for project `jittok-e6ab1`, confirm that the existing owner account uses exactly `jittokofficial@gmail.com`. Keep the password private. Sign in at `/admin`; if verification is needed, use **Send verification email**, complete the email link, then sign in again. Do not publish the rules until this account can authenticate with a verified email.
2. The app uses the named Firestore database **`default`**, not **`(default)`**. Select that database in Firebase Console. Save a copy of its existing rules before replacing them.
3. Inspect existing product documents. Every customer-visible product must explicitly have `status: "published"` or `status: "sold-out"`. Older documents without a status are excluded from the new public query. In the admin product list, select and publish only the products intended to be public; do not mass-publish unreviewed drafts. Review any document missing `createdAt` directly in Firebase Console, because the admin list sorts on that field.
4. Use the Rules Playground or an emulator to test the rule cases below. Local unit tests use mocked services; they do not prove deployed Firestore enforcement.
5. Deploy the updated website and publish `firestore.rules` together. In Firebase Console, use the Rules tab for database `default`, paste this repository's rules, and publish after checking the target. With an authenticated Firebase CLI, `firebase deploy --only firestore:rules --project jittok-e6ab1` uses the database mapping in `firebase.json`. Deploy **rules only**; this change does not require replacing any existing indexes.

## Rule cases to verify

| Caller and action | Expected result |
| --- | --- |
| Signed out: read a published or sold-out product | Allowed |
| Signed out: list products constrained to published/sold-out | Allowed |
| Signed out: read draft/archived product or list all products | Denied |
| Signed out: create/update/delete product or edit homepage | Denied |
| Another signed-in account: admin writes or order reads | Denied |
| Owner email with `email_verified: false`: admin access | Denied |
| Verified owner: product/homepage writes and order reads/updates | Allowed |
| Customer: create a valid new cart/product-page enquiry with server timestamps | Allowed |
| Customer: create enquiry with confirmed status, extra privileged fields, or inconsistent total | Denied |
| Customer: read, update, or delete an order | Denied |

After release, test storefront search, collection pages, product links, and cart enquiry creation while signed out. Test the owner login and a different test account separately. Use a staging database for mutation tests where possible.

## Using the new controls

- **`/admin/products`:** Select up to 200 products; apply a status or category; export the visible list; duplicate a product into a new draft. Clearing an optional field in the editor now removes its old saved value.
- **`/admin/orders`:** Save courier, tracking number/link, internal notes, and exchange/refund records. These are manual records of WhatsApp handling; marking a refund does not send money. Exports include these fields. A website enquiry is not evidence of payment.
- **`/admin/content`:** Set desktop/mobile hero images, optional headline, button text/destination, mobile promo image/destination, and section visibility. The existing banner control sets the desktop promo image. Preview changes before saving.
- **Scheduled hero:** Enter the time in India Standard Time. At that time the launch image, headline, and link replace the regular hero (open pages check approximately every 15 seconds). This does not schedule product publication. Mobile images fall back to desktop images when blank.

No Razorpay integration, AI try-on service, new inventory system, customer accounts, or upload-security changes were added. The existing upload endpoint remains outside this security change, as requested.

## Local checks

```powershell
node --test tests/approved-features.test.mjs
node node_modules/typescript/bin/tsc --noEmit --incremental false
npm run build
```

The tests cover owner authentication, sign-out races, public query restrictions, optional-field clearing, bulk update limits, safe draft duplication, launch boundaries, JSON-LD escaping, and spreadsheet export safety. A production build needs network access for the existing Google Fonts setup.
