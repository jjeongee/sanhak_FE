import React from 'react';

type ButtonLabelProps = {
  style?: string;
  type: string;
  label: string;
  onClick?: () => void;
}

const categoryLabels: Record<string, string> = {
  frontend: '웹/프론트엔드',
  backend: '웹/백엔드',
  data: '데이터 사이언스',
  security: '보안',
  application: '어플리케이션',
};

export default function ButtonLabel({
  style,
  label, 
  type,
  onClick 
}: ButtonLabelProps) {
  const imageName = label.toLowerCase().replace(/\s+/g, '').replace(/\./g, '').replace(/#/g, 'sharp'); // 소문자, 공백제거, "."제거
  const imageSrc = `/asset/png/${type}/${imageName}_img.png`;
  const labelName = type === 'category' ? categoryLabels[label] || label : label;
  return (
    <div
      className={`${style ? style : "bg-primary text-white border-white"} text-xs sm:text-sm font-semibold flex justify-center items-center border rounded-xl px-1 xs:px-2 sm:px-4 py-1 mr-2 mb-2`}
      onClick={onClick ? onClick : undefined}
    >
      <img className='w-[20px] h-[20px] object-contain mr-2' src={imageSrc} alt={label}/>
      {labelName}
    </div>
  );
};