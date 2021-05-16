// adapted from https://github.com/fortana-co/react-dropzone-uploader/blob/master/src/utils.ts
export const formatFileSize = (size: number): string => {
  const units = ['bytes', 'kB', 'MB', 'GB'];
  let labelIndex = 0;
  let number = size;
  while (number >= 1024) {
    number /= 1024;
    labelIndex += 1;
  }

  return `${number.toFixed(number >= 10 || labelIndex < 1 ? 0 : 1)} ${
    units[labelIndex]
  }`;
};
