import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';
import React from 'react'
import CreateTransactionDialog from './_components/CreateTransactionDialog';
import Overview from './_components/Overview';
import History from './_components/History';

async function page(){
  const user=await currentUser();
  if(!user){
    redirect('/sign-in');
  }
  const userSettings=await prisma.userSettings.findUnique({
    where:{
      userId:user.id
    }
  })
  if(!userSettings){
    redirect('/wizard');
  }
  return (
    <div className='h-full bg-background flex flex-col gap-4 max-w-full'>
      <div className="border-b bg-card w-full">
        <div className="container flex flex-wrap gap-6 p-8
        justify-between items-center">
          <p className="text-3xl font-bold">
            Hello, {user.firstName}!
          </p>
          <div className="flex items-center gap-3">
            <CreateTransactionDialog 
              trigger={
                <Button variant={"outline"}
                className='border-emerald-100 bg-emerald-950
                text-white hover:bg-emerald-700 hover:text-white'>
                  New Income🤑
                </Button>
              }
            type='income'>
           
            </CreateTransactionDialog>
            <CreateTransactionDialog
            trigger={
              <Button variant={"outline"}
              className='border-rose-100 bg-rose-950
              text-white hover:bg-rose-700 hover:text-white'>
                 New expense😒
              </Button>
            }
             type='expense'>
            </CreateTransactionDialog>
           
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings}/>
      <History userSettings={userSettings}/>
    </div>
  )
}

export default page
