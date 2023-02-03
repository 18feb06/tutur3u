import { ReactElement, useEffect } from 'react';
import { PageWithLayoutProps } from '../types/PageWithLayoutProps';
import Layout from '../components/layout/Layout';
import { Organization } from '../types/primitives/Organization';
import { openModal } from '@mantine/modals';
import OrgEditForm from '../components/forms/OrgEditForm';
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useOrgs } from '../hooks/useOrganizations';
import { mutate } from 'swr';
import LoadingIndicator from '../components/common/LoadingIndicator';
import { useAppearance } from '../hooks/useAppearance';
import { showNotification } from '@mantine/notifications';
import OrganizationInviteSnippet from '../components/notifications/OrganizationInviteSnippet';
import OrgPreviewCard from '../components/cards/OrgPreviewCard';
import { GetServerSidePropsContext } from 'next';
import { useUserList } from '../hooks/useUserList';
import { useUserData } from '../hooks/useUserData';
import HeaderX from '../components/metadata/HeaderX';

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const supabase = createServerSupabaseClient(ctx);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };

  const isDev = process.env.NODE_ENV === 'development';

  if (!isDev)
    return {
      redirect: {
        destination: '/calendar',
        permanent: false,
      },
    };

  return {
    props: {
      initialSession: session,
      user: session.user,
    },
  };
};

const Home: PageWithLayoutProps = () => {
  const { setRootSegment, changeLeftSidebarSecondaryPref } = useAppearance();
  const { updateUsers } = useUserList();
  const { data } = useUserData();

  useEffect(() => {
    changeLeftSidebarSecondaryPref('hidden');

    setRootSegment({
      content: 'Home',
      href: '/',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data) updateUsers([data]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const { isLoading, orgs, createOrg } = useOrgs();

  const maxOrgs = 5;

  useEffect(() => {
    mutate('/api/orgs');
  }, []);

  const addOrg = (org: Organization) => createOrg(org);

  const showEditOrgModal = (org?: Organization) => {
    openModal({
      title: 'New organization',
      centered: true,
      children: <OrgEditForm org={org} onSubmit={addOrg} />,
    });
  };

  const acceptInvite = async (org: Organization) => {
    const response = await fetch(`/api/orgs/${org.id}/invites`, {
      method: 'POST',
    });

    if (response.ok) {
      mutate('/api/orgs');
      showNotification({
        title: `Accepted invite to ${org.name}`,
        message: 'You can now access this organization',
      });
    } else {
      showNotification({
        title: `Failed to accept invite to ${org.name}`,
        message: 'Please try again later',
      });
    }
  };

  const declineInvite = async (org: Organization) => {
    const response = await fetch(`/api/orgs/${org.id}/invites`, {
      method: 'DELETE',
    });

    if (response.ok) {
      mutate('/api/orgs');
    } else {
      showNotification({
        title: `Failed to decline invite to ${org.name}`,
        message: 'Please try again later',
      });
    }
  };

  return (
    <div className="p-4 md:p-8">
      <HeaderX label="Home" />
      {isLoading ? (
        <div className="flex items-center justify-center">
          <LoadingIndicator className="h-8" />
        </div>
      ) : (
        <>
          {orgs?.invited?.length > 0 && (
            <div className="mb-16 grid gap-8">
              {orgs?.invited?.map((org) => (
                <OrganizationInviteSnippet
                  key={org.id}
                  org={org}
                  onAccept={acceptInvite}
                  onDecline={declineInvite}
                />
              ))}
            </div>
          )}

          {orgs?.current?.length > 0 ? (
            <div className="grid gap-8">
              {orgs?.current
                // sort org with nill uuid first, since it's the root org
                // and should be displayed first
                ?.sort((a) =>
                  a.id === '00000000-0000-0000-0000-000000000000' ? -1 : 1
                )
                ?.map((org) => (
                  <OrgPreviewCard key={org.id} org={org} />
                ))}
            </div>
          ) : (
            <div className="flex flex-col">
              <div className="flex flex-row">
                You are not a member of any organizations.
              </div>
            </div>
          )}

          <button
            className={`mt-8 w-full rounded px-8 py-4 font-semibold md:w-fit ${
              orgs?.current?.length < maxOrgs
                ? 'bg-blue-300/20 text-blue-300 hover:bg-blue-300/30'
                : 'cursor-not-allowed bg-gray-500/10 text-gray-500/50'
            } transition duration-300`}
            onClick={() =>
              orgs?.current?.length < maxOrgs ? showEditOrgModal() : null
            }
          >
            {orgs?.current?.length < maxOrgs
              ? 'New organization'
              : 'Maximum organizations reached'}
          </button>
        </>
      )}
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;