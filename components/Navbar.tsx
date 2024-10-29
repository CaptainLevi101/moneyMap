'use client'
import React, { useState } from 'react'
import { Logo, MobileLogo } from './Logo'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from './ui/button'
import Link from 'next/link'
import { ThemeSwitcherBtn } from './ThemeSwitcherBtn'
import { UserButton } from '@clerk/nextjs'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet'
import { Menu } from 'lucide-react'

const Navbar = () => {
    return (
        <>
            {/* this navbar will have a desktop version as wella s mobile version   */}
            <DesktopNavbar />
            <MobileNavBar />
        </>
    )
}


const items = [
    { label: "Dashboard", link: '/' },
    { label: "Transactions", link: '/transactions' },
    { label: "Manage", link: '/manage' },
]
function DesktopNavbar() {
    return (
        <div className='hidden md:block border-seperate borer-b bg-background'>
            <nav className='px-8 container flex items-center justify-between '>
                <div className='flex items-center h-[80px] min-h-[60px] gap-x-4'>
                    <Logo />
                    <div className="flex h-full">
                        {items.map((item => (
                            <NavbarItem
                                key={item.label}
                                label={item.label}
                                link={item.link}
                            />
                        )))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <ThemeSwitcherBtn />
                    <UserButton afterSignOutUrl='/sign-in' />
                </div>

            </nav>
        </div>
    )
}
function MobileNavBar() {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className='md:hidden block border-separate w-auto
        bg-background'>
            <nav className='container flex items-center justify-between px-8'>
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild>
                        <Button variant={"ghost"} size={"icon"}>
                            <Menu/>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[50%] sm:w-[540px]" side="left">
                        <div className='flex flex-col gap-1 pt-4'>
                            {items.map((item)=>(
                                <NavbarItem
                                 key={item.label}
                                link={item.link}
                                label={item.label}
                                clickCallback={()=>setIsOpen((prev)=>!prev)}
                                />
                            ))}
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="flex h-[80px] min-h-[60px] items-center gap-x-4">
                  <MobileLogo/>
                  </div>
                  <div className="flex items-center gap-2">
                    <ThemeSwitcherBtn/>
                    <UserButton afterSignOutUrl='/sign-in'/>
                  </div>
            </nav>
        </div>
    )
}

function NavbarItem({ link, label,clickCallback }: { link: string, label: string,clickCallback?:()=>void }) {
    const pathname = usePathname();
    const isActive = pathname === link;
   
    return (
        <div className='relative flex items-center'>
            <Link
                href={link}
                className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-lg text-muted-foreground hover:text-foreground",
                    isActive && "text-foreground"
                )}
                onClick={()=>{
                    if(clickCallback)clickCallback();
                }}
                >
                {label}
            </Link>
            {isActive && (
                <div className='absolute -bottom-[2px] hidden left-1/2 w-[80%] -translate-x-1/2 rounded-xl bg-foreground md:block h-[2px]'>
                </div>
            )}
        </div>
    )
}

export default Navbar
