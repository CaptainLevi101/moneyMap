import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server"; // Import Next.js specific Response

export async function GET() {

  
  const user = await currentUser();
  
  if (!user) {
    redirect('/sign-in');
  }
 

  let userSettings = await prisma.userSettings?.findUnique({
    where: {
      userId: user.id,
    }
  });

  if (!userSettings) {
    userSettings = await prisma.userSettings.create({
      data: {
        userId: user.id,
        currency: "USD"
      }
    });
  }
  console.log(userSettings);

  // Revalidate the page that uses the user currency
  revalidatePath("/");

  return NextResponse.json(userSettings); // Correctly send JSON response
}
