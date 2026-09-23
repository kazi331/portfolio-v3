'use client';

import { Service } from '@/types/portfolio';
import { CheckCircle2, Cpu, Database, Layout, Sparkles, Terminal } from 'lucide-react';
import { motion } from 'motion/react';

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  // Select icon component
  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'layout':
        return <Layout className="w-5 h-5 text-accent" />;
      case 'terminal':
        return <Terminal className="w-5 h-5 text-accent" />;
      case 'database':
        return <Database className="w-5 h-5 text-accent" />;
      case 'sparkles':
        return <Sparkles className="w-5 h-5 text-accent" />;
      case 'cpu':
      default:
        return <Cpu className="w-5 h-5 text-accent" />;
    }
  };

  return (
    <motion.div
      id={`service-card-${index}`}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="p-8 rounded-[22px_5px_22px_5px] bg-[#11141B] border border-white/10 flex flex-col justify-between h-full hover:border-accent/40 transition-[border-color,box-shadow] duration-300 shadow-xl group"
    >
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="p-2.5 bg-[#161B24] border border-white/10 rounded-[10px_2px_10px_2px] group-hover:border-accent/30 transition-all duration-300">
            {getIcon(service.iconName)}
          </div>
          <span className="text-[9px] font-mono text-muted-text/60 uppercase tracking-widest">
            SERVICE_NODE_0{index + 1}
          </span>
        </div>

        <h3 className="text-xl font-bold text-primary-text mb-3 tracking-tight group-hover:text-accent transition-colors font-display">
          {service.title}
        </h3>
        <p className="text-muted-text text-xs sm:text-sm leading-relaxed mb-6 font-sans">
          {service.description}
        </p>
      </div>

      <div className="pt-5 border-t border-white/5">
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {service.capabilities.map((cap) => (
            <li key={cap} className="text-xs text-muted-text flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              <span className="leading-tight">{cap}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
