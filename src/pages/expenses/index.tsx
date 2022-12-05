import { ReactElement, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import { useAppearance } from '../../hooks/useAppearance';
import { useUserList } from '../../hooks/useUserList';
import { PageWithLayoutProps } from '../../types/PageWithLayoutProps';

const ExpensesPage: PageWithLayoutProps = () => {
  const { setRootSegment, changeLeftSidebarSecondaryPref } = useAppearance();
  const { clearUsers } = useUserList();

  useEffect(() => {
    changeLeftSidebarSecondaryPref('hidden');
    setRootSegment({
      content: 'Expenses',
      href: '/expenses',
    });

    clearUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex h-full min-h-full w-full items-center justify-center rounded-lg border border-purple-300/20 bg-purple-300/10 text-6xl font-semibold text-purple-300">
      Under construction 🚧
    </div>
  );
};

ExpensesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ExpensesPage;
