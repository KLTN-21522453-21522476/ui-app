import React, { useState, useEffect, ChangeEvent, CompositionEvent } from 'react';
import { Form, FormControlProps } from 'react-bootstrap';

// Định nghĩa interface cho props
interface VietnameseInputProps extends Omit<FormControlProps, 'onChange'> {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const VietnameseInput: React.FC<VietnameseInputProps> = ({ value, onChange, ...props }) => {
  const [composing, setComposing] = useState<boolean>(false);
  const [internalValue, setInternalValue] = useState<string>(value || '');

  useEffect(() => {
    if (!composing) {
      setInternalValue(value || '');
    }
  }, [value, composing]);

  const handleCompositionStart = (): void => {
    setComposing(true);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>): void => {
    setComposing(false);
    
    // Thay vì cố gắng chuyển đổi sự kiện, chỉ cần gọi handleChange với sự kiện change thực
    const inputEl = e.target as HTMLInputElement;
    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;
    
    if (nativeInputValueSetter) {
      // Đặt giá trị và kích hoạt sự kiện change
      const ev = new Event('input', { bubbles: true });
      nativeInputValueSetter.call(inputEl, inputEl.value);
      inputEl.dispatchEvent(ev);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    
    if (!composing) {
      onChange(e);
    }
  };

  return (
    <Form.Control
      {...props}
      value={internalValue}
      onChange={handleChange}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
    />
  );
};

export default VietnameseInput;
