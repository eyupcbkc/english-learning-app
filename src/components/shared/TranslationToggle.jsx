import { useState } from 'react'
import { ChevronDown, Languages } from 'lucide-react'

export default function TranslationToggle({ children, label = 'Türkçe Çeviri' }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="group inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors py-1"
      >
        <Languages className="h-3.5 w-3.5" />
        <span>{open ? 'Çeviriyi Gizle' : label}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${open ? 'grid-rows-[1fr] opacity-100 mt-1' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  )
}
