<h1 align="center">Next.js Notes</h1>

- [Setup:](#setup)
- [Introduction:](#introduction)
    - [What is Next.js:](#what-is-nextjs)
    - [Key Features of Next.js:](#key-features-of-nextjs)
    - [Components in Next.js:](#components-in-nextjs)
    - [Difference Between Server Component and Client Component:](#difference-between-server-component-and-client-component)

# Setup: 

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

- Server Component: A React component that runs on the server and sends pre-rendered HTML.

- Client Component: A React component that runs in the browser and the browser downloads and executes the JavaScript to render the HTML adn add ui interactivity to the page.

Note: In Next.js, components are server components by default. To make a component a client component, you need to add the "use client" directive at the top of the component file.


### Difference Between Server Component and Client Component:  

| Feature                                             | Server Component          | Client Component                  |
| --------------------------------------------------- | ------------------------- | --------------------------------- |
| **Runs on**                                         | Server only               | Browser only                      |
| **Can use `useState`/`useEffect`**                  | No                        | Yes                               |
| **Can use browser APIs (`window`, `localStorage`)** | No                        | Yes                               |
| **Can fetch data directly from database or API**    | Yes                       | Only via API route                |
| **Default in Next.js 13+**                          | Yes                       | Must add `"use client"`           |
| **Use case**                                        | server related works only | UI interaction related works only |



