import Link from 'next/link'
import React from 'react'

export default function InnerF2() {
    return (
        <div>
            <h1>Inner F2 page</h1>
            <Link href={'/f5'} className='text-blue-500'>F5</Link>
        </div>
    )
}
