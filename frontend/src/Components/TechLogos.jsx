import React from 'react';
import { SiReact, SiNodedotjs, SiMongodb, SiJavascript, SiTailwindcss, SiVite } from 'react-icons/si';

// This new component creates the infinitely scrolling logo banner.
const TechLogos = () => {
  const logos = [
    { icon: <SiReact size={40} />, name: 'React' },
    { icon: <SiNodedotjs size={40} />, name: 'Node.js' },
    { icon: <SiMongodb size={40} />, name: 'MongoDB' },
    { icon: <SiJavascript size={40} />, name: 'JavaScript' },
    { icon: <SiTailwindcss size={40} />, name: 'Tailwind CSS' },
    { icon: <SiVite size={40} />, name: 'Vite' },
  ];

  // We duplicate the logos array to create a seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className="mb-12">
      <h3 className="text-center text-xl font-semibold text-gray-400 mb-8">
        Technologies You'll Master
      </h3>
      <div className="relative w-full overflow-hidden bg-gray-900/50 py-8 [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-200px),transparent_100%)]">
        <div className="animate-infinite-scroll flex w-max">
          {duplicatedLogos.map((logo, index) => (
            <div key={index} className="mx-8 flex flex-col items-center justify-center text-gray-400">
              {logo.icon}
              <span className="mt-2 text-sm">{logo.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TechLogos;