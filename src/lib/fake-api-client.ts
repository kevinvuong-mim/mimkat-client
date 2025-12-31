import { SuccessResponse } from '@/types/api/api-response';

const filterDataBySearchParams = (data: unknown, searchParams: Record<string, string>) => {
  if (!Array.isArray(data) || Object.keys(searchParams).length === 0) {
    return data;
  }

  return data.filter((item) => {
    return Object.entries(searchParams).every(([key, value]) => {
      if (!value || value.trim() === '') return true;

      const itemValue = (item as Record<string, unknown>)[key];

      if (itemValue === undefined || itemValue === null) return false;

      const itemValueStr = String(itemValue).toLowerCase();

      const searchValues = value.split(',').map((v) => v.toLowerCase().trim());

      return searchValues.some((searchValue) => itemValueStr.includes(searchValue));
    });
  });
};

const getSuccessStatusCode = (method: string) => {
  const statusCodeMap: Record<string, number> = {
    GET: 200,
    PUT: 200,
    POST: 201,
    PATCH: 200,
    DELETE: 204,
  };

  return statusCodeMap[method] || 200;
};

const getSuccessMessage = (method: string) => {
  const messageMap: Record<string, string> = {
    GET: 'Data retrieved successfully',
    PUT: 'Resource updated successfully',
    POST: 'Resource created successfully',
    PATCH: 'Resource updated successfully',
    DELETE: 'Resource deleted successfully',
  };

  return messageMap[method] || 'Operation completed successfully';
};

const fakeApiClient = ({
  endpoint,
  time = 1000,
  method = 'GET',
  isError = false,
  requestData = null,
  responseData = null,
  searchParams = { page: '1', sort: 'asc', sortBy: 'id', pageSize: '10' },
}: {
  time?: number;
  endpoint: string;
  isError?: boolean;
  requestData?: unknown;
  responseData?: unknown;
  searchParams?: Record<string, string>;
  method?: 'GET' | 'PUT' | 'POST' | 'PATCH' | 'DELETE';
}): Promise<SuccessResponse> => {
  if (requestData) console.log(`${method} - ${endpoint}: `, requestData);

  const { sort, page, sortBy, pageSize, ...search } = searchParams;

  const filteredData = Array.isArray(responseData)
    ? filterDataBySearchParams(responseData, search)
    : responseData;

  let sortedData = Array.isArray(filteredData)
    ? sort === 'asc'
      ? filteredData.sort((a, b) => a[sortBy].localeCompare(b[sortBy]))
      : filteredData.sort((a, b) => b[sortBy].localeCompare(a[sortBy]))
    : filteredData;

  let data = sortedData;
  if (page && pageSize && Array.isArray(sortedData)) {
    const total = sortedData.length;
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    const totalPages = Math.ceil(total / pageSizeNumber);

    const startIndex = (pageNumber - 1) * pageSizeNumber;
    const endIndex = startIndex + pageSizeNumber;
    const paginatedItems = sortedData.slice(startIndex, endIndex);

    data = {
      items: paginatedItems,
      meta: {
        total,
        totalPages,
        page: pageNumber,
        perPage: pageSizeNumber,
        hasPreviousPage: pageNumber > 1,
        hasNextPage: pageNumber < totalPages,
      },
    };
  }

  const errorResponse = {
    path: endpoint,
    success: false,
    statusCode: 500,
    error: 'Bad Request',
    message: 'An error occurred',
    timestamp: new Date().toISOString(),
  };

  const successResponse = {
    data,
    success: true,
    path: endpoint,
    message: getSuccessMessage(method),
    timestamp: new Date().toISOString(),
    statusCode: getSuccessStatusCode(method),
  };

  return new Promise((resolve, reject) =>
    setTimeout(() => {
      return isError ? reject(errorResponse) : resolve(successResponse);
    }, time),
  );
};

export { fakeApiClient };
