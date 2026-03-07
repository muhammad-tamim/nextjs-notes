// src/app/f1/f2/page.tsx

import Link from 'next/link'
import React from 'react'

export default function F2() {
    return (
        <div>
            <h1>F2 Page</h1>
            <Link href={'/f4'} className='text-blue-500'>F4</Link>
        </div>
    )
}
