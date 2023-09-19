import { HttpRequest } from "../utils";

const httpRequest = new HttpRequest();

export const getStorys = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const res = await httpRequest.get("/story", { page, limit });
  return res.data;
};

export const getStory = async ({ id }: { id: string }) => {
  const res = await httpRequest.get(`/story/${id}`);
  return res.data;
};
