import { Select, Textarea, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

interface InputProps {
  type: string;
}

export default function Input({ type }: InputProps) {
  const placeholder = type === 'Lend' ? 'Borrower' : 'Lender';

  return (
    <>
      <div className="mt-8 flex flex-col gap-4">
        <TextInput placeholder="Amount" />
        <TextInput placeholder="Title" />
        <Select
          placeholder="Wallet"
          searchable
          nothingFound="No options"
          data={['Momo', 'Cake', 'BIDV', 'MB']}
        />

        {type === 'Lend' || type === 'Borrow' ? (
          <TextInput placeholder={placeholder} />
        ) : null}

        {type === 'Expense' || type === 'Income' ? (
          <Select
            placeholder="Category"
            searchable
            nothingFound="No options"
            data={['Food', 'Shopping', 'Food', 'Tuition fee']}
          />
        ) : null}

        <DateTimePicker placeholder="Date" defaultValue={new Date()} />

        <Textarea placeholder="Description" autosize minRows={2} maxRows={4} />
        <div className="flex justify-end">
          <div className="h-fit w-fit rounded-md bg-zinc-800 p-2 text-white hover:cursor-pointer hover:bg-yellow-300/30 hover:text-yellow-300">
            Add transaction
          </div>
        </div>
      </div>
    </>
  );
}
