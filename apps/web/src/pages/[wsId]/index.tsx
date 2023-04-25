import { useRouter } from 'next/router';
import { ReactElement, useEffect } from 'react';
import useSWR from 'swr';
import NestedLayout from '../../components/layouts/NestedLayout';
import HeaderX from '../../components/metadata/HeaderX';
import { Divider } from '@mantine/core';
import { enforceHasWorkspaces } from '../../utils/serverless/enforce-has-workspaces';
import { useSegments } from '../../hooks/useSegments';

export const getServerSideProps = enforceHasWorkspaces;

const WorkspaceHomePage = () => {
  const router = useRouter();

  const { wsId } = router.query;

  const { data, error } = useSWR(wsId ? `/api/workspaces/${wsId}` : null);

  const isLoading = !data && !error;

  const { setRootSegment } = useSegments();

  useEffect(() => {
    setRootSegment(
      [
        {
          content: data?.name ?? 'Loading...',
          href: `/${data?.id}`,
        },
        {
          content: 'Home',
          href: `/${data?.id}`,
        },
      ],
      [data?.id]
    );

    return () => {
      setRootSegment([]);
    };
  }, [setRootSegment, data]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="pb-20">
      <HeaderX label={`Home – ${data?.name || 'Unnamed Workspace'}`} />

      {wsId && (
        <>
          <div className="rounded-lg bg-zinc-900 p-4">
            <h1 className="text-2xl font-bold">Home</h1>
            <p className="text-zinc-400">
              A quick summary of the{' '}
              <span className="font-semibold text-zinc-200">
                {data?.name || 'Unnamed Workspace'}
              </span>{' '}
              workspace and its progress.
            </p>
          </div>
          <Divider className="my-4" />
        </>
      )}
    </div>
  );
};

WorkspaceHomePage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout mode="workspace">{page}</NestedLayout>;
};

export default WorkspaceHomePage;
