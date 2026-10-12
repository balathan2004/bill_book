
import { InvoiceDoc, DataRes, ListRes, ResponseConfig, InvoiceTagItem } from "@/src/server/utils/interfaces";
import { baseApi } from "./baseApi";

const tagsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    updateTag: builder.mutation<ResponseConfig, InvoiceTagItem>({
      query: (data) => ({
        url: `/tags/${data.id}`,
        method: "PUT",
        body: { data },
      }),
      invalidatesTags: ["tags"],
    }),
    deleteTag: builder.mutation<ResponseConfig, string>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["tags"],
    }),
    getAllTags: builder.query<ListRes<InvoiceTagItem>, object>({
      query: (payload) => ({
        url: `/tags/`,
        params: { ...payload },
      }),
      providesTags: ["tags"],
    }),
    getSingleTag: builder.query<DataRes<InvoiceTagItem>, string>({
      query: (id) => ({
        url: `/tags/${id}`,
      }),
      providesTags: ["tags"],
    }),

  }),
});

export default tagsApi;
export const {
  useGetAllTagsQuery,
  useGetSingleTagQuery,
  useDeleteTagMutation,
  useUpdateTagMutation
} = tagsApi;
