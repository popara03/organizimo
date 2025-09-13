import React from 'react'

export default function Footer(){
  return (
    <footer className="mt-auto w-full h-[40px] bg-primary flex justify-center items-center border-t border-secondary/10">
        <p className="font-jersey text-secondary !text-sm">© {new Date().getFullYear()} Organizimo. All rights reserved.</p>
    </footer>
  )
}