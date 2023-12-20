import React from 'react';
import Image from 'next/image';
export default function GitHubButton() {
    return(
        <div className='rounded-lg w-12 h-12 absolute bottom-5 left-5 bg-white text-center flex justify-center'>
            <a href='https://github.com/scrying-circle/SettlerSupport'>
                <Image src='/github.png' alt='github.png' width='48' height='48'></Image>
            </a>
        </div>
    );
}