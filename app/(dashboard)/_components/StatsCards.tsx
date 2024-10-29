'use client';
import { getBalancedStatsResponseType } from '@/app/api/stats/balance/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card } from '@/components/ui/card';
import { DateToUTCDate, getFormatterForCurrency } from '@/lib/helpers';
import { UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import { TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import React, { ReactNode, useCallback, useMemo } from 'react'
import CountUp from 'react-countup';

interface Props {
    userSettings: UserSettings,
    from: Date,
    to: Date
}

const StatsCards = ({ userSettings, from, to }: Props) => {

    const statsQuery = useQuery<getBalancedStatsResponseType>({
        queryKey: ['overview', 'stats', from, to],
        queryFn: () => fetch(`/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`).then(
            res => res.json()
        )

    })
    const formatter = useMemo(() => {
        return getFormatterForCurrency(userSettings.currency)
    }, [userSettings.currency])

    const income = statsQuery.data?.income || 0
    const expense = statsQuery.data?.expense || 0

    const balance = income - expense
    console.log("income",income);
    console.log("expense",expense);


    return (
        <div className='relative flex w-full flex-wrap
    gap-8 md:flex-nowrap justify-between items-center'>
            <SkeletonWrapper fullWidth isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    value={income}
                    title="Income"
                    icon={
                        <TrendingUp className='h-12 w-12 items-center rounded-lg
            text-emerald-500 bg-emerald-400/10
            '/>
                    }
                />
            </SkeletonWrapper>
            <SkeletonWrapper fullWidth isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    value={expense}
                    title="Expense"
                    icon={
                        <TrendingDown className='h-12 w-12 items-center rounded-lg
            text-rose-500 bg-rose-400/10
            '/>
                    }
                />
            </SkeletonWrapper>
            <SkeletonWrapper fullWidth isLoading={statsQuery.isFetching}>
                <StatCard
                    formatter={formatter}
                    value={balance}
                    title="Balance"
                    icon={
                        <Wallet className='h-12 w-12 items-center rounded-lg
            text-violet-500 bg-violet-400/10
            '/>
                    }
                />
            </SkeletonWrapper>
        </div>
    )
}

export default StatsCards


function StatCard(
    { formatter, value, title, icon }: {
        formatter: Intl.NumberFormat,
        icon: ReactNode,
        title: string,
        value: number
    }) {
    const formatFn = useCallback((value: number) => {
        return formatter.format(value);
    }, [formatter])


    return (
        <>
            <Card className='flex h-24 w-full items-center gap-2 p-4'>
                {icon}
                <div className="flex flex-col items-start gap-0">
                <p className="text-muted-foreground">{title}</p>
                <CountUp
                preserveValue
                redraw={false}
                end={value}
                decimals={2}
                formattingFn={formatFn}
                className='text-2xl'
                />
                </div>
            </Card>
           

         </>
    )

}