import useTranslation from 'next-translate/useTranslation';
import { Separator } from '@/components/ui/separator';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';
import { cookies } from 'next/headers';
import { DataTable } from '@/components/ui/custom/tables/data-table';
import { TaskBoard } from '@/types/primitives/TaskBoard';
import ProjectEditDialog from './_components/project-edit-dialog';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { projectColumns } from '@/data/columns/projects';

export const dynamic = 'force-dynamic';

interface Props {
  params: {
    wsId: string;
  };
  searchParams: {
    q?: string;
    page?: string;
    pageSize?: string;
  };
}

export default async function WorkspaceProjectsPage({
  params: { wsId },
  searchParams,
}: Props) {
  const { data: projects, count } = await getProjects(wsId, searchParams);
  const { t } = useTranslation('ws-projects');

  return (
    <>
      <div className="border-border bg-foreground/5 flex flex-col justify-between gap-4 rounded-lg border p-4 md:flex-row md:items-start">
        <div>
          <h1 className="text-2xl font-bold">{t('projects')}</h1>
          <p className="text-foreground/80">{t('description')}</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 md:flex-row">
          <ProjectEditDialog
            data={{
              ws_id: wsId,
            }}
            trigger={
              <Button>
                <Plus className="mr-2 h-5 w-5" />
                {t('create_project')}
              </Button>
            }
            submitLabel={t('create_project')}
          />
        </div>
      </div>
      <Separator className="my-4" />
      <DataTable
        columnGenerator={projectColumns}
        namespace="basic-data-table"
        data={projects}
        count={count}
        defaultVisibility={{
          id: false,
        }}
      />
    </>
  );
}

async function getProjects(
  wsId: string,
  {
    q,
    page = '1',
    pageSize = '10',
  }: { q?: string; page?: string; pageSize?: string }
) {
  const supabase = createServerComponentClient<Database>({ cookies });

  const queryBuilder = supabase
    .from('workspace_boards')
    .select('*', {
      count: 'exact',
    })
    .eq('ws_id', wsId)
    .order('created_at', { ascending: false });

  if (q) queryBuilder.ilike('name', `%${q}%`);

  if (
    page &&
    pageSize &&
    typeof page === 'string' &&
    typeof pageSize === 'string'
  ) {
    const parsedPage = parseInt(page);
    const parsedSize = parseInt(pageSize);
    const start = (parsedPage - 1) * parsedSize;
    const end = parsedPage * parsedSize;
    queryBuilder.range(start, end).limit(parsedSize);
  }

  const { data, error, count } = await queryBuilder;
  if (error) throw error;

  return { data, count } as { data: TaskBoard[]; count: number };
}
