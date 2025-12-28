import { Session, PaginatedData, SuccessResponse } from '../';

// Requests
export interface GetSessionsRequest {}

// Responses
export interface GetSessionsResponse extends SuccessResponse<PaginatedData<Session>> {}
