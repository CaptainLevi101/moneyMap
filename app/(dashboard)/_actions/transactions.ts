
"use server"

import prisma from "@/lib/prisma";
import { CreateTransactionSchema, CreateTransactionSchemaType } from "@/schema/transaction";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function CreateTransactions(form:CreateTransactionSchemaType){
  const parsedBody=CreateTransactionSchema.safeParse(form);
  if(!parsedBody.success){
    throw new Error(parsedBody.error.message);
  }

  const user=await currentUser();
  if(!user){
    redirect('/sign-in');
  }
  const {amount,category,date,description,type}=parsedBody.data;
  const categoryRow=await prisma.category.findFirst({
    where:{
        userId:user.id,
        name:category,
        type
    }
  });
  if(!categoryRow){
    throw new Error("category not found");
  }

  // don;t try to make confusion among this $transaction and the 
  // table transaction both are different

  // month table 
  // year tabel 
  // and date table 
  // those are two different things

  await prisma.$transaction([
    prisma.transaction.create({
        data:{
            userId:user.id,
            amount,
            date,
            description:description || "",
            type,
            category:categoryRow.name,
            categoryIcon:categoryRow.icon
        },
    }),
    // update aggregate table

    prisma.monthHistory.upsert({
        where:{
            day_month_year_userId:{
                userId:user.id,
                day:date.getUTCDate(), // date without the time zone
                month:date.getUTCMonth(),
                year:date.getUTCFullYear(),
            },
        },
        create:{
            userId:user.id,
            day:date.getUTCDate(), // date without the time zone
            month:date.getUTCMonth(),
            year:date.getUTCFullYear(),
            expense:type==='expense'?amount:0,
            incomes:type==='income'?amount:0
        },
        update:{
             expense:{
                increment:type==="expense"?amount:0,
             },
             incomes:{
                increment:type==="income"?amount:0,
             }
        }
    }),
    // update year aggregate

    prisma.yearHistory.upsert({
        where:{
            month_year_userId:{
                userId:user.id, // date without the time zone
                month:date.getUTCMonth(),
                year:date.getUTCFullYear(),
            },
        },
        create:{
            userId:user.id, // date without the time zone
            month:date.getUTCMonth(),
            year:date.getUTCFullYear(),
            expense:type==='expense'?amount:0,
            incomes:type==='income'?amount:0
        },
        update:{
             expense:{
                increment:type==="expense"?amount:0,
             },
             incomes:{
                increment:type==="income"?amount:0,
             }
        }
    })




  ])


}