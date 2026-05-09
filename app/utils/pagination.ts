export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
}

export const getPaginationParams = (searchParams: URLSearchParams) => {
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const paginate = <T>(
  items: T[],
  totalItems: number,
  { page = 1, limit = 10 }: PaginationOptions
): PaginationResult<T> => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    data: items,
    currentPage: page,
    totalPages,
    totalItems,
    limit,
  };
};
