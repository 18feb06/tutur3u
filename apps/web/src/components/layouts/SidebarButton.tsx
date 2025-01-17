import { Tooltip } from '@mantine/core';
import { useAppearance } from '../../hooks/useAppearance';
import { DEV_MODE } from '../../constants/common';

interface SidebarButtonProps {
  onClick?: () => void;
  label?: string;
  activeIcon?: React.ReactNode;
  isActive?: boolean;
  showIcon?: boolean;
  showLabel?: boolean;
  showTooltip?: boolean;
  enableOffset?: boolean;
  left?: boolean;
  classNames?: {
    root?: string;
  };
  disabled?: boolean;
}

export default function SidebarButton({
  onClick,
  label,
  activeIcon,
  isActive = false,
  showIcon = true,
  showLabel = true,
  showTooltip = false,
  left = false,
  classNames,
  disabled = false,
}: SidebarButtonProps) {
  const { sidebar } = useAppearance();
  const isExpanded = sidebar === 'open';

  if (disabled && !DEV_MODE) return null;

  return (
    <Tooltip
      label={<div className="font-semibold">{label}</div>}
      position="right"
      offset={16}
      disabled={!showTooltip}
    >
      <div
        onClick={disabled ? undefined : onClick}
        className={`flex select-none items-center gap-2 rounded p-2 ${
          left || isExpanded ? 'justify-start' : 'justify-center'
        } ${
          disabled
            ? 'cursor-not-allowed text-zinc-600'
            : isActive
              ? 'border-border cursor-pointer bg-zinc-500/10 text-zinc-900 dark:border-zinc-300/10 dark:bg-zinc-500/10 dark:text-zinc-100'
              : 'cursor-pointer border-transparent text-zinc-700 md:hover:bg-zinc-500/10 md:hover:text-zinc-900 dark:text-zinc-300 md:dark:hover:bg-zinc-300/5 md:dark:hover:text-zinc-100'
        } ${classNames?.root}`}
      >
        {showIcon && <div className="flex-none">{activeIcon}</div>}
        {showLabel && (
          <div className="line-clamp-1 text-sm font-semibold">{label}</div>
        )}
      </div>
    </Tooltip>
  );
}
