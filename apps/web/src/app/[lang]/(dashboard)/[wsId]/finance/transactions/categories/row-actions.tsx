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
import { TransactionCategory } from '@/types/primitives/TransactionCategory';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  row: Row<TransactionCategory>;
  setCategory: (value: TransactionCategory | undefined) => void;
}

export function TransactionCategoryRowActions(props: Props) {
  const { t } = useTranslation();

  const router = useRouter();
  const category = props.row.original;

  const deleteCategory = async () => {
    const res = await fetch(
      `/api/workspaces/${category.ws_id}/transactions/categories/${category.id}`,
      {
        method: 'DELETE',
      }
    );

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      toast({
        title: 'Failed to delete workspace category',
        description: data.message,
      });
    }
  };

  if (!category.id || !category.ws_id) return null;

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
          <DropdownMenuItem onClick={() => props.setCategory(category)}>
            {t('common:edit')}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={deleteCategory}
            disabled={category.id === undefined || category.ws_id === undefined}
          >
            {t('common:delete')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
