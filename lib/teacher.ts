export const isTeacher = (userId?: string | null) => {
  const userIds = process.env.NEXT_PUBLIC_TEACHER_ID!;
  return userIds.split(",").includes(userId || "");
};
