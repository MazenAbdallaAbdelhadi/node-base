import { useEffect, useEffectEvent, useState } from "react";

import { PAGINATION } from "@/constants/pagination";

interface UseEntitySearchProps<T extends { search: string; page: number }> {
  params: T;
  setParams: (newParams: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 500,
}: UseEntitySearchProps<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  const searchChange = useEffectEvent((search: string) => {
    setLocalSearch(search);
  });

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({
        ...params,
        search: "",
        page: PAGINATION.DEFAULT_PAGE,
      });

      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          search: localSearch,
          page: PAGINATION.DEFAULT_PAGE,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [debounceMs, localSearch, params, setParams]);

  useEffect(() => {
    searchChange(params.search);
  }, [params.search]);

  return {
    searchValue: localSearch,
    onSearchChange: setLocalSearch,
  };
}
