import {
  UndefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setFiles } from "../store/slices/imagesSlice";
import { EncodeMutation, Image } from "../types";
import { decodeImage, encodeImage, getImageList } from "../utils/invokers";
import { applyFilters } from "../utils/regHepers";

const useGetImages = (
  queryOptions?: UndefinedInitialDataOptions<Image[], Error, Image[], string[]>,
) => {
  const { search, sort } = useAppSelector((state) => state.images);
  const dispatch = useAppDispatch();

  const query = useQuery({
    queryFn: getImageList,
    queryKey: ["get_images"],
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    staleTime: Infinity,
    ...queryOptions,
  });

  useEffect(() => {
    if (query.data) dispatch(setFiles(applyFilters(query.data, search, sort)));
  }, [search, sort]);

  useEffect(() => {
    if (query.data) dispatch(setFiles(applyFilters(query.data, search, sort)));
  }, [query.data, query.errorUpdatedAt, query.dataUpdatedAt]);

  return query;
};

const useEncodeImage = (
  mutationOptions?: UseMutationOptions<string, Error, EncodeMutation, unknown>,
) => {
  const mutation = useMutation<string, Error, EncodeMutation, unknown>({
    mutationFn: ({ path, message }) => encodeImage(path, message),
    onSuccess: () => toast.success("Encode Complete"),
    onError: () => toast.success("Encode Failed, Try again later"),
    ...mutationOptions,
  });

  return mutation;
};

const useDecodeImage = ()=>{
  const [decoded, setDecoded] = useState("")

  const mutation = useMutation({
    mutationFn: decodeImage,
    onSuccess: (data)=>{
      setDecoded(data)
      toast.success("Message decoded")
    },
    onError: ()=>{
      setDecoded("")
      toast.error("Couldn't decode message, try again later")
    }
  })

  return {mutation, decoded}
}

export { useEncodeImage, useGetImages, useDecodeImage };
