'use server';

import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function DeleteTransaction({userId,createdAt,updatedAt}:{
    userId:string,
    createdAt:Date,
    updatedAt:Date
}){
    const user=await currentUser();
    if(!user){
        redirect('/sign-in');
    }
    const transaction = await prisma.transaction.findFirst({
        where: {
            userId,
            createdAt,
            updatedAt
        }
    });

    if(!transaction){
        throw new Error("bad request")
    }
    await prisma.$transaction([
        // delete transaction from db 
        prisma.transaction.delete({
            where: {
                userId_createdAt_updatedAt: {
                    userId,
                    createdAt,
                    updatedAt
                }
            }
        }),
        prisma.monthHistory.update({
            where:{
                day_month_year_userId:{
                      userId,
                      day:transaction.date.getUTCDate(),
                      month:transaction.date.getUTCMonth(),
                      year:transaction.date.getUTCFullYear()
                }
            },
            data:{
                ...(transaction.type==='expense' && {
                    expense:{
                        decrement:transaction.amount
                    }
                }),
                ...(transaction.type==='incomes' && {
                    incomes:{
                        decrement:transaction.amount
                    }
                })
            }
        }),
        prisma.yearHistory.update({
            where:{
                month_year_userId:{
                      userId,
                      month:transaction.date.getUTCMonth(),
                      year:transaction.date.getUTCFullYear()
                }
            },
            data:{
                ...(transaction.type==='expense' && {
                    expense:{
                        decrement:transaction.amount
                    }
                }),
                ...(transaction.type==='incomes' && {
                    incomes:{
                        decrement:transaction.amount
                    }
                })
            }
        }),

    ])
}