<h1 align="center">Next.js Notes</h1>

- [Setup:](#setup)
- [Introduction:](#introduction)
    - [What is Next.js:](#what-is-nextjs)
    - [Key Features of Next.js:](#key-features-of-nextjs)
    - [Components in Next.js:](#components-in-nextjs)
    - [Next.js Renderings:](#nextjs-renderings)
      - [1. Client Side Rendering(CSR):](#1-client-side-renderingcsr)
        - [LifeCycle of CSR:](#lifecycle-of-csr)
        - [Problems with CSR:](#problems-with-csr)
        - [When to use CSR:](#when-to-use-csr)
      - [2. Server Side Rendering(SSR):](#2-server-side-renderingssr)
        - [LifeCycle of SSR:](#lifecycle-of-ssr)
        - [Problems with SSR:](#problems-with-ssr)
        - [When to use SSR:](#when-to-use-ssr)
      - [3. Static Site Generation(SSG):](#3-static-site-generationssg)
        - [LifeCycle of SSG:](#lifecycle-of-ssg)
        - [Problems with SSG:](#problems-with-ssg)
        - [When to use SSG:](#when-to-use-ssg)
      - [4. Incremental Static Regeneration(ISR):](#4-incremental-static-regenerationisr)
      - [When to use ISR:](#when-to-use-isr)
    - [Difference Between CSR, SSR, SSG, ISR:](#difference-between-csr-ssr-ssg-isr)
    - [Difference Between Library and Framework:](#difference-between-library-and-framework)
    - [Difference Between React and Next.js:](#difference-between-react-and-nextjs)
- [Folder and File Conventions:](#folder-and-file-conventions)
  - [Top-level Folders:](#top-level-folders)
  - [Top-level Files:](#top-level-files)
  - [Routing Files:](#routing-files)
  - [Nested Routes:](#nested-routes)

# Setup: 

Step 1: Create a new Next.js project:

```bash
npx create-next-app@latest project-name --yes
```

Note: --yes skip all CLI prompts and uses default settings and setup TypeScript, Tailwind, ESLint, App Router, and Turbopack, with import alias @/*. If you want to customize your setup, you can use the below command and answer the prompts according to your preferences:

```bash
npx create-next-app@latest
```

```
What is your project named? my-app
Would you like to use the recommended Next.js defaults?
    Yes, use recommended defaults - TypeScript, ESLint, Tailwind CSS, App Router, Turbopack
    No, reuse previous settings
    No, customize settings - Choose your own preferences
```

If you choose to customize settings, you'll see the following prompts:

```
Would you like to use TypeScript? No / Yes
Which linter would you like to use? ESLint / Biome / None
Would you like to use React Compiler? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like your code inside a `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the import alias (`@/*` by default)? No / Yes
What import alias would you like configured? @/*
```

Step 2: If you want to install daisyUI: 

```bash
npm i daisyui@latest
npm pkg set browserslist="> 1%"
```

app/global.css:

```
@import "tailwindcss";
@plugin "daisyui";
```


# Introduction: 

### What is Next.js: 
Next.js is a React framework for building high-performance, SEO-optimized web applications. It extends React by providing structured routing, data fetching model, built-in backend capabilities, different types of optimization, and multiple rendering strategies within a single unified framework.

### Key Features of Next.js: 
- Multiple rendering (CSR, SSR, SSG, ISR)
- File-based routing system
- Built-in API routes 
- Built-in Data Fetching: `getStaticProps`, `getServerSideProps`, `getStaticPaths`, `fetch` (for client components)
- Built-in SEO Optimization
- Built-in Image and font Optimization
- Built-in TS and Tailwind css support
- Automatic Code Splitting: Only loads the JavaScript needed for each page, improving performance.

### Components in Next.js: 
In Next.js, there are two types of components: 

- Server Component: A React component that runs on the server. It has different types of rendering methods like SSR, SSG, ISR. 

- Client Component: A React component that runs on the browser. It has only one type of rendering methods that is CSR.

Note: In Next.js, components are server components by default. To make a component a client component, you need to add the "use client" directive at the top of the component file.


### Next.js Renderings:
Rendering in Next.js is the process of converting your React components into HTML, CSS, and JavaScript that the browser can display. Depending on how the component is configured, Rendering can happen in different ways in Next.js:, like: 
- Client Side Rendering (CSR): done in the browser.
- Server Side Rendering (SSR): done on the server for every request.
- Static Site Generation (SSG): done once at build time.
- Incremental Static Regeneration (ISR): done at build time and updated later automatically within a revalidation time.

#### 1. Client Side Rendering(CSR): 
CSR is the default rendering method for React. Since Next.js components are server component by default, we need the 'use client' directive to make a component client component so it can use client side rendering.

##### LifeCycle of CSR: 
- Browser sends a request to the server
- Server returns minimal HTML (div id="root") along with CSS files and JavaScript bundle
- Browser parses HTML immediately → empty page (blank root div) is shown
- CSS downloads → styles are applied (still not interactive)
- JavaScript downloads and executes
- React mounts the application inside the root div → UI becomes visible and interactive
- After mounting, client-side data fetching happens (useEffect, etc.), and UI updates when data arrives

**Note:** In React mounting is the process where a React component is created and inserted into the DOM (the HTML structure of the page) for the first time.

![alt text](./assets/images/introduction/csr-1.png)
![alt text](./assets/images/introduction/csr-2.png)
![alt text](./assets/images/introduction/csr-3.png)


##### Problems with CSR: 
- SEO limitations: Search engines may see just a black div with id root, which can lead to poor search engine rankings.
- Performance issues: Users see a black page for a few seconds until the JavaScript is fully downloaded and executed, This can negatively impact:
  - First Contentful Paint (FCP)
  - Time To Interactive (TTI)

##### When to use CSR: 
- When SEO is not a concern
- When you have a highly interactive application that relies heavily on user interactions.

#### 2. Server Side Rendering(SSR): 
Server-Side Rendering means that React components are rendered on the server for each request, and the browser receives fully rendered HTML instead of a blank page.Next.js optimizes SSR by caching rendered pages, so for subsequent requests, it can serve cached HTML without re-rendering on the server.

##### LifeCycle of SSR:
- Browser sends a request to the server
- Server executes React components and fetches required data
- Server generates fully rendered HTML
- Server returns rendered HTML along with CSS files and JavaScript bundle
- Browser parses HTML immediately → full content is visible (already rendered)
- CSS downloads → styles are applied
- JavaScript downloads and executes
- React hydrates the existing HTML → page becomes fully interactive

**Note**: Hydration means React takes the HTML that was rendered on the server (or pre-built) and “activates” it in the browser by attaching event listeners, connecting it to React’s virtual DOM, and making it fully interactive.

![alt text](./assets/images/introduction/ssr-1.png)
![alt text](./assets/images/introduction/ssr-2.png)
![alt text](./assets/images/introduction/ssr-3.png)

##### Problems with SSR:
- Increased server load: The server must render pages per request (next.js handles it by caching)..
- Still requires JavaScript to be fully interactive, so even the first contentful paint (FCP) is faster, the time to interactive (TTI) still be delayed until the JavaScript is fully executed (next.js handles it by RSC)

##### When to use SSR: 
- When SEO is a concern
- When you want to ensure faster first contentful paint (FCP).


#### 3. Static Site Generation(SSG): 
Static Site Generation (SSG) means that React components are rendered to HTML at build time, instead of on each request. The server generates the HTML once during the build, and the same pre-rendered HTML is served to all requests.

In Next.js, we need to use getStaticProps() to fetch data at build time and can getStaticPaths() for dynamic routes that need pre-rendering.

##### LifeCycle of SSG: 
- During build time, the server executes React components
- Required data is fetched at build time
- Static HTML files are generated and stored
- Browser sends a request to the server/CDN
- Server/CDN returns pre-generated HTML along with CSS files and JavaScript bundle
- Browser parses HTML immediately → full content is visible
- CSS downloads → styles are applied
- JavaScript downloads and executes
- React hydrates the static HTML → page becomes interactive page contains client-side components, React hydrates them after the JavaScript is downloaded and executed.

##### Problems with SSG: 
- Content can become outdated.
- Requires rebuilding the app to update content (unless using ISR).
- Not ideal for highly dynamic data.

##### When to use SSG: 
- Blog posts
- Marketing pages
- Documentation sites

#### 4. Incremental Static Regeneration(ISR): 
ISR allows you to update SSG pages after deployment without rebuilding the entire application. ISR is same as SSG but here you can specify a revalidation time for each page, and Next.js will automatically regenerate the page in the background when a request comes in after the revalidation time has passed.

Incremental Static Regeneration (ISR) is a feature in Next.js that combines the speed of SSG with the flexibility of SSR. With ISR, we can specify a revalidation time for each page, and Next.js will automatically regenerate the page in the background when a request comes in after the revalidation time has passed.

#### When to use ISR: 
- During build time, the server generates static HTML (like SSG)
- Browser sends a request to the server/CDN
- Server/CDN returns static HTML along with CSS files and JavaScript bundle
- Browser parses HTML immediately → full content is visible
- CSS downloads → styles are applied
- JavaScript downloads and executes
- React hydrates the HTML → page becomes interactive
- After the revalidation time, the server regenerates the page in the background
- The next request receives the updated static HTML

### Difference Between CSR, SSR, SSG, ISR: 

| Feature            | **CSR**                 | **SSR**                       | **SSG**                       | **ISR**                                                   |
| ------------------ | ----------------------- | ----------------------------- | ----------------------------- | --------------------------------------------------------- |
| **Where rendered** | Browser                 | Server per request            | Server at build               | Server at build + periodic updates                        |
| **HTML sent**      | Mostly empty            | Fully rendered                | Fully rendered                | Fully rendered                                            |
| **Data fetching**  | Client (`useEffect`)    | Server (`getServerSideProps`) | Build time (`getStaticProps`) | Build time + background (`getStaticProps` + `revalidate`) |
| **Interactivity**  | Hydrates after JS loads | Hydrates after HTML           | Hydrates after HTML           | Hydrates after HTML                                       |
| **Speed / FCP**    | Slower first paint      | Fast                          | Very fast                     | Very fast, updated in background                          |
| **SEO**            | Poor                    | Good                          | Excellent                     | Excellent                                                 |
| **Best use case**  | Interactive apps        | Dynamic pages                 | Static pages                  | Mostly static pages with occasional updates               |
| **Server load**    | Low                     | Higher                        | Very low                      | Low                                                       |
| **Examples**       | Dashboards, chats       | User profiles                 | Blogs, docs                   | Products, news                                            |

Summary: 
- CSR → Server sends empty HTML → React builds UI
- SSR → Server builds HTML per request → React hydrates
- SSG → Server builds HTML at build time → React hydrates
- ISR → Server builds HTML at build time + regenerates later → React hydrates

### Difference Between Library and Framework: 

| library                                                                                                                                                  | framework                                                                                                                             |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| A library is a collection of pre-written code that you can pick and use whenever you need. You decide when to call it and how to use it in your program. | A framework is a pre-defined structure that you must follow to build your application. It decides when your code runs and how to use. |
| you cal the library, means you decide when and how to use it.                                                                                            | the framework cal you, means it decide when and how to use it.                                                                        |
| more flexible, you can combine with others tolls                                                                                                         | less flexible, you must follow its rules and conventions                                                                              |
| focus on specific task                                                                                                                                   | provides a full solution for building entire apps                                                                                     |

### Difference Between React and Next.js: 

| Feature                  | **React**                                 | **Next.js**                                   |
| ------------------------ | ----------------------------------------- | --------------------------------------------- |
| **Type**                 | JavaScript library for building UI        | React Framework for building full-stack apps  |
| **Rendering**            | Only client-side by default (CSR)         | Supports CSR, SSR, SSG, and ISR               |
| **Routing**              | Manual with libraries like `react-router` | File-based routing built-in                   |
| **Server-side features** | Needs additional setup                    | Built-in API routes and server-side rendering |
| **SEO**                  | Poor by default (CSR)                     | Built-in SEO Optimization                     |

# Folder and File Conventions:

## Top-level Folders:
Top-level folders are used to organize your application's code and static assets.

- app:	App Router
- public:	Static assets to be served
- node_modules: The folder where all NPM installed packages and their dependencies are stored, so our project can run on node.js.
- src: Optional folder to organize code in large projects (not create by default, you can choose to create it) . It Serves as a central location for all your source code, instead of keeping everything at the project root. It contains: 
  - src/app/ 
  - src/components/ → reusable UI components.
  - src/styles/ → CSS or Tailwind/DaisyUI styling.
  - src/lib/ → helper functions, API clients, utilities.
  - src/context/ → React context providers.
  - src/hooks/ → custom hooks.
  - src/types/ → TypeScript types.

## Top-level Files: 
Top-level files are used to configure your application, manage dependencies, run proxy, integrate monitoring tools, and define environment variables.

- next.config.js: Configuration file for Next.js
  
![alt text](./assets/images/Folder-and-file-conventions/next.config.js.png)

- package.json: Is a human-readable file that declares the dependencies, dev-dependencies, scripts, and metadata of our project.

  - dependencies – Packages needed to run the app (e.g., React, Next.js, daisyui etc).
  - devDependencies – Packages needed for development only (e.g., typescript, eslint, tailwindcss etc).
  - scripts – Commands for running tasks like dev, build, start.
  - Metadata – Project name, version, author, license, description

![alt text](./assets/images/Folder-and-file-conventions/package-json.png)

- package-lock.json: Is an auto-generated file that locks the exact versions of all installed packages. It ensures that every developer or environment installs exactly the same package versions for preventing inconsistencies.

![alt text](./assets/images/Folder-and-file-conventions/package-lock-josn.png)

- .env.local: Environment variables that should not be tracked by version control. Used for sensitive data like API keys, database credentials etc.
  - With NEXT_PUBLIC_ prefix Variables can be accessed in client components.
  - Without NEXT_PUBLIC_ prefix Variables  only accessible on the server side, not exposed to the client.

![alt text](./assets/images/Folder-and-file-conventions/env-local.png)

- next-env.d.ts: TypeScript declaration file for Next.js (should not be tracked by version control)

![alt text](./assets/images/Folder-and-file-conventions/next-env-d-ts.png)

- eslint.config.mjs:	Configuration file for ESLint
  - ESLint is a static code analysis tool for JavaScript and TypeScript that helps you find and fix problems in your code. It enforces coding standards, catches bugs, and improves code quality by analyzing your code against a set of rules when you type code.

![alt text](./assets/images/Folder-and-file-conventions/eslint-config-mjs.png)

- .gitignore: Specifies files and directories (folders) that should be ignored by Git.

![alt text](./assets/images/Folder-and-file-conventions/git-ignore.png)

- tsconfig.json: Configuration file for TypeScript. It tells the TypeScript compiler (tsc) how to compile your TypeScript code into JavaScript.

![alt text](./assets/images/Folder-and-file-conventions/tsconfig-json.png)

## Routing Files:
Routing files are special files that define how routes behave, what UI they render, and how errors/loading states are handled.

| File           | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `layout`       | Shared layout for multiple pages                         |
| `page`         | Main content for client API endpoint                     |
| `route`        | API endpoint (server-side logic)                         |
| `template`     | Layout that re-renders on nested route changes           |
| `default`      | Fallback page for parallel routes when no route matches. |
| `loading`      | UI shown while route/page is loading                     |
| `not-found`    | 404 page UI                                              |
| `error`        | Error UI for a specific route                            |
| `global-error` | Error UI for the entire app                              |


## Nested Routes:
Nested routes are pages inside other pages.

```
src
└── app
    ├── layout.tsx                     
    ├── page.tsx                       (/)

    └── dashboard
        ├── layout.tsx                 
        ├── page.tsx                   (/dashboard)

        ├── analytics
        │   ├── page.tsx               (/dashboard/analytics)
        │   └── reports
        │       ├── page.tsx           (/dashboard/analytics/reports)
        │       ├── yearly
        │       │   └── page.tsx       (/dashboard/analytics/reports/yearly)
        │       └── monthly
        │           └── page.tsx       (/dashboard/analytics/reports/monthly)

        ├── users
        │   ├── page.tsx               (/dashboard/users)
        │   ├── active
        │   │   └── page.tsx           (/dashboard/users/active)
        │   └── inactive
        │       └── page.tsx           (/dashboard/users/inactive)

        └── settings
            ├── page.tsx               (/dashboard/settings)
            ├── profile
            │   └── page.tsx           (/dashboard/settings/profile)
            └── security
                └── page.tsx           (/dashboard/settings/security)
```

| File Location                                 | URL                                   |
| --------------------------------------------- | ------------------------------------- |
| `app/page.tsx`                                | `/`                                   |
| `dashboard/page.tsx`                          | `/dashboard`                          |
| `dashboard/analytics/page.tsx`                | `/dashboard/analytics`                |
| `dashboard/analytics/reports/page.tsx`        | `/dashboard/analytics/reports`        |
| `dashboard/analytics/reports/yearly/page.tsx` | `/dashboard/analytics/reports/yearly` |
| `dashboard/users/active/page.tsx`             | `/dashboard/users/active`             |
| `dashboard/settings/security/page.tsx`        | `/dashboard/settings/security`        |
