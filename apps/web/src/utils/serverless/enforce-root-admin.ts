import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { GetServerSidePropsContext } from 'next';
import { ROOT_WORKSPACE_ID } from '../../constants/common';

export const enforceRootAdmin = async (ctx: GetServerSidePropsContext) => {
  const supabase = createPagesServerClient(ctx);

  const { wsId } = ctx.query;

  const isRootWorkspace = wsId === ROOT_WORKSPACE_ID;

  if (!isRootWorkspace) {
    return {
      notFound: true,
    };
  }

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

  if (!session.user?.email || !session.user.email.endsWith('@tuturuuu.com'))
    return {
      redirect: {
        destination: '/onboarding',
        permanent: false,
      },
    };

  const { data, error } = await supabase
    .from('workspace_members')
    .select('role')
    .eq('ws_id', ROOT_WORKSPACE_ID)
    .eq('user_id', session.user.id)
    .single();

  if (!data || error) {
    return {
      notFound: true,
    };
  }

  if (!(data.role === 'ADMIN' || data.role === 'OWNER'))
    return {
      notFound: true,
    };

  return {
    props: {},
  };
};