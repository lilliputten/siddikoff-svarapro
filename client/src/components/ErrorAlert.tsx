import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import { ErrorAlertProps } from '@/types/components';

export function ErrorAlert({
  code,
  customMessage,
  className = '',
  severity = 'error',
}: ErrorAlertProps) {
  const { t } = useTranslation('errors');

  return (
    <div
      className={clsx(
        'rounded-lg border p-3',
        severity === 'error'
          ? 'border-error bg-error-muted'
          : 'border-warning bg-warning-muted',
        className,
      )}
    >
      <p className={severity === 'error' ? 'text-error' : 'text-warning'}>
        {customMessage || (code ? t(code) : t('unknown_error'))}
      </p>
    </div>
  );
}
