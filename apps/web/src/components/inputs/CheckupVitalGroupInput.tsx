import { TrashIcon } from '@heroicons/react/24/solid';
import { VitalGroup } from '../../types/primitives/VitalGroup';
import VitalGroupSelector from '../selectors/VitalGroupSelector';
import { Vital } from '../../types/primitives/Vital';
import useSWR from 'swr';
import { useEffect } from 'react';

interface Props {
  index: number;

  wsId: string;
  group: VitalGroup;
  blacklist?: string[];

  updateGroupId: (idx: number, id: string) => void;
  removeGroup: (idx: number) => void;

  addVitals: (groupId: string, vitals: Vital[]) => void;
}

const CheckupVitalGroupInput = ({
  index: idx,

  wsId,
  group,
  blacklist,

  updateGroupId,
  removeGroup,

  addVitals,
}: Props) => {
  const vitalsApiPath =
    wsId && group?.id
      ? `/api/workspaces/${wsId}/healthcare/vital-groups/${group.id}/vitals`
      : null;

  const { data: vitals } = useSWR<Vital[]>(vitalsApiPath);

  useEffect(() => {
    if (vitals) addVitals(group.id, vitals);
  }, [group, vitals, addVitals]);

  return (
    <div className="grid w-full gap-4 rounded-lg bg-zinc-300/5 p-4">
      <div className="flex items-end gap-2">
        <VitalGroupSelector
          groupId={group.id}
          setGroupId={(id) => updateGroupId(idx, id)}
          blacklist={blacklist}
          className="w-full"
        />
        <button
          className="h-fit rounded border border-red-300/10 bg-red-300/10 px-1 py-1.5 font-semibold text-red-300 transition hover:bg-red-300/20"
          onClick={() => removeGroup(idx)}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CheckupVitalGroupInput;
