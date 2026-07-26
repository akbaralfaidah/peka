export const renderFormattedText = (text) => {
  if (!text) return null
  
  // Pisahkan string berdasarkan **text** atau *text*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g)
  
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-bold text-[var(--color-text-primary)]">{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return <strong key={i} className="font-bold text-[var(--color-text-primary)]">{part.slice(1, -1)}</strong>
    }
    return part
  })
}
