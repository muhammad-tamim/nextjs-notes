<h1 align="center">Next.js Notes</h1>

- [Setup:](#setup)
- [Introduction:](#introduction)
    - [What is Next.js:](#what-is-nextjs)
    - [Key Features of Next.js:](#key-features-of-nextjs)
    - [Difference Between Library and Framework:](#difference-between-library-and-framework)
    - [Difference Between React and Next.js:](#difference-between-react-and-nextjs)
- [Components in Next.js:](#components-in-nextjs)
  - [When to use Server and Client Components:](#when-to-use-server-and-client-components)
  - [Examples:](#examples)
    - [Using Client Components:](#using-client-components)
    - [Reducing JS bundle size:](#reducing-js-bundle-size)
    - [Passing data from Server to Client Components:](#passing-data-from-server-to-client-components)
    - [Interleaving Server and Client Components:](#interleaving-server-and-client-components)
    - [Context providers:](#context-providers)
    - [Sharing data with context and React.cache:](#sharing-data-with-context-and-reactcache)
    - [Third-party components:](#third-party-components)
    - [Preventing environment poisoning:](#preventing-environment-poisoning)
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
  - [Difference Between CSR, SSR, SSG, ISR:](#difference-between-csr-ssr-ssg-isr)
- [Folder and File Conventions:](#folder-and-file-conventions)
  - [Top-level Folders:](#top-level-folders)
  - [Top-level Files:](#top-level-files)
  - [Routing Files:](#routing-files)
  - [Nested Routes:](#nested-routes)
  - [Dynamic Routes:](#dynamic-routes)
  - [Parallel Routes:](#parallel-routes)
  - [Intercepted Routes:](#intercepted-routes)
    - [1. Intercept Sibling (.)folder:](#1-intercept-sibling-folder)
    - [2. Intercept Parent (..)folder:](#2-intercept-parent-folder)
    - [3. Intercept Two Levels (..)(..)folder:](#3-intercept-two-levels-folder)
    - [4. Intercept From Root (...)folder](#4-intercept-from-root-folder)
  - [Route Groups and Private Folders:](#route-groups-and-private-folders)
    - [Route Groups:](#route-groups)
    - [Private Folders:](#private-folders)
  - [Organizing project:](#organizing-project)
    - [Colocation:](#colocation)
    - [Private Folders:](#private-folders-1)
    - [Route groups:](#route-groups-1)
    - [src folder](#src-folder)
    - [Store project files outside of app:](#store-project-files-outside-of-app)
    - [Store project files in top-level folders inside of app:](#store-project-files-in-top-level-folders-inside-of-app)
    - [Split project files by feature or route:](#split-project-files-by-feature-or-route)
    - [Organize routes without affecting the URL path:](#organize-routes-without-affecting-the-url-path)
    - [Opting specific segments into a layout:](#opting-specific-segments-into-a-layout)
    - [Opting for loading skeletons on a specific route:](#opting-for-loading-skeletons-on-a-specific-route)
    - [Creating multiple root layouts:](#creating-multiple-root-layouts)
- [Layouts and Pages:](#layouts-and-pages)
  - [Creating a page:](#creating-a-page)
  - [Creating a layout:](#creating-a-layout)
  - [Creating a nested route:](#creating-a-nested-route)
  - [Nesting layouts:](#nesting-layouts)
  - [Creating a dynamic segment:](#creating-a-dynamic-segment)
  - [Linking between pages:](#linking-between-pages)
- [Linking and Navigating:](#linking-and-navigating)
    - [1. Server Side Rendering:](#1-server-side-rendering)
    - [2. Prefetching:](#2-prefetching)
    - [3. Streaming:](#3-streaming)
    - [4. Client-side Transitions:](#4-client-side-transitions)
    - [What can make transitions slow:](#what-can-make-transitions-slow)
      - [1. Dynamic routes without loading.tsx:](#1-dynamic-routes-without-loadingtsx)
      - [2. Dynamic segments without generateStaticParams:](#2-dynamic-segments-without-generatestaticparams)
      - [3. Slow networks:](#3-slow-networks)
      - [4. Disabling prefetching:](#4-disabling-prefetching)
      - [5. Hydration not completed:](#5-hydration-not-completed)

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


# Components in Next.js: 
In Next.js, there are two types of components: 

- Server Component: A React component that runs on the server. It has different types of rendering methods like SSR, SSG, ISR. 

- Client Component: A React component that runs on the browser. It has only one type of rendering methods that is CSR.

Note: In Next.js, components are server components by default. To make a component a client component, you need to add the "use client" directive at the top of the component file.

## When to use Server and Client Components: 
The client and server environments have different capabilities. Server and Client components allow you to run logic in each environment depending on your use case.

Use Client Components when you need:
- State and event handlers. E.g. onClick, onChange.
- Lifecycle logic. E.g. useEffect.
- Browser-only APIs. E.g. localStorage, window, Navigator.geolocation, etc.
- Custom hooks.

Use Server Components when you need:
- Fetch data from databases or APIs close to the source.
- Use API keys, tokens, and other secrets without exposing them to the client.
- Reduce the amount of JavaScript sent to the browser.
- Improve the First Contentful Paint (FCP), and stream content progressively to the client.

For example, the `<Page>` component is a Server Component that fetches data about a post, and passes it as props to the `<LikeButton>` which handles client-side interactivity.

app/[id]/page.tsx:

```tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
 
  return (
    <div>
      <main>
        <h1>{post.title}</h1>
        {/* ... */}
        <LikeButton likes={post.likes} />
      </main>
    </div>
  )
}
```
app/ui/like-button.tsx
```tsx
'use client'
 
import { useState } from 'react'
 
export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

## Examples: 

### Using Client Components: 

we can create a Client Component by adding the "use client" directive at the top of the file, above your imports.

```tsx
'use client'
 
import { useState } from 'react'
 
export default function Counter() {
  const [count, setCount] = useState(0)
 
  return (
    <div>
      <p>{count} likes</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  )
}
```

"use client" is used to declare a boundary between the Server and Client module graphs (trees).

Once a file is marked with "use client", all its imports and child components are considered part of the client bundle. This means you don't need to add the directive to every component that is intended for the client.

### Reducing JS bundle size: 

To reduce the size of your client JavaScript bundles, add 'use client' to specific interactive components instead of marking large parts of your UI as Client Components.

For example, the `<Layout>` component contains mostly static elements like a logo and navigation links, but includes an interactive search bar. `<Search />` is interactive and needs to be a Client Component, however, the rest of the layout can remain a Server Component.

```tsx
// Client Component
import Search from './search'
// Server Component
import Logo from './logo'
 
// Layout is a Server Component by default
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav>
        <Logo />
        <Search />
      </nav>
      <main>{children}</main>
    </>
  )
}
```

```tsx
'use client'
 
export default function Search() {
  // ...
}
```

### Passing data from Server to Client Components: 

You can pass data from Server Components to Client Components using props.

```tsx
import LikeButton from '@/app/ui/like-button'
import { getPost } from '@/lib/data'
 
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPost(id)
 
  return <LikeButton likes={post.likes} />
}
```

```tsx
'use client'
 
export default function LikeButton({ likes }: { likes: number }) {
  // ...
}
```

Alternatively, you can stream data from a Server Component to a Client Component with the use API.

```tsx
import Posts from '@/app/ui/posts'
import { Suspense } from 'react'
 
export default function Page() {
  // Don't await the data fetching function
  const posts = getPosts()
 
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
```

Then, in your Client Component, use the use API to read the promise:

```tsx
'use client'
import { use } from 'react'
 
export default function Posts({
  posts,
}: {
  posts: Promise<{ id: string; title: string }[]>
}) {
  const allPosts = use(posts)
 
  return (
    <ul>
      {allPosts.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

In the example above, the `<Posts>` component is wrapped in a `<Suspense>` boundary. This means the fallback will be shown while the promise is being resolved. 

### Interleaving Server and Client Components: 
You can pass Server Components as a prop to a Client Component. This allows you to visually nest server-rendered UI within Client components.

A common pattern is to use children to create a slot in a `<ClientComponent>`. For example, a `<Cart>` component that fetches data on the server, inside a `<Modal>` component that uses client state to toggle visibility.

```tsx
'use client'
 
export default function Modal({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}
```
Then, in a parent Server Component (e.g.`<Page>`), you can pass a `<Cart>` as the child of the `<Modal>`:

```tsx
import Modal from './ui/modal'
import Cart from './ui/cart'
 
export default function Page() {
  return (
    <Modal>
      <Cart />
    </Modal>
  )
}
```

### Context providers: 
React context is commonly used to share global state like the current theme. However, React context is not supported in Server Components.

To use context, create a Client Component that accepts children:

```tsx
'use client'
 
import { createContext } from 'react'
 
export const ThemeContext = createContext({})
 
export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <ThemeContext.Provider value="dark">{children}</ThemeContext.Provider>
}
```

Then, import it into a Server Component (e.g. layout):

```tsx
import ThemeProvider from './theme-provider'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
```
our Server Component will now be able to directly render your provider, and all other Client Components throughout your app will be able to consume this context.

### Sharing data with context and React.cache: 

You can share fetched data across both Server and Client Components by combining React.cache with context providers.

Create a cached function that fetches data:

```tsx
// app/lib/user.ts
import { cache } from 'react'
 
export const getUser = cache(async () => {
  const res = await fetch('https://api.example.com/user')
  return res.json()
})
```

Create a context provider that stores the promise:

```tsx
// app/user-provider.tsx
'use client'
 
import { createContext } from 'react'
 
type User = {
  id: string
  name: string
}
 
export const UserContext = createContext<Promise<User> | null>(null)
 
export default function UserProvider({
  children,
  userPromise,
}: {
  children: React.ReactNode
  userPromise: Promise<User>
}) {
  return <UserContext value={userPromise}>{children}</UserContext>
}
```

In a layout, pass the promise to the provider without awaiting:

```tsx
import UserProvider from './user-provider'
import { getUser } from './lib/user'
 
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userPromise = getUser() // Don't await
 
  return (
    <html>
      <body>
        <UserProvider userPromise={userPromise}>{children}</UserProvider>
      </body>
    </html>
  )
}
```

client Components use use() to resolve the promise from context, wrapped in <Suspense> for fallback UI:

```tsx
// app/ui/profile.tsx
'use client'
 
import { use, useContext } from 'react'
import { UserContext } from '../user-provider'
 
export function Profile() {
  const userPromise = useContext(UserContext)
  if (!userPromise) {
    throw new Error('useContext must be used within a UserProvider')
  }
  const user = use(userPromise)
  return <p>Welcome, {user.name}</p>
}
```

```tsx
// app/page.tsx
import { Suspense } from 'react'
import { Profile } from './ui/profile'
 
export default function Page() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <Profile />
    </Suspense>
  )
}
```

Server Components can also call getUser() directly:

```tsx
// app/dashboard/page.tsx
import { getUser } from '../lib/user'
 
export default async function DashboardPage() {
  const user = await getUser() // Cached - same request, no duplicate fetch
  return <h1>Dashboard for {user.name}</h1>
}
```

Since getUser is wrapped with React.cache, multiple calls within the same request return the same memoized result, whether called directly in Server Components or resolved via context in Client Components.

### Third-party components: 
When using a third-party component that relies on client-only features, you can wrap it in a Client Component to ensure it works as expected.

For example, the `<Carousel />` can be imported from the acme-carousel package. This component uses useState, but it doesn't yet have the "use client" directive.

If you use `<Carousel />` within a Client Component, it will work as expected:

```tsx
'use client'
 
import { useState } from 'react'
import { Carousel } from 'acme-carousel'
 
export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false)
 
  return (
    <div>
      <button onClick={() => setIsOpen(true)}>View pictures</button>
      {/* Works, since Carousel is used within a Client Component */}
      {isOpen && <Carousel />}
    </div>
  )
}
```


However, if you try to use it directly within a Server Component, you'll see an error. This is because Next.js doesn't know `<Carousel />` is using client-only features.

To fix this, you can wrap third-party components that rely on client-only features in your own Client Components:

```tsx
'use client'
 
import { Carousel } from 'acme-carousel'
 
export default Carousel
```

Now, you can use `<Carousel />` directly within a Server Component:

```tsx
import Carousel from './carousel'
 
export default function Page() {
  return (
    <div>
      <p>View pictures</p>
      {/*  Works, since Carousel is a Client Component */}
      <Carousel />
    </div>
  )
}
```

### Preventing environment poisoning: 
In Next.js, JavaScript modules can be shared between Server Components and Client Components.

Because of this, it’s possible to accidentally import server-only logic into client-side code. This mistake is known as environment poisoning. It happens when sensitive server logic leaks into the client bundle.

For example, this function uses process.env.API_KEY, which is a secret and must never be exposed to the browser.

```tsx
export async function getData() {
  const res = await fetch('https://external-service.com/data', {
    headers: {
      authorization: process.env.API_KEY,
    },
  })
 
  return res.json()
}
```

so, in next.js by default handle it like this: 
- Only environment variables prefixed with NEXT_PUBLIC_ are included in the client bundle.
- Variables without this prefix are replaced with an empty string ("") in client builds.

So if getData() is accidentally imported into a Client Component, the API_KEY will not be exposed. Instead, it becomes an empty string. This prevents direct secret leakage.

But Even though secrets are stripped from the client bundle, environment poisoning is still dangerous. Because it cause: 
- Architectural Violation: Server logic should never run in the browser.
- Logic Exposure Risk: Even if secrets are removed, you might still expose internal API endpoints, Backend request structure, Sensitive business logic
- Future Maintenance Risk: If someone later adds NEXT_PUBLIC_ by mistake

To make a proper solution of that problem you can use a the built-in safeguard `server-only`: 

```tsx
import "server-only"

export async function getData() {
  const res = await fetch("https://external-service.com/data", {
    headers: {
      authorization: process.env.API_KEY,
    },
  })

  return res.json()
}
```
Now, if someone imports this module into a Client Component, the build will fail. This enforces correct server/client boundaries at compile time.


# Next.js Renderings:
Rendering in Next.js is the process of converting your React components into HTML, CSS, and JavaScript that the browser can display. Depending on how the component is configured, Rendering can happen in different ways in Next.js:, like: 
- Client Side Rendering (CSR): done in the browser.
- Server Side Rendering (SSR): done on the server for every request.
- Static Site Generation (SSG): done once at build time.
- Incremental Static Regeneration (ISR): done at build time and updated later automatically within a revalidation time.

## 1. Client Side Rendering(CSR): 
CSR is the default rendering method for React. Since Next.js components are server component by default, we need the 'use client' directive to make a component client component so it can use client side rendering.

### LifeCycle of CSR: 
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


### Problems with CSR: 
- SEO limitations: Search engines may see just a black div with id root, which can lead to poor search engine rankings.
- Performance issues: Users see a black page for a few seconds until the JavaScript is fully downloaded and executed, This can negatively impact:
  - First Contentful Paint (FCP)
  - Time To Interactive (TTI)

### When to use CSR: 
- When SEO is not a concern
- When you have a highly interactive application that relies heavily on user interactions.

## 2. Server Side Rendering(SSR): 
Server-Side Rendering means that React components are rendered on the server for each request, and the browser receives fully rendered HTML instead of a blank page.Next.js optimizes SSR by caching rendered pages, so for subsequent requests, it can serve cached HTML without re-rendering on the server.

### LifeCycle of SSR:
- Browser sends request to server
- Server executes Server Components and fetches data
- Server generates:
  - HTML (for immediate paint)
  - RSC payload (serialized React component instructions)
- Server returns:
  - HTML (which includes references to CSS & JS assets) 
  - RSC payload
- Browser parses HTML → content visible immediately
- Browser downloads CSS and JS files referenced in `<link>` and `<script>` tags
- CSS is applied
- JavaScript executes
- React by the help of RSC payload:
  - Reconstructs component tree 
  - Hydrates Client Components and Page becomes fully interactive


**Note:**: Hydration means React takes the server-rendered HTML and Attaches event listeners, Connects it to the React Virtual DOM and finally Makes Client Components interactive. 

**Note:** Server Components never hydrate. 

![alt text](./assets/images/introduction/ssr-1.png)
![alt text](./assets/images/introduction/ssr-2.png)
![alt text](./assets/images/introduction/ssr-3.png)

### Problems with SSR:
- Increased server load: The server must render pages per request (next.js handles it by caching)..
- Still requires JavaScript to be fully interactive, so even the first contentful paint (FCP) is faster, the time to interactive (TTI) still be delayed until the JavaScript is fully executed (next.js handles it by RSC)

### When to use SSR: 
- When SEO is a concern
- When you want to ensure faster first contentful paint (FCP).


## 3. Static Site Generation(SSG): 
Static Site Generation (SSG) means the React components are pre-rendered at build time, not per request. The server generates the HTML once during the build, and the same pre-rendered HTML is served for all requests

In Next.js, we need to use getStaticProps() to fetch data at build time and can getStaticPaths() for dynamic routes that need pre-rendering.This approach is ideal for pages with data that doesn’t change often (blogs, marketing pages, docs, etc.).


### LifeCycle of SSG: 
1. Build Time: 
   - Server executes React components
   - Required data is fetched from APIs or databases
   - HTML + RSC payload is generated for each page and stored in build output (static files)
2. Request Time: 
   - Browser sends request to server or CDN
   - Server returns:
     - cached pre pre-rendered HTML (which includes references to CSS & JS) and RSC payload
   - Browser parses HTML → content visible immediately
   - Browser downloads CSS and JS files referenced in `<link>` and `<script>` tags
   - CSS is applied
   - JavaScript executes
   - React by the help of RSC payload:
     - Reconstructs component tree 
     - Hydrates Client Components and Page becomes fully interactive


### Problems with SSG: 
- Content can become outdated.
- Requires rebuilding the app to update content (unless using ISR).
- Not ideal for highly dynamic data.

### When to use SSG: 
- Blog posts
- Marketing pages
- Documentation sites

## 4. Incremental Static Regeneration(ISR): 
ISR allows you to update SSG pages after deployment without rebuilding the entire application. ISR is same as SSG but here you can specify a revalidation time for each page, and Next.js will automatically regenerate the page in the background when a request comes in after the revalidation time has passed.

Incremental Static Regeneration (ISR) is a feature in Next.js that combines the speed of SSG with the flexibility of SSR. With ISR, we can specify a revalidation time for each page, and Next.js will automatically regenerate the page in the background when a request comes in after the revalidation time has passed.

## Difference Between CSR, SSR, SSG, ISR: 

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

## Dynamic Routes: 
Dynamic routes are routes where a part of the URL is variable, not fixed. They are created using square brackets.

In Next.js there are three types of dynamic route segments available:

1. [slug] → Matches exactly 1 URL segment.

```
blog/[slug]/page.tsx

<!-- Matches: -->

/blog/post-1
/blog/hello-world

<!-- Does NOT match: -->

/blog/2024/post-1   
```

2. [...slug] — Matches 1 or more URL segments.

```
blog/[...slug]/page.tsx

<!-- Matches: -->

/blog/a
/blog/a/b
/blog/a/b/c

<!-- Does NOT match: -->

/blog    
```


3. [[...slug]] — Matches 0 or more URL segments.

```
blog/[[...slug]]/page.tsx

<!-- Matches: -->

/blog
/blog/a
/blog/a/b
/blog/a/b/c
```

summary: 

| Pattern       | Matches            | Type of param           |
| ------------- | ------------------ | ----------------------- |
| `[slug]`      | Exactly 1 segment  | `string`                |
| `[...slug]`   | 1 or more segments | `string[]`              |
| `[[...slug]]` | 0 or more segments | `string[] \| undefined` |


## Parallel Routes: 
Parallel Routes (@folder) render multiple routes at the same time without unmounting each other. Perfect for sidebars, persistent headers, dashboards.

```
app/
 ├─ layout.tsx
 ├─ @sidebar/
 │   └─ page.tsx
 └─ main/
     └─ page.tsx
```

```tsx
export default function RootLayout({ children }) {
  return (
    <div>
      <div className="flex">

        <div className="w-1/4 bg-gray-100">
          {/* Parallel slot */}
          <Slot name="sidebar" />
        </div>
      
        <div className="flex-1 p-4">
          {/* Main content */}
          {children}
        </div>
      
      </div>
    </div>
  );
}
```

here, The `<Slot name="sidebar" />` will render content from @sidebar/page.js and Navigating between main/page.tsx and other pages does not unmount the sidebar.

## Intercepted Routes: 
Intercepted routes allow overlays or modals a route on top of the current route, without unmounting the underlying route.

In Next.js there are 4 types of intercepted available: 

### 1. Intercept Sibling (.)folder: 
Preview a sibling page in a modal.

```
app/
 ├─ dashboard/
 │   ├─ page.js
 │   └─ (.)details/
 │       └─ page.js
```

here, Navigate to /dashboard/(.)details → modal appears on top of dashboard without  un-mounted Dashboard.

### 2. Intercept Parent (..)folder: 
Open a child route as an overlay on the parent.

```
app/
 ├─ projects/
 │   ├─ page.js
 │   └─ (..)tasks/
 │       └─ page.js
```

Navigating to /projects/(..)tasks shows tasks overlay while the parent projects page remains visible.

### 3. Intercept Two Levels (..)(..)folder: 
Deep nested modals or overlays.

```
app/
 ├─ organization/
 │   ├─ page.js
 │   └─ teams/
 │       └─ page.js
 │       └─ (..)(..)members/
 │           └─ page.js
```

Shows members overlay two levels up in the hierarchy.

### 4. Intercept From Root (...)folder
Global modal anywhere in the app.

```
app/
 ├─ page.js
 └─ (...)loginModal/
     └─ page.js
```
Navigate to / (...)loginModal → modal opens on top of any current page. Base page remains mounted, state preserved.

## Route Groups and Private Folders:

### Route Groups:
Route groups (folderName) used to separate features or sections of a route without affecting the URL.

```
app/
  (auth)/
    login/
    register/

  (dashboard)/
    analytics/
    users/
```

Even though folders are grouped: /login, /register, /analytics, /users etc, there is no (auth) or (dashboard) in the URL. 

### Private Folders:
Private folders (_folderName) used to organize internal components, helpers, or utilities of a route without affecting the URL

Instead of mixing:

```
dashboard/
  page.tsx
  componentA.tsx
  componentB.tsx
  helper.ts
```
we can do:

```
dashboard/
  page.tsx
  _components/
  _utils/
```

The _components and _utils folder is not a route and Cannot be accessed in the browser. It's Exists only for making our routes folder clean and organized.

## Organizing project: 

### Colocation:
In the app directory, nested folders define route structure. Each folder represents a route segment that is mapped to a corresponding segment in a URL path.

However, even though route structure is defined through folders, a route is not publicly accessible until a page.js or route.js file is added to a route segment.

![image](./assets/images/Folder-and-file-conventions/colocation1.avif)
![image](./assets/images/Folder-and-file-conventions/colocation2.avif)

This means that project files can be safely colocated inside route segments in the app directory without accidentally being routable.

![image](./assets/images/Folder-and-file-conventions/colocation3.avif)

### Private Folders: 
Private folders are not routable at all.

![image](./assets/images/Folder-and-file-conventions/private-folders.avif)


### Route groups: 
Routes groups don't create routes.

![image](./assets/images/Folder-and-file-conventions/route-groups.avif)

### src folder

![image](./assets/images/Folder-and-file-conventions/src-directory.avif)

### Store project files outside of app: 
This strategy stores all application code in shared folders in the root of your project and keeps the app directory purely for routing purposes.

![image](./assets/images/Folder-and-file-conventions/project-organization-project-root.avif)

### Store project files in top-level folders inside of app:
This strategy stores all application code in shared folders in the root of the app directory.

![image](./assets/images/Folder-and-file-conventions/project-organization-app-root.avif)

### Split project files by feature or route:
This strategy stores globally shared application code in the root app directory and splits more specific application code into the route segments that use them.

![image](./assets/images/Folder-and-file-conventions/project-organization-app-root-split.avif)

### Organize routes without affecting the URL path: 
To organize routes without affecting the URL, create a group to keep related routes together. The folders in parenthesis will be omitted from the URL (e.g. (marketing) or (shop)).

![image](./assets/images/Folder-and-file-conventions/route-group-organisation.avif)

Even though routes inside (marketing) and (shop) share the same URL hierarchy, you can create a different layout for each group by adding a layout.js file inside their folders.

![image](./assets/images/Folder-and-file-conventions/route-group-multiple-layouts.avif)

### Opting specific segments into a layout:
To opt specific routes into a layout, create a new route group (e.g. (shop)) and move the routes that share the same layout into the group (e.g. account and cart). The routes outside of the group will not share the layout (e.g. checkout).

![image](./assets/images/Folder-and-file-conventions/route-group-opt-in-layouts.avif)

### Opting for loading skeletons on a specific route: 
To apply a loading skeleton via a loading.js file to a specific route, create a new route group (e.g., /(overview)) and then move your loading.tsx inside that route group.

![image](./assets/images/Folder-and-file-conventions/route-group-loading.avif)

Now, the loading.tsx file will only apply to your dashboard → overview page instead of all your dashboard pages without affecting the URL path structure.

### Creating multiple root layouts: 
To create multiple root layouts, remove the top-level layout.js file, and add a layout.js file inside each route group. This is useful for partitioning an application into sections that have a completely different UI or experience. The <html> and <body> tags need to be added to each root layout.

![image](./assets/images/Folder-and-file-conventions/route-group-multiple-root-layouts.avif)

In the example above, both (marketing) and (shop) have their own root layout.

# Layouts and Pages:

## Creating a page:
A page is a UI that is rendered on a specific route.

![image](./assets/images/layouts-and-pages/page-special-file.avif)

## Creating a layout: 
A layout is UI that is shared between multiple pages.

![image](./assets/images/layouts-and-pages/layout-special-file.avif)

The layout above is called a root layout because it's defined at the root of the app directory. The root layout is required and must contain html and body tags.

## Creating a nested route: 
A nested route is a route composed of multiple URL segments. For example, the /blog/[slug] route is composed of three segments:
- / (Root Segment)
- blog (Segment)
- [slug] (Leaf Segment)

In Next.js:
- Folders are used to define the route segments that map to URL segments.
- Files (like page and layout) are used to create UI that is shown for a segment.

To create nested routes, you can nest folders inside each other. For example, to add a route for /blog, create a folder called blog in the app directory. Then, to make /blog publicly accessible, add a page.tsx file:

![image](./assets/images/layouts-and-pages/blog-nested-route.avif)

You can continue nesting folders to create nested routes. For example, to create a route for a specific blog post, create a new [slug] folder inside blog and add a page file:

![image](./assets/images/layouts-and-pages/blog-post-nested-route.avif)

Wrapping a folder name in square brackets (e.g. [slug]) creates a dynamic route segment which is used to generate multiple pages from data. e.g. blog posts, product pages, etc.

## Nesting layouts:

![image](./assets/images/layouts-and-pages/nested-layouts.avif)

## Creating a dynamic segment: 

```tsx
export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)
 
  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  )
}
```

## Linking between pages: 
You can use the `<Link>` component to navigate between routes. `<Link>` is a built-in Next.js component that extends the HTML `<a>` tag to provide prefetching and client-side navigation.

For example, to generate a list of blog posts, import `<Link>` from next/link and pass a href prop to the component:

```tsx
import Link from 'next/link'
 
export default async function Post({ post }) {
  const posts = await getPosts()
 
  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </li>
      ))}
    </ul>
  )
}
```

# Linking and Navigating:
In Next.js, routes are Server Components by default. That does not mean navigation is slow — because Next.js combines:


### 1. Server Side Rendering: 

We already discuss it earlier

### 2. Prefetching:
Happens before navigation (background optimization). 

When we use:

```tsx
import Link from "next/link"

<Link href="/dashboard" />
```

Next.js automatically:

- Prefetches RSC payload
- Prefetches required JS chunks
- Stores them in router cache

When does prefetch happen:
- When `<Link />` enters the viewport
- On hover (in some cases)

Why it matters:
- When user clicks:
  - Data is already cached
  - No waiting for server
  - Navigation feels instant

### 3. Streaming:
Streaming allows the server to send UI in chunks (parts) by the help of react `<Suspense>` instead of waiting for everything.

```tsx
<Suspense fallback={<Loading />}>
  <SlowDataComponent />
</Suspense>
```

or you can just create a loading.tsx in your route folder:

![image]('./assets/images/linking-and-navigating/loading-special-file.avif')

```tsx
export default function Loading() {
  // Add fallback UI that will be shown while the route is loading.
  return <LoadingSkeleton />
}
```

Behind the scenes, Next.js will automatically wrap the page.tsx contents in a <Suspense> boundary. The prefetched fallback UI will be shown while the route is loading, and swapped for the actual content once ready.

Without streaming:
- Server waits for ALL data → sends full response.

With streaming: 
- Server:
  - Layout appears immediately.
  - Fast components render first.
  - Slow components render later.


### 4. Client-side Transitions: 

Prevent Page Reload, because by default SSR need page reload for initial render.

When User clicks `<Link />`:
- Browser does NOT reload page.
- Client requests only the new RSC payload.
- Server renders changed route segments.
- React merges new UI into existing tree.
- Shared layouts stay mounted.
- Only new Client Components hydrate.

Key Result:
- No full page refresh
- Layout state preserved
- SPA-like experience
- Server still controls rendering

Summary: Next.js App Router keeps navigation fast by combining:

- Server-Side Rendering → returns HTML + RSC payload
- Prefetching → Routes are preloaded in the background.
- Streaming → UI loads in chunks.
- Client-Side Transitions → No full reload, only changed parts update.

### What can make transitions slow:

#### 1. Dynamic routes without loading.tsx: 
When navigating to a dynamic route, the client must wait for the server response before showing the result. This can give the users the impression that the app is not responding.

We recommend adding loading.tsx to dynamic routes to enable partial prefetching, trigger immediate navigation, and display a loading UI while the route renders.

#### 2. Dynamic segments without generateStaticParams: 
In App Router, dynamic routes like: `app/blog/[slug]/page.tsx` can be rendered in two ways:
- SSG / ISR (pre-rendered at build time or with revalidation) if we use `generateStaticParams`
- Dynamic SSR (rendered on each request) if we don't use `generateStaticParams`

```tsx
export async function generateStaticParams() {
  const posts = await fetch('https://.../posts').then((res) => res.json())
 
  return posts.map((post) => ({
    slug: post.slug,
  }))
}
 
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  // ...
}
```


#### 3. Slow networks: 
On slow or unstable networks, prefetching may not finish before the user clicks a link. This can affect both static and dynamic routes. In these cases, the `loading.js` fallback may not appear immediately because it hasn't been prefetched yet.

To improve perceived performance, you can use the `useLinkStatus` hook to show immediate feedback while the transition is in progress.

```tsx
'use client'
 
import { useLinkStatus } from 'next/link'
 
export default function LoadingIndicator() {
  const { pending } = useLinkStatus()
  return (
    <span aria-hidden className={`link-hint ${pending ? 'is-pending' : ''}`} />
  )
}
```

Note: You can also "debounce" the hint by adding an initial animation delay (e.g. 100ms) and starting as invisible (e.g. opacity: 0). This means the loading indicator will only be shown if the navigation takes longer than the specified delay. See the useLinkStatus reference for a CSS example.

#### 4. Disabling prefetching: 

You can opt out of prefetching by setting the prefetch prop to false on the `<Link>` component. This is useful to avoid unnecessary usage of resources when rendering large lists of links (e.g. an infinite scroll table).

```tsx
<Link prefetch={false} href="/blog">
  Blog
</Link>
```

However, disabling prefetching comes with trade-offs:
- Static routes will only be fetched when the user clicks the link.
- Dynamic routes will need to be rendered on the server first before the client can navigate to it.

To reduce resource usage without fully disabling prefetch, you can prefetch only on hover. This limits prefetching to routes the user is more likely to visit, rather than all links in the viewport.

```tsx
'use client'
 
import Link from 'next/link'
import { useState } from 'react'
 
function HoverPrefetchLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const [active, setActive] = useState(false)
 
  return (
    <Link
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={() => setActive(true)}
    >
      {children}
    </Link>
  )
}
```

#### 5. Hydration not completed: 

`<Link>` is a Client Component and must be hydrated before it can prefetch routes. On the initial visit, large JavaScript bundles can delay hydration, preventing prefetching from starting right away.
