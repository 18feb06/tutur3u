import { useEffect, useState } from 'react';
import { Divider, Switch } from '@mantine/core';
import ModeSelector, {
  Mode,
} from '../../../../../../components/selectors/ModeSelector';
import PlusCardButton from '../../../../../../components/common/PlusCardButton';
import { useLocalStorage } from '@mantine/hooks';
import GeneralItemCard from '../../../../../../components/cards/GeneralItemCard';
import { Diagnosis } from '../../../../../../types/primitives/Diagnosis';
import useSWR from 'swr';
import { useSegments } from '../../../../../../hooks/useSegments';
import { useWorkspaces } from '../../../../../../hooks/useWorkspaces';
import PaginationSelector from '../../../../../../components/selectors/PaginationSelector';
import PaginationIndicator from '../../../../../../components/pagination/PaginationIndicator';
import GeneralSearchBar from '../../../../../../components/inputs/GeneralSearchBar';

export default function HealthcareDiagnosesPage() {
  const { setRootSegment } = useSegments();
  const { ws } = useWorkspaces();

  useEffect(() => {
    setRootSegment(
      ws
        ? [
            {
              content: ws?.name || 'Tổ chức không tên',
              href: `/${ws.id}`,
            },
            { content: 'Khám bệnh', href: `/${ws.id}/healthcare` },
            {
              content: 'Chẩn đoán',
              href: `/${ws.id}/healthcare/diagnoses`,
            },
          ]
        : []
    );

    return () => setRootSegment([]);
  }, [ws, setRootSegment]);

  const [query] = useState('');
  const [activePage, setPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useLocalStorage({
    key: 'healthcare-diagnoses-items-per-page',
    defaultValue: 15,
  });

  const apiPath = ws?.id
    ? `/api/workspaces/${ws?.id}/healthcare/diagnoses?query=${query}&page=${activePage}&itemsPerPage=${itemsPerPage}`
    : null;

  // const countApi = ws?.id
  //   ? `/api/workspaces/${ws.id}/healthcare/diagnoses/count`
  //   : null;

  const { data: diagnoses } = useSWR<Diagnosis[]>(apiPath);
  // const { data: count } = useSWR<number>(countApi);

  const [mode, setMode] = useLocalStorage<Mode>({
    key: 'healthcare-diagnoses-mode',
    defaultValue: 'grid',
  });

  const [showDescription, setShowDescription] = useLocalStorage({
    key: 'healthcare-diagnoses-showDescription',
    defaultValue: false,
  });

  const [showNote, setShowNote] = useLocalStorage({
    key: 'healthcare-diagnoses-showNote',
    defaultValue: false,
  });

  if (!ws) return null;

  return (
    <div className="flex min-h-full w-full flex-col ">
      <div className="grid items-end gap-4 md:grid-cols-2 xl:grid-cols-4">
        <GeneralSearchBar />
        <ModeSelector mode={mode} setMode={setMode} />
        <PaginationSelector
          items={itemsPerPage}
          setItems={(size) => {
            setPage(1);
            setItemsPerPage(size);
          }}
        />
        <div className="hidden xl:block" />
        <Divider variant="dashed" className="col-span-full" />
        <Switch
          label="Hiển thị mô tả"
          checked={showDescription}
          onChange={(event) => setShowDescription(event.currentTarget.checked)}
        />
        <Switch
          label="Hiển thị ghi chú"
          checked={showNote}
          onChange={(event) => setShowNote(event.currentTarget.checked)}
        />
      </div>

      <Divider className="mt-4" />
      <PaginationIndicator totalItems={0} />

      <div
        className={`grid gap-4 ${
          mode === 'grid' && 'md:grid-cols-2 xl:grid-cols-4'
        }`}
      >
        <PlusCardButton href={`/${ws.id}/healthcare/diagnoses/new`} />

        {diagnoses &&
          diagnoses?.map((d) => (
            <GeneralItemCard
              key={d.id}
              name={d.name}
              href={`/${ws.id}/healthcare/diagnoses/${d.id}`}
              secondaryLabel={d.description}
              tertiaryLabel={d.note}
              showSecondaryLabel={showDescription}
              showTertiaryLabel={showNote}
            />
          ))}
      </div>
    </div>
  );
}
