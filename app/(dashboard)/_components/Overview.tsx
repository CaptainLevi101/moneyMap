"use client";
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { MAX_DATE_RANGE_DAYS } from '@/lib/constants';
import { UserSettings } from '@prisma/client';
import { differenceInDays, startOfMonth } from 'date-fns';
import React, { useState } from 'react'
import { toast } from 'sonner';
import StatsCards from './StatsCards';
import CategoriesStats from './CategoriesStats';

interface Props {
    userSettings: UserSettings
}

const Overview = ({ userSettings }: Props) => {
    const [dateRange, setDateRange] = useState<{ from: Date, to: Date }>({
        from: startOfMonth(new Date),
        to: new Date()
    });


    return (
        <>
        <div className='container flex flex-wrap justify-between gap-2 p-6 w-full'>
            <h2 className="text-3xl font-bold">Overview</h2>
            <div className="flex items-center gap-3">
                <DateRangePicker
                    initialDateFrom={dateRange.from}
                    initialDateTo={dateRange.to}
                    showCompare={false}
                    onUpdate={(values) => {
                        const { from, to } = values.range
                        // we update the date range only if both dates are being set
                        if (!from || !to) return;
                        if (differenceInDays(to, from) > MAX_DATE_RANGE_DAYS) {
                            toast.error(`The selected date range is too big. Max allowed range is ${MAX_DATE_RANGE_DAYS} days`);
                            return;
                        }
                        setDateRange({ from, to });
                    }}
                    />
        </div>
        </div>
        <div className='flex gap-2 flex-col p-6 w-full'>
        <StatsCards
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
        />
        <CategoriesStats
        userSettings={userSettings}
        from={dateRange.from}
        to={dateRange.to}
        />
        </div>

        </>
    )
}

export default Overview
