# GitHub Pages Publishing Design

## Objective

Publish the complete Summer School website from the public `LinxISA/SummerSchool` repository at:

`https://linxisa.github.io/SummerSchool/`

The published site must preserve the current local behavior:

- the course index opens both 28-slide sessions;
- `/session-1/1` through `/session-1/28` and `/session-2/1` through `/session-2/28` work when opened directly;
- all generated images, experiments, scripts, and Slidev assets load below the `/SummerSchool/` project-site prefix;
- the site makes no runtime request to a CDN or other external host;
- keyboard navigation and interactive teaching components continue to work.

## Selected Approach

Use a custom GitHub Actions workflow to build and deploy a GitHub Pages artifact from `main`.

This keeps generated `dist/` files out of Git history, makes the published site reproducible from repository sources, and uses GitHub's supported Pages actions:

- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

The workflow will also support manual dispatch for recovery and verification.

## Repository Visibility and Release Flow

The repository will be changed from private to public only after the Pages-aware local build and tests pass.

The release sequence is:

1. Implement and verify the Pages build on `feat/architecture-first-tutorial`.
2. Commit the complete course and deployment changes.
3. Push the feature branch and open a pull request to `main`.
4. Change `LinxISA/SummerSchool` to public, as explicitly approved.
5. Merge the pull request after required checks pass.
6. Enable GitHub Pages with `build_type=workflow` if it is not already configured.
7. Wait for the Pages deployment and verify the public URL and representative deep links.

The repository source and the generated website are both intentionally public after step 4.

## Build Architecture

### Base path

Local preview remains rooted at `/`, while GitHub Pages builds use `/SummerSchool/`.

The build receives a normalized environment variable:

`SUMMERSCHOOL_BASE_PATH=/SummerSchool`

The value is applied to:

- Session 1 Slidev base: `/SummerSchool/session-1/`
- Session 2 Slidev base: `/SummerSchool/session-2/`
- course-index links and local assets

An empty value preserves the current local addresses such as `/session-1/1`.

### Static deep routes

GitHub Pages does not run the Vite preview middleware used locally. The build therefore creates physical route entry files:

- `dist/session-1/1/index.html` through `dist/session-1/28/index.html`
- `dist/session-2/1/index.html` through `dist/session-2/28/index.html`

Each entry is the corresponding deck's generated Slidev HTML. Because deck assets use the configured absolute base, the copied entry can load the same compiled assets without duplication.

The build also writes `dist/.nojekyll` so GitHub Pages serves generated asset paths unchanged.

### Course index

`scripts/build-index.mjs` remains the source of the root landing page. It will normalize the configured base path and use it for:

- the hero image;
- Session 1 and Session 2 links;
- canonical project-relative navigation.

No hostname is hard-coded into the generated HTML.

## GitHub Actions Workflow

The workflow runs on pushes to `main` and through `workflow_dispatch`.

Build job:

1. Check out the repository.
2. Install the declared Node.js version with npm caching.
3. Run `npm ci`.
4. Run the relevant source, course, image, model, experiment, content, build, and offline gates.
5. Build with `SUMMERSCHOOL_BASE_PATH=/SummerSchool`.
6. Run Pages-specific artifact and route checks.
7. Upload `dist/` as the Pages artifact.

Deploy job:

1. Depend on the successful build job.
2. Use the `github-pages` environment.
3. Request only `pages: write` and `id-token: write` deployment permissions.
4. Deploy the uploaded artifact and expose the resulting URL.

Concurrent deployments use a single `pages` concurrency group without cancelling an in-progress deployment.

## Tests and Acceptance Gates

Pages-specific tests will prove:

- empty and `/SummerSchool` base paths normalize correctly;
- built deck HTML uses the expected project-site asset prefix;
- all 56 numbered route directories exist;
- root links point to `/SummerSchool/session-1/` and `/SummerSchool/session-2/` in a Pages build;
- no built text asset references localhost, a user absolute path, or a remote CDN;
- `.nojekyll` exists in the Pages artifact.

Existing tests remain authoritative for slide count, Keynote mapping, semantics, models, experiments, interactions, and offline behavior.

Before publishing, run locally:

1. the full test suite;
2. a Pages-prefix production build;
3. Pages artifact validation;
4. a static HTTP smoke test below `/SummerSchool/`.

After deployment, verify:

- `/SummerSchool/`;
- `/SummerSchool/session-1/1` and `/SummerSchool/session-1/28`;
- `/SummerSchool/session-2/1` and `/SummerSchool/session-2/28`;
- representative local images and experiment artifacts;
- keyboard navigation in a real browser.

The public URL is a hard delivery gate, not merely an expected output. Before reporting completion:

- `https://linxisa.github.io/SummerSchool/` must return HTTP 200 over HTTPS;
- its document title and visible heading must identify the Summer School course, rather than GitHub, an Actions artifact, or a generic 404 page;
- both course cards must resolve to the deployed Session 1 and Session 2 Slidev decks;
- representative first and last slide deep links in both decks must return Slidev HTML and render a visible slide;
- the final handoff link must be the verified live course URL, not the repository URL or workflow-run URL.

## Failure Handling and Rollback

- A failed build cannot reach the deploy job.
- A failed deployment leaves the last successful Pages artifact online.
- Workflow logs and the Pages deployment record provide the release evidence.
- Rollback is performed by reverting the offending source commit on `main`; the same workflow republishes the previous reproducible state.
- Repository visibility is not automatically changed during rollback. Making the repository private again is a separate explicit administrative action and would unpublish or restrict Pages according to the organization's GitHub plan.

## Non-goals

- No custom domain is configured.
- No runtime server, database, authentication layer, or external CDN is added.
- Generated `dist/` output is not committed to `main` or a `gh-pages` branch.
- The course content, 56-page structure, q_proj evidence, and visual design are not changed as part of publishing.
