import {
  PaginationQueryParams,
  PaginationResponse,
  SearchableQueryParams,
  WriterFilterQueryParams,
} from '@/types/common';
import axios from 'axios';
import {
  CreateEpigramFormType,
  DeleteEpigramResponse,
  Epigram,
  EpigramDetail,
  LikeEpigramResponse,
  UpdateEpigramFormType,
} from './epigram.type';
import { Comment } from '../comment/comment.type';

/**
 * 에피그램 목록 조회
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/ListEpigrams
 */
export const getEpigrams = async (params: SearchableQueryParams) => {
  const { limit = 6, cursor, keyword } = params;
  const response = await axios.get<PaginationResponse<Epigram>>(`/api/epigrams`, {
    params: {
      limit,
      cursor,
      keyword,
    },
  });
  return response.data;
};

/**
 * 에피그램 목록 조회 by userId
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/ListEpigrams
 */
export const getEpigramsByUserId = async (params: WriterFilterQueryParams) => {
  const { limit = 6, cursor, writerId } = params;
  const response = await axios.get<PaginationResponse<Epigram>>(`/api/epigrams`, {
    params: {
      limit,
      cursor,
      writerId,
    },
  });
  return response.data;
};

/**
 * 에피그램 작성
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/CreateEpigram
 */
export const createEpigram = async (data: CreateEpigramFormType) => {
  const response = await axios.post<Epigram>('/api/epigrams', data);
  return response.data;
};

/**
 * 오늘의 에피그램 조회
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/RetrieveTodayEpigram
 */
export const getTodayEpigram = async () => {
  const response = await axios.get<Epigram>('/api/epigrams/today');
  return response.data;
};

/**
 * 에피그램 상세 조회
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/RetrieveEpigram
 */
export const getEpigramDetails = async (epigramId: number) => {
  const response = await axios.get<EpigramDetail>(`/api/epigrams/${epigramId}`);
  return response.data;
};

/**
 * 에피그램 상세 조회 (서버용)
 */
export const getEpigramDetailsOnServer = async (epigramId: number) => {
  const response = await fetch(
    `https://fe-project-epigram-api.vercel.app/12-4/epigrams/${epigramId}`,
    {
      method: 'GET',
    },
  );

  if (!response.ok) {
    throw new Error('An error occurred while fetching data');
  }

  const data = await response.json();

  return data;
};

/**
 * 에피그램 수정
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/UpdateEpigram
 */
export const updateEpigram = async (epigramId: number, data: UpdateEpigramFormType) => {
  const response = await axios.patch<Epigram>(`/api/epigrams/${epigramId}`, data);
  return response.data;
};

/**
 * 에피그램 삭제
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/DeleteEpigram
 */
export const deleteEpigram = async (epigramId: number) => {
  const response = await axios.delete<DeleteEpigramResponse>(`/api/epigrams/${epigramId}`);
  return response.data;
};

/**
 * 에피그램 좋아요
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/LikeEpigram
 */
export const likeEpigram = async (epigramId: number) => {
  const response = await axios.post<LikeEpigramResponse>(`/api/epigrams/${epigramId}/like`);
  return response.data;
};

/**
 * 에피그램 좋아요 취소
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/UnlikeEpigram
 */
export const disLikeEpigram = async (epigramId: number) => {
  const response = await axios.delete<LikeEpigramResponse>(`/api/epigrams/${epigramId}/like`);
  return response.data;
};

/**
 * 에피그램 댓글 목록 조회
 * https://fe-project-epigram-api.vercel.app/docs/#/Epigram/ListEpigramComments
 */
export const getEpigramComments = async (epigramId: number, params: PaginationQueryParams) => {
  const { limit = 3, cursor } = params;
  const response = await axios.get<PaginationResponse<Comment>>(
    `/api/epigrams/${epigramId}/comments`,
    { params: { limit, cursor } },
  );
  return response.data;
};
