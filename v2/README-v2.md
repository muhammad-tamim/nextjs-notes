- [Cache Components:](#cache-components)
  - [How rendering works with Cache Components:](#how-rendering-works-with-cache-components)
  - [Automatically pre-rendered content:](#automatically-pre-rendered-content)
  - [Defer rendering to request time:](#defer-rendering-to-request-time)
    - [Types of Dynamic Work](#types-of-dynamic-work)
      - [External / Async Content:](#external--async-content)
    - [Runtime Data (Request-Based Data):](#runtime-data-request-based-data)
    - [Non-Deterministic Operations:](#non-deterministic-operations)
  - [Using use cache:](#using-use-cache)
    - [Caching During pre-rendering:](#caching-during-pre-rendering)
    - [Caching With runtime data:](#caching-with-runtime-data)
    - [Casing With non-deterministic operations:](#casing-with-non-deterministic-operations)
    - [Tagging and revalidating:](#tagging-and-revalidating)
      - [updateTag:](#updatetag)
      - [revalidateTag:](#revalidatetag)
    - [When To Use Caching:](#when-to-use-caching)
    - [Example:](#example)
- [Updating Data:](#updating-data)
  - [What are Server Functions:](#what-are-server-functions)
  - [Creating Server Functions:](#creating-server-functions)
    - [Server Components:](#server-components)
    - [Client Components:](#client-components)
    - [Passing actions as props:](#passing-actions-as-props)
  - [Invoking Server Functions:](#invoking-server-functions)
    - [Forms:](#forms)
    - [Event Handlers:](#event-handlers)
  - [Examples:](#examples)
    - [Showing a pending state:](#showing-a-pending-state)
    - [Refreshing:](#refreshing)
    - [Revalidating:](#revalidating)
    - [Redirecting:](#redirecting)
    - [Cookies:](#cookies)
    - [useEffect:](#useeffect)
- [Caching and Revalidating:](#caching-and-revalidating)
  - [fetch:](#fetch)
  - [cacheTag:](#cachetag)
  - [revalidateTag:](#revalidatetag-1)
  - [updateTag:](#updatetag-1)
  - [revalidatePath:](#revalidatepath)


# Cache Components: 
A Cache Component is a Server Component whose result is cached by Next.js so it doesn’t re-render on every request.

Instead of recomputing every time, Next.js stores the rendered result and reuses it.

## How rendering works with Cache Components: 

Let’s say you have this:

```ts
export default async function ProductsPage() {
  const products = await getProducts()
  return <ProductsList products={products} />
}
```

Note: By default fetch() is cached automatically, but you can stop caching by using "no-store"

First Request: 
- User requests /products
- Server runs the component
- getProducts() fetches data
- HTML + RSC payload is generated
- Next.js stores the result in cache

Second Request:
- Another user requests /products
- Next.js checks cache
- Cached result exists
- It returns cached output
- No re-render, no refetch
- This makes it fast.

Comparison:

| Type                    | Behavior                    |
| ----------------------- | --------------------------- |
| Normal Server Component | May re-render every request |
| Cached Component        | Render once, reuse result   |
| Dynamic Component       | Always re-render            |


## Automatically pre-rendered content: 
If your component only does things that can finish at build time, Next.js will include its output directly in the static HTML.

That means:
- No server work on each request
- No runtime rendering
- Just ready-made HTML

What counts as can finish at build time: 
Things like:
- Reading local files (fs.readFileSync)
- Importing JSON or modules
- Pure calculations (map, filter, JSON.parse, etc.)
- Anything that doesn’t depend on user request data

```tsx
import fs from 'node:fs'
 
export default async function Page() {
  // Synchronous file system read
  const content = fs.readFileSync('./config.json', 'utf-8')
 
  // Module imports
  const constants = await import('./constants.json')
 
  // Pure computations
  const processed = JSON.parse(content).items.map((item) => item.value * 2)
 
  return (
    <div>
      <h1>{constants.appName}</h1>
      <ul>
        {processed.map((value, i) => (
          <li key={i}>{value}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Defer rendering to request time: 
Sometimes Next.js cannot finish rendering during build time. This happens when your component uses:
- Network requests (fetch to external API)
- Database queries
- Async file operations
- Request data (cookies, headers)
- Non-deterministic values (Math.random(), Date.now())

here, Rendering must wait until a real user request happens. This is called deferring to request time.

When something cannot be pre-rendered, you must wrap it in:

```tsx
<Suspense fallback={<LoadingUI />}>
  <DynamicComponent />
</Suspense>
```

Note: Put `<Suspense>` as close as possible to the dynamic component. Because everything outside Suspense can still be static.

```tsx
// bad
<Suspense>
  <EntirePage />
</Suspense>
```

```tsx
// better
<h1>Static Title</h1>
<Suspense>
  <OnlyDynamicPart />
</Suspense>
```
This keeps most of your page static and fast.

### Types of Dynamic Work

#### External / Async Content:
fetch(), Database query, Async file read, Slow external systems etc these cannot run at build time. So they must be inside `<Suspense>`.

```tsx
import { Suspense } from 'react'
import fs from 'node:fs/promises'
 
async function DynamicContent() {
  // Network request
  const data = await fetch('https://api.example.com/data')
 
  // Database query
  const users = await db.query('SELECT * FROM users')
 
  // Async file system operation
  const file = await fs.readFile('..', 'utf-8')
 
  // Simulating external system delay
  await new Promise((resolve) => setTimeout(resolve, 100))
 
  return <div>Not in the static shell</div>
}
```

```tsx
export default async function Page(props) {
  return (
    <>
      <h1>Part of the static shell</h1>
      {/* <p>Loading..</p> is part of the static shell */}
      <Suspense fallback={<p>Loading..</p>}>
        <DynamicContent />
        <div>Sibling excluded from static shell</div>
      </Suspense>
    </>
  )
}
```

### Runtime Data (Request-Based Data): 
cookies(), headers(), searchParams, params (dynamic routes) etc These only exist when a user makes a request. Since build time has no request, these must run at request time. So wrap them in `<Suspense>`.

```tsx
import { cookies, headers } from 'next/headers'
import { Suspense } from 'react'
 
async function RuntimeData({ searchParams }) {
  // Accessing request data
  const cookieStore = await cookies()
  const headerStore = await headers()
  const search = await searchParams
 
  return <div>Not in the static shell</div>
}
```

```tsx
export default async function Page(props) {
  return (
    <>
      <h1>Part of the static shell</h1>
      {/* <p>Loading..</p> is part of the static shell */}
      <Suspense fallback={<p>Loading..</p>}>
        <RuntimeData searchParams={props.searchParams} />
        <div>Sibling excluded from static shell</div>
      </Suspense>
    </>
  )
}
```

### Non-Deterministic Operations: 
Operations like Math.random(), Date.now(), or crypto.randomUUID() produce different values each time they execute. If you want them to run per request, You must explicitly defer rendering to request time (e.g., using await connection()).

```tsx
import { connection } from 'next/server'
import { Suspense } from 'react'
 
async function UniqueContent() {
  // Explicitly defer to request time
  await connection()
 
  // Non-deterministic operations
  const random = Math.random()
  const now = Date.now()
  const date = new Date()
  const uuid = crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
 
  return (
    <div>
      <p>{random}</p>
      <p>{now}</p>
      <p>{date.getTime()}</p>
      <p>{uuid}</p>
      <p>{bytes}</p>
    </div>
  )
}
```

```tsx
export default async function Page() {
  return (
    // <p>Loading..</p> is part of the static shell
    <Suspense fallback={<p>Loading..</p>}>
      <UniqueContent />
    </Suspense>
  )
}
```

Summary: Very Simple Mental Model

If your component Needs real-time data, Needs user request data, Or generates unique values then It cannot be static. Wrap it in `<Suspense>` with fallback UI.

## Using use cache: 
The use cache directive caches the return value of async functions and components. You can apply it at the function, component, or file level.
 
Arguments and any closed-over values from parent scopes automatically become part of the cache key, which means different inputs produce separate cache entries. This enables personalized or parameterized cached content.

When dynamic content doesn't need to be fetched fresh from the source on every request, caching it lets you include the content in the static shell during pre-rendering, or reuse the result at runtime across multiple requests.

Cached content can be revalidated in two ways: automatically based on the cache lifetime, or on-demand using tags with revalidateTag or updateTag.

### Caching During pre-rendering: 
While dynamic content is fetched from external sources, it's often unlikely to change between accesses. Product catalog data updates with inventory changes, blog post content rarely changes after publishing, and analytics reports for past dates remain static.

If this data doesn't depend on runtime data, you can use the use cache directive to include it in the static HTML shell. Use cacheLife to define how long to use the cached data.

When revalidation occurs, the static shell is updated with fresh content.

```tsx
import { cacheLife } from 'next/cache'
 
export default async function Page() {
  'use cache'
  cacheLife('hours')
 
  const users = await db.query('SELECT * FROM users')
 
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

The cacheLife function accepts a cache profile name (like 'hours', 'days', or 'weeks') or a custom configuration object to control cache behavior:

```tsx
import { cacheLife } from 'next/cache'
 
export default async function Page() {
  'use cache'
  cacheLife({
    stale: 3600, // 1 hour until considered stale
    revalidate: 7200, // 2 hours until revalidated
    expire: 86400, // 1 day until expired
  })
 
  const users = await db.query('SELECT * FROM users')
 
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  )
}
```

### Caching With runtime data: 
Runtime data and use cache cannot be used in the same scope. However, you can extract values from runtime APIs and pass them as arguments to cached functions.

```tsx
import { cookies } from 'next/headers'
import { Suspense } from 'react'
 
export default function Page() {
  // Page itself creates the dynamic boundary
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  )
}
 
// Component (not cached) reads runtime data
async function ProfileContent() {
  const session = (await cookies()).get('session')?.value
 
  return <CachedContent sessionId={session} />
}
 
// Cached component/function receives data as props
async function CachedContent({ sessionId }: { sessionId: string }) {
  'use cache'
  // sessionId becomes part of cache key
  const data = await fetchUserData(sessionId)
  return <div>{data}</div>
}
```

At request time, CachedContent executes if no matching cache entry is found, and stores the result for future requests.

### Casing With non-deterministic operations: 
Within a use cache scope, non-deterministic operations execute during prerendering. This is useful when you want the same rendered output served to all users:

```tsx
export default async function Page() {
  'use cache'
 
  // Execute once, then cached for all requests
  const random = Math.random()
  const random2 = Math.random()
  const now = Date.now()
  const date = new Date()
  const uuid = crypto.randomUUID()
  const bytes = crypto.getRandomValues(new Uint8Array(16))
 
  return (
    <div>
      <p>
        {random} and {random2}
      </p>
      <p>{now}</p>
      <p>{date.getTime()}</p>
      <p>{uuid}</p>
      <p>{bytes}</p>
    </div>
  )
}
```

All requests will be served a route containing the same random numbers, timestamp, and UUID until the cache is revalidated.

### Tagging and revalidating: 
Tag cached data with cacheTag and revalidate it after mutations using updateTag in Server Actions for immediate updates, or revalidateTag when delays in updates are acceptable.

#### updateTag: 
Use updateTag when you need to expire and immediately refresh cached data within the same request:

```tsx
import { cacheTag, updateTag } from 'next/cache'
 
export async function getCart() {
  'use cache'
  cacheTag('cart')
  // fetch data
}
 
export async function updateCart(itemId: string) {
  'use server'
  // write data using the itemId
  // update the user cart
  updateTag('cart')
}
```

#### revalidateTag: 
Use revalidateTag when you want to invalidate only properly tagged cached entries with stale-while-revalidate behavior. This is ideal for static content that can tolerate eventual consistency.

```tsx
import { cacheTag, revalidateTag } from 'next/cache'
 
export async function getPosts() {
  'use cache'
  cacheTag('posts')
  // fetch data
}
 
export async function createPost(post: FormData) {
  'use server'
  // write data using the FormData
  revalidateTag('posts', 'max')
}
```

### When To Use Caching: 

- Use 'use cache' when:
  - Data changes occasionally
  - Not per-user request dependent
  - You want performance like SSG, But still control revalidation

- Do NOT use it when:
  - You need fresh data every request
  - You depend on request context directly

### Example: 
Here's a complete example showing static content, cached dynamic content, and streaming dynamic content working together on a single page:

```tsx
import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { cacheLife } from 'next/cache'
import Link from 'next/link'
 
export default function BlogPage() {
  return (
    <>
      {/* Static content - prerendered automatically */}
      <header>
        <h1>Our Blog</h1>
        <nav>
          <Link href="/">Home</Link> | <Link href="/about">About</Link>
        </nav>
      </header>
 
      {/* Cached dynamic content - included in the static shell */}
      <BlogPosts />
 
      {/* Runtime dynamic content - streams at request time */}
      <Suspense fallback={<p>Loading your preferences...</p>}>
        <UserPreferences />
      </Suspense>
    </>
  )
}
 
// Everyone sees the same blog posts (revalidated every hour)
async function BlogPosts() {
  'use cache'
  cacheLife('hours')
 
  const res = await fetch('https://api.vercel.app/blog')
  const posts = await res.json()
 
  return (
    <section>
      <h2>Latest Posts</h2>
      <ul>
        {posts.slice(0, 5).map((post: any) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>
              By {post.author} on {post.date}
            </p>
          </li>
        ))}
      </ul>
    </section>
  )
}
 
// Personalized per user based on their cookie
async function UserPreferences() {
  const theme = (await cookies()).get('theme')?.value || 'light'
  const favoriteCategory = (await cookies()).get('category')?.value
 
  return (
    <aside>
      <p>Your theme: {theme}</p>
      {favoriteCategory && <p>Favorite category: {favoriteCategory}</p>}
    </aside>
  )
}
```

During prerendering the header (static) and the blog posts fetched from the API (cached with use cache), both become part of the static shell along with the fallback UI for user preferences.

When a user visits the page, they instantly see this prerendered shell with the header and blog posts. Only the personalized preferences need to stream in at request time since they depend on the user's cookies. This ensures fast initial page loads while still providing personalized content.

# Updating Data: 
You can update data in Next.js using React's Server Functions.

## What are Server Functions: 
A Server Function is an asynchronous function that runs on the server. They can be called from the client through a network request, which is why they must be asynchronous.

In an action or mutation context, they are also called Server Actions.

Note: A Server Action is a Server Function used in a specific way (for handling form submissions and mutations). Server Function is the broader term.

By convention, a Server Action is an async function used with startTransition. This happens automatically when the function is:
- Passed to a `<form>` using the action prop.
- Passed to a `<button>` using the formAction prop.

In Next.js, Server Actions integrate with the framework's caching architecture. When an action is invoked, Next.js can return both the updated UI and new data in a single server roundtrip.

Behind the scenes, actions use the POST method, and only this HTTP method can invoke them.

## Creating Server Functions: 
A Server Function can be defined by using the use server directive. You can place the directive at the top of an asynchronous function to mark the function as a Server Function, or at the top of a separate file to mark all exports of that file.

```tsx
export async function createPost(formData: FormData) {
  'use server'
  const title = formData.get('title')
  const content = formData.get('content')
 
  // Update data
  // Revalidate cache
}
 
export async function deletePost(formData: FormData) {
  'use server'
  const id = formData.get('id')
 
  // Update data
  // Revalidate cache
}
```

### Server Components: 
Server Functions can be inlined in Server Components by adding the "use server" directive to the top of the function body:

```tsx
export default function Page() {
  // Server Action
  async function createPost(formData: FormData) {
    'use server'
    // ...
  }
 
  return <></>
}
```

### Client Components: 
It's not possible to define Server Functions in Client Components. However, you can invoke them in Client Components by importing them from a file that has the "use server" directive at the top of it:

```tsx
'use server'
 
export async function createPost() {}
```

```tsx
'use client'
 
import { createPost } from '@/app/actions'
 
export function Button() {
  return <button formAction={createPost}>Create</button>
}
```

### Passing actions as props: 
You can also pass an action to a Client Component as a prop:

```tsx
<ClientComponent updateItemAction={updateItem} />
```

```tsx
'use client'
 
export default function ClientComponent({
  updateItemAction,
}: {
  updateItemAction: (formData: FormData) => void
}) {
  return <form action={updateItemAction}>{/* ... */}</form>
}
```

## Invoking Server Functions: 
There are two main ways you can invoke a Server Function:
- Forms in Server and Client Components
- Event Handlers and useEffect in Client Components

### Forms: 
React extends the HTML `<form>` element to allow a Server Function to be invoked with the HTML action prop. When invoked in a form, the function automatically receives the FormData object. You can extract the data using the native FormData methods:

```tsx
import { createPost } from '@/app/actions'
 
export function Form() {
  return (
    <form action={createPost}>
      <input type="text" name="title" />
      <input type="text" name="content" />
      <button type="submit">Create</button>
    </form>
  )
}
```

```tsx
'use server'
 
export async function createPost(formData: FormData) {
  const title = formData.get('title')
  const content = formData.get('content')
 
  // Update data
  // Revalidate cache
}
```

### Event Handlers: 
You can invoke a Server Function in a Client Component by using event handlers such as onClick.

```tsx
'use client'
 
import { incrementLike } from './actions'
import { useState } from 'react'
 
export default function LikeButton({ initialLikes }: { initialLikes: number }) {
  const [likes, setLikes] = useState(initialLikes)
 
  return (
    <>
      <p>Total Likes: {likes}</p>
      <button
        onClick={async () => {
          const updatedLikes = await incrementLike()
          setLikes(updatedLikes)
        }}
      >
        Like
      </button>
    </>
  )
}
```

## Examples: 

### Showing a pending state: 
While executing a Server Function, you can show a loading indicator with React's useActionState hook. This hook returns a pending boolean:

```jsx
'use client'
 
import { useActionState, startTransition } from 'react'
import { createPost } from '@/app/actions'
import { LoadingSpinner } from '@/app/ui/loading-spinner'
 
export function Button() {
  const [state, action, pending] = useActionState(createPost, false)
 
  return (
    <button onClick={() => startTransition(action)}>
      {pending ? <LoadingSpinner /> : 'Create Post'}
    </button>
  )
}
```

### Refreshing: 
After a mutation, you may want to refresh the current page to show the latest data. You can do this by calling refresh from next/cache in a Server Action:

```jsx
'use server'
 
import { refresh } from 'next/cache'
 
export async function updatePost(formData: FormData) {
  // Update data
  // ...
 
  refresh()
}
```

This refreshes the client router, ensuring the UI reflects the latest state. The refresh() function does not revalidate tagged data. To revalidate tagged data, use updateTag or revalidateTag instead.

### Revalidating: 
After performing an update, you can revalidate the Next.js cache and show the updated data by calling revalidatePath or revalidateTag within the Server Function:

```jsx
import { revalidatePath } from 'next/cache'
 
export async function createPost(formData: FormData) {
  'use server'
  // Update data
  // ...
 
  revalidatePath('/posts')
}
```

### Redirecting:
You may want to redirect the user to a different page after performing an update. You can do this by calling redirect within the Server Function.

```jsx
'use server'
 
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
 
export async function createPost(formData: FormData) {
  // Update data
  // ...
 
  revalidatePath('/posts')
  redirect('/posts')
}
```
Calling redirect throws a framework handled control-flow exception. Any code after it won't execute. If you need fresh data, call revalidatePath or revalidateTag beforehand.

### Cookies: 
You can get, set, and delete cookies inside a Server Action using the cookies API. When you set or delete a cookie in a Server Action, Next.js re-renders the current page and its layouts on the server so the UI reflects the new cookie value.

```tsx
'use server'
 
import { cookies } from 'next/headers'
 
export async function exampleAction() {
  const cookieStore = await cookies()
 
  // Get cookie
  cookieStore.get('name')?.value
 
  // Set cookie
  cookieStore.set('name', 'Delba')
 
  // Delete cookie
  cookieStore.delete('name')
}
```

### useEffect: 
You can use the React useEffect hook to invoke a Server Action when the component mounts or a dependency changes. This is useful for mutations that depend on global events or need to be triggered automatically. For example, onKeyDown for app shortcuts, an intersection observer hook for infinite scrolling, or when the component mounts to update a view count:

```tsx
'use client'
 
import { incrementViews } from './actions'
import { useState, useEffect, useTransition } from 'react'
 
export default function ViewCount({ initialViews }: { initialViews: number }) {
  const [views, setViews] = useState(initialViews)
  const [isPending, startTransition] = useTransition()
 
  useEffect(() => {
    startTransition(async () => {
      const updatedViews = await incrementViews()
      setViews(updatedViews)
    })
  }, [])
 
  // You can use `isPending` to give users feedback
  return <p>Total Views: {views}</p>
}
```

# Caching and Revalidating: 
Caching is a technique for storing the result of data fetching and other computations so that future requests for the same data can be served faster, without doing the work again. While revalidation allows you to update cache entries without having to rebuild your entire application.

Next.js provides a few APIs to handle caching and revalidation like fetch, cacheTag, revalidateTag, updateTag, revalidatePath etc.

## fetch: 
By default, fetch requests are not cached. You can cache individual requests by setting the cache option to 'force-cache'.

```tsx
export default async function Page() {
  const data = await fetch('https://...', { cache: 'force-cache' })
}
```

Note:  Although fetch requests are not cached by default, Next.js will pre-render routes that have fetch requests and cache the HTML. If you want to guarantee a route is dynamic, use the `connection` API.


To revalidate the data returned by a fetch request, you can use the next.revalidate option.
```tsx
export default async function Page() {
  const data = await fetch('https://...', { next: { revalidate: 3600 } })
}
```
This will revalidate the data after a specified amount of seconds.

You can also tag fetch requests to enable on-demand cache invalidation:

```tsx
export async function getUserById(id: string) {
  const data = await fetch(`https://...`, {
    next: {
      tags: ['user'],
    },
  })
}
```

## cacheTag: 
cacheTag allows you to tag cached data in Cache Components so it can be revalidated on-demand. Previously, cache tagging was limited to fetch requests, and caching other work required the experimental unstable_cache API.

With Cache Components, you can use the use cache directive to cache any computation, and cacheTag to tag it. This works with database queries, file system operations, and other server-side work.

```tsx
import { cacheTag } from 'next/cache'
 
export async function getProducts() {
  'use cache'
  cacheTag('products')
 
  const products = await db.query('SELECT * FROM products')
  return products
}
```
Once tagged, you can use revalidateTag or updateTag to invalidate the cache entry for products. 

## revalidateTag: 
revalidateTag is used to revalidate cache entries based on a tag and following an event. The function now supports two behaviors:
- With profile="max": Uses stale-while-revalidate semantics, serving stale content while fetching fresh content in the background
- Without the second argument: Legacy behavior that immediately expires the cache (deprecated)

After tagging your cached data, using fetch with next.tags, or the cacheTag function, you may call revalidateTag in a Route Handler or Server Action:

```tsx
import { revalidateTag } from 'next/cache'
 
export async function updateUser(id: string) {
  // Mutate data
  revalidateTag('user', 'max') // Recommended: Uses stale-while-revalidate
}
```
You can reuse the same tag in multiple functions to revalidate them all at once.

## updateTag: 
updateTag is specifically designed for Server Actions to immediately expire cached data for read-your-own-writes scenarios. Unlike revalidateTag, it can only be used within Server Actions and immediately expires the cache entry.

```tsx
import { updateTag } from 'next/cache'
import { redirect } from 'next/navigation'
 
export async function createPost(formData: FormData) {
  // Create post in database
  const post = await db.post.create({
    data: {
      title: formData.get('title'),
      content: formData.get('content'),
    },
  })
 
  // Immediately expire cache so the new post is visible
  updateTag('posts')
  updateTag(`post-${post.id}`)
 
  redirect(`/posts/${post.id}`)
}
```

The key differences between revalidateTag and updateTag:

- updateTag: Only in Server Actions, immediately expires cache, for read-your-own-writes
- revalidateTag: In Server Actions and Route Handlers, supports stale-while-revalidate with profile="max"

## revalidatePath: 
revalidatePath is used to revalidate a route and following an event. To use it, call it in a Route Handler or Server Action:

```tsx
import { revalidatePath } from 'next/cache'
 
export async function updateUser(id: string) {
  // Mutate data
  revalidatePath('/profile')
```








