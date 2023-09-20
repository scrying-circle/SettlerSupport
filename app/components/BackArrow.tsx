import Link from "next/link";
import React from "react";
export default function BackArrow(props: { href: string }) {
    let { href } = props;
    return <Link href={href} className='absolute top-10 left-10'>←</Link>
}