import { TrashIcon, XMarkIcon } from '@heroicons/react/24/solid';
import VitalSelector from '../selectors/VitalSelector';
import { Divider, NumberInput } from '@mantine/core';
import { Vital } from '../../types/primitives/Vital';

interface Props {
  vital: Vital;
  blacklist: string[];

  updateVital: (vital: Vital | null) => void;
  removeVital: () => void;
}

const CheckupVitalInput = ({
  vital,
  blacklist,

  updateVital,
  removeVital,
}: Props) => {
  return (
    <div className="grid w-full gap-2 md:grid-cols-2">
      <div className="flex items-end gap-2">
        <VitalSelector
          vital={vital}
          setVital={(vital) => updateVital(vital)}
          blacklist={blacklist}
          className="w-full"
        />

        <button
          className="h-fit rounded border border-red-300/10 bg-red-300/10 px-1 py-1.5 font-semibold text-red-300 transition hover:bg-red-300/20 md:hidden"
          onClick={removeVital}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-end gap-2">
        <NumberInput
          label="Giá trị"
          placeholder={
            vital?.unit ? `Đơn vị tính: ${vital.unit}` : 'Nhập giá trị'
          }
          value={vital?.value || ''}
          onChange={(num) => updateVital({ ...vital, value: num || undefined })}
          className="w-full"
          classNames={{
            input: 'bg-white/5 border-zinc-300/20 font-semibold',
          }}
          disabled={!vital?.id}
          precision={2}
          step={0.01}
          decimalSeparator=","
          formatter={(num) =>
            num != null && num != '' ? `${num} ${vital?.unit || ''}` : ''
          }
        />

        <button
          className={`h-fit rounded border border-red-300/10 bg-red-300/10 px-1 py-1.5 font-semibold text-red-300 transition ${
            vital?.value == null
              ? 'cursor-not-allowed opacity-50'
              : 'hover:bg-red-300/20'
          }`}
          onClick={
            vital?.value
              ? () => updateVital({ ...vital, value: undefined })
              : undefined
          }
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <button
          className="hidden h-fit rounded border border-red-300/10 bg-red-300/10 px-1 py-1.5 font-semibold text-red-300 transition hover:bg-red-300/20 md:block"
          onClick={removeVital}
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>

      <Divider className="col-span-full mt-2 md:hidden" />
    </div>
  );
};

export default CheckupVitalInput;
