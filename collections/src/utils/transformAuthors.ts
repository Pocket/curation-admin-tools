interface StoryAuthor {
  name: string;
  sortOrder: number;
}

export const transformAuthors = (authors: string): StoryAuthor[] => {
  return authors.split(', ').map((name: string, sortOrder: number) => {
    return { name, sortOrder };
  });
};
