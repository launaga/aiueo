AIUEO — DOMAINESIA APPLICATION ROOT

Target subdomain: aiueo.mglwebkits.com
Application root: mglwebkits.com/demos/aiueo
Application startup file: server.js
Application mode: Production
Node.js: 20.9+ LTS (22 LTS is suitable when available)

This folder is a complete Next.js standalone runtime. It does not belong inside
the existing haloglory.com document root and must not overwrite public_html.

CPANEL SETUP
1. Create the subdomain aiueo.mglwebkits.com with document/application root /home/haloglor/mglwebkits.com/demos/aiueo.
2. Open Setup Node.js App and create a Production app for that subdomain.
3. Set Application root to the dedicated AIUEO folder.
4. Upload every item from this package into that Application root.
5. Configure environment variables in the Node.js App panel using env.example.
   Never upload real secret values in a file.
6. Set the startup file to server.js, then Start/Restart the app.
7. Enable AutoSSL/HTTPS for the subdomain.
8. Add https://aiueo.mglwebkits.com/auth/confirm to Supabase Auth redirect URLs
   before enabling real Admin authentication.

UPDATE / MIGRATION
- Build a fresh package with: npm run package:domainesia
- Stop the cPanel app, replace the dedicated application root, then restart.
- Back up environment variables separately because they are not in this package.
- The folder is self-contained and can be moved to another Node.js host.

ROLLBACK
- Keep the previous application-root folder as a timestamped sibling.
- Point the Node.js App back to that folder or restore it, then restart.
