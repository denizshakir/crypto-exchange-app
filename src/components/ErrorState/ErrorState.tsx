import React, { FC } from 'react';

interface IErrorStateProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const ErrorState: FC<IErrorStateProps> = (props) => {
  const { children, className = '', style } = props;

  return (
    <div
      className={`bg-content1 flex shadow-small text-foreground-400 items-center justify-center align-middle text-center h-60 rounded-large w-full font-mono ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ErrorState;
