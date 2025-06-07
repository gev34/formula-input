import { useQuery } from '@tanstack/react-query';

import mockAutocompleteAPI from '../../../api/useAutocomplete';

const useAutocomplete = (query: string) => (useQuery<string[]>({
    queryKey: ['autocomplete', query],
    queryFn: () => mockAutocompleteAPI(query),
    enabled: !!query && query.length > 0,
    staleTime: 1000,
  }))

export default useAutocomplete