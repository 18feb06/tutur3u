'use client';

import { Button, TextInput } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import React, { useState } from 'react';
import { ChangeEvent } from 'react';
import { Document } from '../../types/primitives/Document';
import useTranslation from 'next-translate/useTranslation';

interface DocumentEditFormProps {
  doc?: Document;
  onSubmit?: (doc: Partial<Document>) => void;
  onDelete?: () => void;
}

const DocumentEditForm = ({
  doc,
  onSubmit,
  onDelete,
}: DocumentEditFormProps) => {
  const { t } = useTranslation('documents');
  const [name, setName] = useState(doc?.name || '');

  const documentNameLabel = t('document-name');
  const documentNamePlaceholder = t('document-name-placeholder');

  const deleteLabel = t('delete');
  const createLabel = t('create');
  const saveLabel = t('save');

  return (
    <>
      <TextInput
        label={documentNameLabel}
        placeholder={documentNamePlaceholder}
        value={name}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setName(event.currentTarget.value)
        }
        data-autofocus
      />

      <div className="flex gap-2">
        {doc?.id && onDelete && (
          <Button
            fullWidth
            variant="subtle"
            color="red"
            onClick={onDelete}
            mt="md"
          >
            {deleteLabel}
          </Button>
        )}
        <Button
          fullWidth
          variant="subtle"
          onClick={() => {
            const newDocument = { id: doc?.id || undefined, name };
            if (onSubmit) onSubmit(newDocument);
            closeAllModals();
          }}
          mt="md"
        >
          {doc?.id ? saveLabel : createLabel}
        </Button>
      </div>
    </>
  );
};

export default DocumentEditForm;
