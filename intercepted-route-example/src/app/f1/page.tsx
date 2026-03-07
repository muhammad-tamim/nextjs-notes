// src/app/f1/page.tsx

import Link from 'next/link'
import React from 'react'

export default function F1() {
    return (
        <div>
            <h1>F1 page</h1>
            <Link href={'/f1/f2'} className='text-blue-500'>F2</Link>
            <Link href={'/f3'} className='text-blue-500'>F3</Link>
        </div>
    )
}
