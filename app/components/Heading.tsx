"use client";

interface HeadingProps {
  title: string;
  type:string;
  center?: boolean;
}

const Heading: React.FC<HeadingProps> = ({ title,  center ,type}) => {
 
  return (
    <div className={center ? "text-center" : "text-start"}>
      <div className="text-2xl font-bold">{title}</div>
      <div className="text-xl font-medium text-neutral-500">{type}</div>
      
    </div>
  );
};

export default Heading;
