import {
  PencilIcon,
  CodeBracketIcon,
  ChatBubbleLeftEllipsisIcon,
  CheckCircleIcon,
  BanknotesIcon,
  SparklesIcon,
} from '@heroicons/react/20/solid';
import { Translate } from 'next-translate';

interface Feature {
  title: string;
  subtitle: string;
  url?: string;
  icon: React.ReactNode;
}

export const getFeatures = (t: Translate): Feature[] => {
  return [
    {
      title: t('features-1-title'),
      subtitle: t('features-1-subtitle'),
      icon: <SparklesIcon className="h-6 w-6" />,
    },
    {
      title: t('features-2-title'),
      subtitle: t('features-2-subtitle'),
      icon: <ChatBubbleLeftEllipsisIcon className="h-6 w-6" />,
    },
    {
      title: t('features-3-title'),
      subtitle: t('features-3-subtitle'),
      icon: <CheckCircleIcon className="h-6 w-6" />,
    },
    {
      title: t('features-4-title'),
      subtitle: t('features-4-subtitle'),
      icon: <PencilIcon className="h-6 w-6" />,
    },
    {
      title: t('features-5-title'),
      subtitle: t('features-5-subtitle'),
      icon: <BanknotesIcon className="h-6 w-6" />,
    },
    {
      title: t('features-6-title'),
      subtitle: t('features-6-subtitle'),
      url: 'https://github.com/tutur3u/tutur3u',
      icon: <CodeBracketIcon className="h-6 w-6" />,
    },
  ];
};
