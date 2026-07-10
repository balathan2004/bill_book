import {
  DataRes,
  Doc,
  ListRes,
  ResponseConfig,
} from "@/server/utils/interfaces";
import { baseApi } from "./baseApi";

const docsApis = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createDoc: builder.mutation<ResponseConfig, Doc>({
      query: (data) => ({
        url: "/doc/",
        method: "POST",
        body: { data },
      }),
      invalidatesTags: ["docs"],
    }),
    updateDoc: builder.mutation<ResponseConfig, Doc>({
      query: (data) => ({
        url: `/doc/${data.doc_id}`,
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: ["docs"],
    }),
    deleteDoc: builder.mutation<ResponseConfig, string>({
      query: (doc_id) => ({
        url: `/doc/${doc_id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["docs"],
    }),
    getAllDocs: builder.query<ListRes<Doc>, object>({
      query: (params) => ({
        url: `/doc/`,
        params: { ...params },
      }),
      providesTags: ["docs"],
    }),
    getDoc: builder.query<DataRes<Doc>, string>({
      query: (docName) => ({
        url: `/doc/${docName}`,
      }),
      providesTags: ["docs"],
    }),
    getSingleDoc: builder.query<DataRes<Doc>, string>({
      query: (doc_id) => ({
        url: `/public/${doc_id}`,
      }),
      providesTags: ["docs"],
    }),
  }),
});

export default docsApis;
export const {
  useDeleteDocMutation,
  useCreateDocMutation,
  useUpdateDocMutation,
  useGetAllDocsQuery,
  useGetDocQuery,
  useLazyGetSingleDocQuery,
} = docsApis;
