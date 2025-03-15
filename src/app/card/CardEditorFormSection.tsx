type CardEditorFormSectionProps = {
    title: string;
    children: React.ReactNode;
  };
  
  const CardEditorFormSection = ({ title, children }: CardEditorFormSectionProps) => (
    <div className="w-full flex flex-col items-center justify-around border border-gray-d9 rounded-xl p-4 mb-6">
      <div className="font-bold text-medium sm:text-lg mb-3 sm:mb-6">{title}</div>
      {children}
    </div>
  );
  
  export default CardEditorFormSection;
  