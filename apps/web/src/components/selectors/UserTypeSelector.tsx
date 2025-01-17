import { Squares2X2Icon } from '@heroicons/react/24/solid';
import { Select } from '@mantine/core';
import useTranslation from 'next-translate/useTranslation';

interface Props {
  label?: string;
  placeholder?: string;
  type: 'platform_user' | 'virtual_user' | 'user_group';
  setType: (type: 'platform_user' | 'virtual_user' | 'user_group') => void;
  className?: string;
  disabled?: boolean;
}

const UserTypeSelector = ({
  label,
  placeholder,
  type,
  setType,
  className,
  disabled = false,
}: Props) => {
  const { t } = useTranslation('user-type-selector');

  const data = [
    {
      label: t('platform'),
      value: 'platform_user',
    },
    {
      label: t('virtual'),
      value: 'virtual_user',
    },
    {
      label: t('groups'),
      value: 'user_group',
    },
  ];

  return (
    <Select
      label={label ?? t('type')}
      placeholder={placeholder ?? t('type-placeholder')}
      icon={<Squares2X2Icon className="h-5" />}
      data={data}
      value={type}
      onChange={setType}
      className={className}
      styles={{
        item: {
          // applies styles to selected item
          '&[data-selected]': {
            '&, &:hover': {
              backgroundColor: '#6b686b',
              color: '#fff',
              fontWeight: 600,
            },
          },

          // applies styles to hovered item
          '&:hover': {
            backgroundColor: '#454345',
            color: '#fff',
          },
        },
      }}
      disabled={disabled}
    />
  );
};

export default UserTypeSelector;
