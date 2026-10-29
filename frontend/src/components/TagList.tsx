interface TagListProps {
  items: string[];
  label?: string;
}

export function TagList({ items, label }: TagListProps) {
  return (
    <ul className="tags" aria-label={label}>
      {items.map((item) => (
        <li key={item} className="tag">{item}</li>
      ))}
    </ul>
  );
}
