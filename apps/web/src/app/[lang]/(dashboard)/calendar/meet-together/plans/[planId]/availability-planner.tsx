import useTranslation from 'next-translate/useTranslation';
import DatePlanner from './date-planner';
import { MeetTogetherPlan } from '@/types/primitives/MeetTogetherPlan';

export default function AvailabilityPlanner({
  plan,
  disabled,
}: {
  plan: MeetTogetherPlan;
  disabled?: boolean;
}) {
  const { t } = useTranslation('meet-together-plan-details');

  return (
    <div className="grid gap-2 text-center">
      <div className="font-semibold">{t('your_availability')}</div>

      <div className="flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div>{t('unavailable')}</div>
          <div className="border-foreground/50 h-4 w-8 border bg-red-500/20" />
        </div>

        <div className="flex items-center gap-2">
          <div>{t('available')}</div>
          <div className="border-foreground/50 h-4 w-8 border bg-green-500/70" />
        </div>
      </div>

      <DatePlanner
        dates={plan.dates}
        start={plan.start_time}
        end={plan.end_time}
        disabled={disabled}
        editable
      />
    </div>
  );
}
