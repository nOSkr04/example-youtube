import { HttpRequest } from "../utils";

const httpRequest = new HttpRequest();

export const getLessons = async ({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) => {
  const res = await httpRequest.get("/lessons", { page, limit });
  return res.data;
};
export const getLesson = async ({ id }: { id: string }) => {
  const res = await httpRequest.get(`/lessons/${id}`);
  return res.data;
};
