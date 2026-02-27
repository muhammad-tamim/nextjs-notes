- [Linking and Navigation:](#linking-and-navigation)
- [Dynamic Routes:](#dynamic-routes)


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