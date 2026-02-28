- [Linking and Navigation:](#linking-and-navigation)
- [Dynamic Routes:](#dynamic-routes)
- [Metadata:](#metadata)
- [Api Routes:](#api-routes)


# Linking and Navigation: 
- `<Link>`: For Navbar

```tsx
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href="/about">About</Link>
    </div>
  );
}
```

- useRouter(): Use when navigation depends on logic (form submit, auth check, etc).

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = async () => {
    // auth logic
    router.push("/login");
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

Available methods: 

```
router.push("/path")       // navigate (adds to history stack)
router.replace("/path")    // replace history (does not add to history)
router.back()              // go back
router.forward()           // go forward
router.refresh()           // re-fetch server components
router.prefetch("/path")   // prefetch route
```

- usePathname() — Get Current Path, alternative of react router `navLink`: 

```tsx
"use client";

import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  return 
    <Link href="/about" className={pathname === "/about" ? "text-blue-500" : ""}>
      About
    </Link>;
}
```

- redirect(): for Server Components: 

```tsx
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await getUser();

  if (!user) {
    redirect("/login");
  }

  return <div>Dashboard</div>;
}
```

# Dynamic Routes: 


```tsx
src/app/all-posts/page.tsx
import Link from "next/link"

type postDataTypes = {
    userId: number,
    id: number,
    title: string,
    body: string,
}

export default async function AllPost() {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts')
    const data: postDataTypes[] = await res.json()
    return (
        <div>
            <h1>ALL Posts</h1>
            <ul>

                {data?.map(singleData => <li className="text-center my-5" key={singleData.id}>
                    {singleData.id} | {singleData.title} | <Link href={`/all-posts/${singleData.id}`}><button className="btn">Details</button></Link>
                </li>)}
            </ul>

        </div>
    )
}
```

```tsx
// src/app/all-posts/[id]/page.tsx
import React from 'react'

type PageProps = {
    params: Promise<{ id: string }>
}

export default async function AllPostsDetails({ params }: PageProps) {

    const { id } = await params


    const res = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    const data = await res.json()


    return (
        <div className='text-center my-10'>
            <p>id: {data.id}</p>
            <p>title: {data.title}</p>
            <p>body: {data.body}</p>
        </div>
    )
}
```

# Metadata: 

- Static Metadata (Simplest Way):

```tsx
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home Page',
  description: 'This is my homepage',
}

export default function HomePage() {
  return <h1>Home</h1>
}
```

What this generates:

```tsx
<title>Home Page</title>
<meta name="description" content="This is my homepage" />
```

- Global Metadata (Layout Level): 

```ts
// app/layout.tsx

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Tamim Dev',
    template: '%s | Tamim Dev',
  },
  description: 'Full-stack developer portfolio',
}
```

Now:
  - Page with title: "Blog" → Blog | Tamim Dev
  - Page without title → Tamim Dev

- Dynamic Metadata (SEO for Dynamic Routes): 

```tsx
// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {

  const res = await fetch(`https://api.example.com/posts/${params.slug}`)
  const post = await res.json()

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export default async function BlogDetails({ params }: Props) {
  return <div>{params.slug}</div>
}
```


# Api Routes: 

```tsx
// src/lib/dbConnect.ts
import { MongoClient, ServerApiVersion } from "mongodb";


export function dbConnect(collectionName: string) {
    const uri = process.env.MONGO_URI

    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    })

    return client.db(process.env.DB_NAME).collection(collectionName)
}
```

```tsx
// src/app/api/items/routes
// http://localhost:3000/api/items

import { dbConnect } from "@/lib/dbConnect"
import { NextRequest } from "next/server"

export async function GET() {
    const result = dbConnect("itemsCollection").find({}).toArray()
    return Response.json(result)
}

export async function POST(req: NextRequest) {
    const postedData = await req.json()
    const result = dbConnect("itemsCollection").insertOne(postedData)
    return Response.json({ result })
}
```

```tsx
// src/app/api/items/[id]/routes
// http://localhost:3000/api/items/id

import { dbConnect } from "@/lib/dbConnect"
import { ObjectId } from "mongodb"
import { NextRequest } from "next/server"


type PageProps = {
    params: Promise<{ id: string }>
}


export async function GET(req: NextRequest, { params }: PageProps) {
    const p = await params
    const result = dbConnect("itemsCollection").findOne({ _id: new ObjectId(p.id) })

    return Response.json(result)
}

export async function DELETE(req: NextRequest, { params }: PageProps) {
    const p = await params
    const result = dbConnect("itemsCollection").deleteOne({ _id: new ObjectId(p.id) })

    return Response.json(result)
}


export async function PATCH(req: NextRequest, { params }: PageProps) {
    const p = await params
    const data = req.json()
    const filter = { _id: new ObjectId(p.id) }
    const updatedData = {
        $set: {
            data
        }
    }
    const result = dbConnect("itemsCollection").updateOne(filter, updatedData)

    return Response.json(result)
}
```