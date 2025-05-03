// components/commons/TruncatedText.tsx
import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  className?: string;
  showTooltip?: boolean;
  expandable?: boolean;
}

const TruncatedText: React.FC<TruncatedTextProps> = ({
  text,
  maxLength = 20,
  className = '',
  showTooltip = true,
  expandable = true
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Nếu text không vượt quá maxLength, hiển thị bình thường
  if (!text || text.length <= maxLength) {
    return <span className={className}>{text}</span>;
  }

  // Nếu đã expand hoặc không cho phép expand
  if (isExpanded) {
    return (
      <span className={className}>
        {text}
        {expandable && (
          <span 
            className="text-primary ms-1" 
            style={{ cursor: 'pointer', fontSize: '0.85em' }}
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(false);
            }}
          >
            [Thu gọn]
          </span>
        )}
      </span>
    );
  }

  // Truncate text
  const truncatedText = `${text.substring(0, maxLength)}...`;
  
  // Nếu có tooltip, wrap trong OverlayTrigger
  if (showTooltip) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={<Tooltip id={`tooltip-${text}`}>{text}</Tooltip>}
      >
        <span className={className}>
          {truncatedText}
          {expandable && (
            <span 
              className="text-primary ms-1" 
              style={{ cursor: 'pointer', fontSize: '0.85em' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(true);
              }}
            >
              [Xem thêm]
            </span>
          )}
        </span>
      </OverlayTrigger>
    );
  }

  // Nếu không có tooltip
  return (
    <span className={className}>
      {truncatedText}
      {expandable && (
        <span 
          className="text-primary ms-1" 
          style={{ cursor: 'pointer', fontSize: '0.85em' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(true);
          }}
        >
          [Xem thêm]
        </span>
      )}
    </span>
  );
};

export default TruncatedText;
