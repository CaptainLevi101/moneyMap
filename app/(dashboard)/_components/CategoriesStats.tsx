'use client' 

import { getCategoryStatsResponseType } from '@/app/api/stats/categories/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { ScrollArea } from '@/components/ui/scroll-area';
import { DateToUTCDate, getFormatterForCurrency } from '@/lib/helpers';
import { TransactionType } from '@/lib/types';
import { UserSettings } from '@prisma/client'
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react'

interface Props{
    userSettings:UserSettings,
    from:Date;
    to:Date;
}

const CategoriesStats = ({userSettings,from,to}:Props) => {
    const statsQuery=useQuery<getCategoryStatsResponseType>({
        queryKey:["overview","stats","categories",from,to],
        queryFn:()=>fetch(`/api/stats/categories?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(
            (res)=>res.json()
        )
    })
    const formatter=useMemo(()=>{
          return getFormatterForCurrency(userSettings.currency)
    },[userSettings.currency])


  return (
    <div className='w-full flex flex-wrap gap-2 md:flex-nowrap'>
      <SkeletonWrapper fullWidth isLoading={statsQuery.isFetching}>
          <CategoriesCard 
            formatter={formatter}
            type="income"
            data={statsQuery.data || []}
           />
      </SkeletonWrapper>
      <SkeletonWrapper fullWidth isLoading={statsQuery.isFetching}>
          <CategoriesCard 
            formatter={formatter}
            type="expense"
            data={statsQuery.data || []}
           />
      </SkeletonWrapper>
    </div>
  )
}

export default CategoriesStats


function CategoriesCard({data,type,formatter}:{
    type:TransactionType,
    formatter:Intl.NumberFormat,
    data: getCategoryStatsResponseType
}){
 
    const filteredData=data.filter(el=>el.type===type);
    const totalAmount=filteredData.reduce((acc,el)=>acc+(el._sum?.amount ||0),0);
    return (
        <Card className='h-80 w-full col-span-60'>
            <CardHeader>
                <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground
                 md:grid-flow-col'>
                    {type=="income"?"Incomes":"Expenses"} by category
                 </CardTitle>
            </CardHeader>
            <div className="flex items-center justify-between gap-2">
                {filteredData.length==0 && (
                    <div className="flex h-60 w-full flex-col items-center justify-center">
                        No Data for selected Period
                        <p className="text-sm text-muted-foreground">
                            Try selecting a different period or try adding a new {type=='income'? "income":"expenses"}
                        </p>
                    </div>
                )}
                {filteredData.length>0 && (
                    <ScrollArea className='h-60 w-full px-4'>
                        <div className="flex w-full flex-col gap-4 p-4">
                            {filteredData.map((item)=>{
                                const amount=item._sum.amount || 0;
                                const percentage=(amount*100)/(totalAmount || amount);
                                return (
                                    <div 
                                    key={item.category}
                                    className="flex flex-col gap-2">
                                        <div className='flex items-center justify-between'>
                                        <span className="flex items-center text-gray-400">
                                            {item.categoryIcon} {item.category}
                                            <span className="ml-2 text-xs text-muted-foreground">
                                                {percentage.toFixed(0)}%
                                            </span>
                                        </span>
                                        <span className="text-sm text-gray-400">
                                            {formatter.format(amount)}
                                        </span>
                                    </div>
                                    <Progress value={percentage}
                                    indicator={type=="income"?"bg-emerald-500":"bg-red-500"}
                                    />
                               </div>
                                )
                            })}
                        </div>
                    </ScrollArea>
                )}
            </div>
        </Card>
    )

}
