import useTranslation from 'next-translate/useTranslation';
import SidebarLink from '../SidebarLink';
import {
  ArchiveBoxIcon,
  BanknotesIcon,
  BeakerIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  CodeBracketSquareIcon,
  HomeIcon,
  RectangleStackIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline';
import { WorkspacePreset } from '../../../types/primitives/WorkspacePreset';
import { useUser } from '@supabase/auth-helpers-react';
import { DEV_MODE, ROOT_WORKSPACE_ID } from '../../../constants/common';
import { useWorkspaces } from '../../../hooks/useWorkspaces';

interface Props {
  wsId: string;
  wsPreset: WorkspacePreset;
  sidebarOpened: boolean;
}

const SidebarLinkList = ({ wsId, wsPreset, sidebarOpened }: Props) => {
  const { t } = useTranslation('sidebar-tabs');
  const { ws } = useWorkspaces();

  const user = useUser();

  const currentRole = ws?.role || 'MEMBER';
  const adminLevel = currentRole === 'ADMIN' || currentRole === 'OWNER';

  const home = t('home');
  const calendar = t('calendar');
  const tasks = t('tasks');
  const documents = t('documents');
  const users = t('users');
  const healthcare = t('healthcare');
  const inventory = t('inventory');
  const classes = t('classes');
  const finance = t('finance');
  const databases = t('databases');
  const infrastructure = t('infrastructure');
  const migrations = t('migrations');

  const isRootWs = wsId === ROOT_WORKSPACE_ID;

  return (
    <div className="mx-2 mb-2 flex flex-col gap-1">
      <SidebarLink
        href={`/${wsId}`}
        activeIcon={<HomeIcon className="w-5" />}
        label={home}
        showTooltip={!sidebarOpened}
        exactMatch
        classNames={{
          root: 'hidden md:block',
        }}
      />

      <SidebarLink
        href={`/${wsId}/calendar`}
        activeIcon={<CalendarDaysIcon className="w-5" />}
        label={calendar}
        showTooltip={!sidebarOpened}
        classNames={{
          root: 'hidden md:block',
        }}
      />

      <SidebarLink
        href={`/${wsId}/boards`}
        activeIcon={<CheckCircleIcon className="w-5" />}
        label={tasks}
        showTooltip={!sidebarOpened}
      />

      {(wsPreset === 'ALL' || wsPreset !== 'PHARMACY') && (
        <SidebarLink
          href={`/${wsId}/documents`}
          activeIcon={<ClipboardDocumentListIcon className="w-5" />}
          label={documents}
          showTooltip={!sidebarOpened}
        />
      )}

      <SidebarLink
        href={`/${wsId}/users`}
        activeIcon={<UserGroupIcon className="w-5" />}
        label={users}
        showTooltip={!sidebarOpened}
      />

      {(wsPreset === 'ALL' || wsPreset === 'PHARMACY') && (
        <SidebarLink
          href={`/${wsId}/healthcare`}
          activeIcon={<BeakerIcon className="w-5" />}
          label={healthcare}
          showTooltip={!sidebarOpened}
        />
      )}

      <SidebarLink
        href={`/${wsId}/inventory`}
        activeIcon={<ArchiveBoxIcon className="w-5" />}
        label={inventory}
        showTooltip={!sidebarOpened}
      />

      {(wsPreset === 'ALL' || wsPreset === 'EDUCATION') && (
        <SidebarLink
          href={`/${wsId}/classes`}
          activeIcon={<RectangleStackIcon className="w-5" />}
          label={classes}
          showTooltip={!sidebarOpened}
          disabled
        />
      )}

      <SidebarLink
        href={`/${wsId}/finance`}
        activeIcon={<BanknotesIcon className="w-5" />}
        label={finance}
        showTooltip={!sidebarOpened}
        classNames={{
          root: 'hidden md:block',
        }}
      />

      <SidebarLink
        href={`/${wsId}/databases`}
        activeIcon={<CircleStackIcon className="w-5" />}
        label={databases}
        showTooltip={!sidebarOpened}
        disabled
      />

      {isRootWs && user?.email?.endsWith('@tuturuuu.com') && adminLevel && (
        <>
          <SidebarLink
            href={`/${wsId}/infrastructure`}
            activeIcon={<WrenchScrewdriverIcon className="w-5" />}
            label={infrastructure}
            showTooltip={!sidebarOpened}
          />

          {DEV_MODE && (
            <SidebarLink
              href={`/${wsId}/migrations`}
              activeIcon={<CodeBracketSquareIcon className="w-5" />}
              label={migrations}
              showTooltip={!sidebarOpened}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SidebarLinkList;
