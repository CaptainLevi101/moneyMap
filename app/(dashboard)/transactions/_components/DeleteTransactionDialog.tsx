'use client';
import React from 'react'
import { TransactionHistoryRow } from './TransactionTable';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DeleteTransaction } from '../_actions/DeleteTransaction';

interface Props{
   open:boolean;
   setOpen:(open:boolean)=>void,
   transaction:TransactionHistoryRow;
}


const DeleteTransactionDialog = ({open,setOpen,transaction}:Props) => {
    const queryClient = useQueryClient();


    const deleteMutation = useMutation({
        mutationFn: DeleteTransaction,
        onSuccess: async () => {
            toast.success("transaction deleted successfully", {
                id: transaction.userId
            })
            await queryClient.invalidateQueries({
                queryKey: ["transactions"]
            })
        },
        onError: () => {
            toast.error("Something went wrong", {
                id: transaction.userId
            })
        }
    })


    return (
        <AlertDialog open={open} onOpenChange={setOpen}> 
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure</AlertDialogTitle>
                    <AlertDialogDescription>This action can't be undone. This will permenantley delete your transaction</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={()=>{
                        toast.loading("deleting Category",{
                            id:transaction.userId
                        });
                        deleteMutation.mutate({
                            userId:transaction.userId,
                            createdAt:transaction.createdAt,
                            updatedAt:transaction.updatedAt
                        })
                    }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
  )
}

export default DeleteTransactionDialog
