/*
 * Copyright: (c) 2024, Alex Kaul
 * GNU General Public License v3.0 or later (see COPYING or https://www.gnu.org/licenses/gpl-3.0.txt)
 */

import { useCallback, useRef, useState } from 'react';
import { keyboardEventToAccelerator } from '@/utils/keyboardEventToAccelerator';
import { Button } from '@/ui/components/basic/button';
import styles from './shortcutInput.module.scss';

export interface ShortcutInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function ShortcutInput({ value, onChange, disabled }: ShortcutInputProps) {
  const [recording, setRecording] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const startRecording = useCallback(() => {
    if (disabled) {
      return;
    }
    setRecording(true);
    inputRef.current?.focus();
  }, [disabled]);

  const stopRecording = useCallback(() => {
    setRecording(false);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!recording) {
      return;
    }
    event.preventDefault();
    const accelerator = keyboardEventToAccelerator(event);
    if (accelerator) {
      onChange(accelerator);
      stopRecording();
    }
  }, [recording, onChange, stopRecording]);

  const handleClear = useCallback(() => {
    onChange('');
  }, [onChange]);

  return (
    <div className={styles['shortcut-input']}>
      <input
        ref={inputRef}
        type="text"
        readOnly
        disabled={disabled}
        value={recording ? 'Press keys...' : (value || 'Not set')}
        className={[
          styles['shortcut-input-field'],
          recording ? styles.recording : ''
        ].join(' ')}
        onClick={startRecording}
        onBlur={stopRecording}
        onKeyDown={handleKeyDown}
      />
      <Button
        className={styles['shortcut-input-clear']}
        size='S'
        title='Clear shortcut'
        disabled={disabled || !value}
        onClick={handleClear}
      >
        Clear
      </Button>
    </div>
  );
}
