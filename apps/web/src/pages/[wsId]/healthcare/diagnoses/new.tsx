import { ReactElement, useEffect, useState } from 'react';
import HeaderX from '../../../../components/metadata/HeaderX';
import { PageWithLayoutProps } from '../../../../types/PageWithLayoutProps';
import { enforceHasWorkspaces } from '../../../../utils/serverless/enforce-has-workspaces';
import NestedLayout from '../../../../components/layouts/NestedLayout';
import { Divider, TextInput, Textarea } from '@mantine/core';
import { openModal } from '@mantine/modals';
import DiagnosisCreateModal from '../../../../components/loaders/diagnoses/DiagnosisCreateModal';
import { useWorkspaces } from '../../../../hooks/useWorkspaces';
import { useSegments } from '../../../../hooks/useSegments';

export const getServerSideProps = enforceHasWorkspaces;

const NewDiagnosisPage: PageWithLayoutProps = () => {
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
            {
              content: 'Tạo mới',
              href: `/${ws.id}/healthcare/diagnoses/new`,
            },
          ]
        : []
    );

    return () => setRootSegment([]);
  }, [ws, setRootSegment]);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [note, setNote] = useState<string>('');

  const hasRequiredFields = () => name.length > 0;

  const showLoaderModal = () => {
    if (!ws) return;
    openModal({
      title: <div className="font-semibold">Tạo chẩn đoán mới</div>,
      centered: true,
      closeOnEscape: false,
      closeOnClickOutside: false,
      withCloseButton: false,
      children: (
        <DiagnosisCreateModal
          wsId={ws.id}
          diagnosis={{ name, description, note }}
        />
      ),
    });
  };

  return (
    <>
      <HeaderX label="Chẩn đoán mới - Khám bệnh" />
      <div className="mt-2 flex min-h-full w-full flex-col pb-8">
        <div className="grid gap-x-8 gap-y-4 xl:gap-x-16">
          <div className="flex items-end justify-end">
            <button
              className={`rounded border border-blue-300/10 bg-blue-300/10 px-4 py-1 font-semibold text-blue-300 transition ${
                hasRequiredFields()
                  ? 'hover:bg-blue-300/20'
                  : 'cursor-not-allowed opacity-50'
              }`}
              onClick={hasRequiredFields() ? showLoaderModal : undefined}
            >
              Tạo mới
            </button>
          </div>
        </div>

        <Divider className="my-4" />
        <div className="grid h-fit gap-x-4 gap-y-2 md:grid-cols-2">
          <div className="col-span-full">
            <div className="text-2xl font-semibold">Thông tin cơ bản</div>
            <Divider className="my-2" variant="dashed" />
          </div>

          <TextInput
            label="Tên chẩn đoán"
            placeholder='Ví dụ: "Bệnh viêm phổi", "Bệnh viêm gan B"...'
            value={name}
            onChange={(e) => setName(e.currentTarget.value)}
            classNames={{
              input: 'bg-white/5 border-zinc-300/20 font-semibold',
            }}
            required
          />

          <div />

          <Textarea
            label="Mô tả"
            placeholder="Mô tả về chẩn đoán"
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            minRows={5}
            classNames={{
              input: 'bg-white/5 border-zinc-300/20 font-semibold',
            }}
          />

          <Textarea
            label="Ghi chú"
            placeholder="Ghi chú về chẩn đoán"
            value={note}
            onChange={(e) => setNote(e.currentTarget.value)}
            minRows={5}
            classNames={{
              input: 'bg-white/5 border-zinc-300/20 font-semibold',
            }}
          />
        </div>
      </div>
    </>
  );
};

NewDiagnosisPage.getLayout = function getLayout(page: ReactElement) {
  return <NestedLayout noTabs>{page}</NestedLayout>;
};

export default NewDiagnosisPage;