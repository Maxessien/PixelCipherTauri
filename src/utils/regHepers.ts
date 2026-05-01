import { Image, ImagesSort } from "../types";

const applyFilters = (data: Image[], search: string, sort: ImagesSort) => {
  const hasSearch = search.trim().length > 0;
  const filtered = data.sort((a, b) => {
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

export { applyFilters };
