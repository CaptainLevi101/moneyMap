import prisma from "@/lib/prisma";
import { OverviewQuerySchema } from "@/schema/overview";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function GET(req:Request){
   const user=await currentUser();
   if(!user){
      redirect('/sign-in');
   }
   const {searchParams}=new URL(req.url);
   const from=searchParams.get("from");
   const to=searchParams.get("to");

   const queryParams=OverviewQuerySchema.safeParse({from,to});
   if(!queryParams.success){
    throw new Error(queryParams.error.message);
   }

   const stats=await getCategoriesSats(
     user.id,
     queryParams.data.from,
     queryParams.data.to,
   )
   return Response.json(stats);
}

export type getCategoryStatsResponseType=Awaited<ReturnType<typeof getCategoriesSats>>

async function getCategoriesSats(userId:string,from:Date,to:Date){
    const stats=await prisma.transaction.groupBy({
        by:["type","category","categoryIcon"],
        where:{
            userId,
            date:{
                gte:from,
                lte:to
            }
        },
        _sum:{
            amount:true
        },
        orderBy:{
            _sum:{
                amount:"desc"
            }
        }
    })
    return stats
}