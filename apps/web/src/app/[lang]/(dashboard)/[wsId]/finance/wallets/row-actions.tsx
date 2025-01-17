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
import { toast } from '../../../../../../components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { Wallet } from '@/types/primitives/Wallet';
import useTranslation from 'next-translate/useTranslation';

interface WalletRowActionsProps {
  row: Row<Wallet>;
  setWallet: (value: Wallet | undefined) => void;
}

export function WalletRowActions(props: WalletRowActionsProps) {
  const { t } = useTranslation();

  const router = useRouter();
  const wallet = props.row.original;

  const deleteWallet = async () => {
    const res = await fetch(
      `/api/workspaces/${wallet.ws_id}/wallets/${wallet.id}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: 'Failed to delete workspace wallet',
        description: data.message,
      });
    }
  };

  if (!wallet.id || !wallet.ws_id) return null;

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
          <DropdownMenuItem onClick={() => props.setWallet(wallet)}>
            {t('common:edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={deleteWallet}
            disabled={wallet.id === undefined || wallet.ws_id === undefined}
          >
            {t('common:delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
