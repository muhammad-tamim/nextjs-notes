- [Linking and Navigation:](#linking-and-navigation)


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
