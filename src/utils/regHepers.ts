import { Image, ImagesSort } from "../types";

const applyFilters = (data: Image[], search: string, sort: ImagesSort) => {
  const hasSearch = search.trim().length > 0;
  const dataCopy = [...data]
  const filtered = dataCopy.sort((a, b) => {
    if (sort === "alpha" || sort === "de_alpha")
      return a.file_name.localeCompare(b.file_name);
    else if (sort === "newest" || sort === "oldest")
      return (
        a.last_modified.nanos_since_epoch - b.last_modified.nanos_since_epoch
      );
    else return a.file_size - b.file_size;
  });
  if (sort === "de_alpha" || sort === "oldest" || sort === "large")
    filtered.reverse();
  if (hasSearch)
    return filtered.filter(({ file_name }) => file_name.includes(search));
  return filtered;
};

const formatFileSize = (bytes: number, locale = 'en-US')=>{
  if (bytes === 0) return '0 B';
  
  const units = ['byte', 'kilobyte', 'megabyte', 'gigabyte', 'terabyte', 'petabyte'];
  
  // Calculate which unit power we are at (1024 based)
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = bytes / Math.pow(1024, i);

  return new Intl.NumberFormat(locale, {
    style: 'unit',
    unit: units[i],
    unitDisplay: 'short',
    maximumFractionDigits: 1
  }).format(value);
}

export { applyFilters, formatFileSize };

