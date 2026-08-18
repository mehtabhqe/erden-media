# Domain verification notes

Source: https://vercel.com/mehtabalh-gmailcoms-projects/erden-media/settings/domains

Vercel initially showed only `www.eardenmedia.site` attached to the `erden-media` project with `Valid Configuration` and `Production` status. The apex `eardenmedia.site` was not listed. In the Add Domains dialog, I entered `eardenmedia.site`, kept the recommended `Redirect apex domains to www` option enabled, selected the Production environment, and submitted the domain. Vercel displayed `success: Domain added` and the new domain row showed `eardenmedia.site 308 www.eardenmedia.site Loading...`; the existing www row remained `Valid Configuration Production`.

Next verification: refresh the Vercel domain list, then request both `https://eardenmedia.site` and `https://www.eardenmedia.site` and confirm the apex returns a permanent redirect to www and www serves the EARDEN MEDIA site.
