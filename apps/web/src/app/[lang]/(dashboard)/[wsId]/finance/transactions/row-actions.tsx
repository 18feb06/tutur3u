'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { Transaction } from '@/types/primitives/Transaction';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  row: Row<Transaction>;
  setTransaction: (value: Transaction | undefined) => void;
}

export function TransactionRowActions(props: Props) {
  const { t } = useTranslation();

  const router = useRouter();
  const transaction = props.row.original;

  const deleteTransaction = async () => {
    const res = await fetch(
      `/api/workspaces/${transaction.ws_id}/transactions/${transaction.id}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: 'Failed to delete workspace transaction',
        description: data.message,
      });
    }
  };

  if (!transaction.id || !transaction.ws_id) return null;

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => props.setTransaction(transaction)}>
            {t('common:edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={deleteTransaction}
            disabled={
              transaction.id === undefined || transaction.ws_id === undefined
            }
          >
            {t('common:delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
