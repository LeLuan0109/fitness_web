/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type DefaultOptions,
  type UseMutationOptions,
  type UseQueryOptions,
  QueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";

import { API_STATUS } from "@/constants/api";
import type { ResponseError } from "@/types/common.type";

const queryConfig: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
    retry: 1,
    staleTime: 1,
    gcTime: 1,
    networkMode: "always",
    throwOnError: (error) => {
      const axiosError = error as AxiosError<ResponseError>;
      return (
        axiosError.response?.status === API_STATUS.FORBIDDEN ||
        axiosError.response?.status === API_STATUS.NOT_FOUND ||
        axiosError.response?.status === API_STATUS.INTERNAL_SERVER ||
        axiosError.code === API_STATUS.ERR_NETWORK
      );
    },
  },
  mutations: {
    networkMode: "always",
    throwOnError: (error) => {
      const axiosError = error as AxiosError<ResponseError>;
      return (
        axiosError.response?.status === API_STATUS.FORBIDDEN ||
        axiosError.response?.status === API_STATUS.NOT_FOUND ||
        axiosError.response?.status === API_STATUS.INTERNAL_SERVER ||
        axiosError.code === API_STATUS.ERR_NETWORK
      );
    },
  },
};

export const queryClient = new QueryClient({ defaultOptions: queryConfig });

export type ExtractFnReturnType<FnType extends (...args: any) => any> = Awaited<
  Promise<ReturnType<FnType>>
>;

export type QueryConfig<QueryFnType extends (...args: any) => any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  "queryKey" | "queryFn" | "select"
>;

export type MutationConfig<MutationFnType extends (...args: any) => any> =
  UseMutationOptions<
    ExtractFnReturnType<MutationFnType>,
    AxiosError<ResponseError, any>,
    Parameters<MutationFnType>[0]
  >;
