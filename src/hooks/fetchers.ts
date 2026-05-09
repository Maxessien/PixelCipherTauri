import {
  UndefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setFiles, setPage } from "../store/slices/imagesSlice";
import { EncodeMutation, Image } from "../types";
import { decodeImage, encodeImage, getImageList } from "../utils/invokers";
import { applyFilters } from "../utils/regHepers";

const useGetImages = (
  queryOptions?: UndefinedInitialDataOptions<Image[], Error, Image[], string[]>,
) => {
  const { search, sort, pages } = useAppSelector((state) => state.images);
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
    if (query.data) {
      dispatch(
        setFiles(
          applyFilters(query.data, search, sort),
        ),
      );
    }
  }, [query.data, query.errorUpdatedAt, query.dataUpdatedAt, search, sort]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const setCurrPage = (pageNumber: number) => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({ top: 0, behavior: "smooth" });
    if(query.data) dispatch(setPage({ current: pageNumber, total: pages.total, data: applyFilters(query.data, search, sort) }));
  };

  return { ...query, setCurrPage, scrollRef };
};

const useEncodeImage = (
  mutationOptions?: UseMutationOptions<string, Error, EncodeMutation, unknown>,
) => {
  const mutation = useMutation<string, Error, EncodeMutation, unknown>({
    mutationFn: ({ path, message, save_name, imgFormat }) =>
      encodeImage(path, message, save_name, imgFormat),
    onSuccess: () => toast.success("Encoding Complete"),
    onError: (e) => {
      toast.success(e.message);
    },
    ...mutationOptions,
  });

  return mutation;
};

const useDecodeImage = () => {
  const [decoded, setDecoded] = useState("");

  const mutation = useMutation({
    mutationFn: decodeImage,
    onSuccess: (data) => {
      setDecoded(data);
      toast.success("Message decoded");
    },
    onError: (e) => {
      setDecoded("");
      toast.error(e.message);
    },
  });

  return { mutation, decoded };
};

export { useDecodeImage, useEncodeImage, useGetImages };

