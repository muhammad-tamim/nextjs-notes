- [Metadata:](#metadata)




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


