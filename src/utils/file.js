import { toast } from "react-toastify";

const whilteListFileExtension = [
  'application/msword', // doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.ms-excel', // xls
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
  'application/pdf', // pdf,
  'image/png', // png
  'image/jpeg' // jpg and jpeg
]

export const whiteListImageExtension = [
  'image/png', // png
  'image/jpeg'
]

const MAX_TOTAL_FILE_ATTACH_SIZE = 1024 * 1024 * 8;

export const validateFileMimeType = (event, t, files, mimeTypesAllow = whilteListFileExtension) => {
  const err = [];
  const filesArr = Array.from(files);
  filesArr.forEach((file) => {
    if (!mimeTypesAllow.includes(file.type)) {
      err.push(`File ${file.name} ${t("InvalidMimeType")}\n`);
    }
  })
  if (err.length > 0) {
    err.forEach(e => {
      toast.error(e);
    })
    event.target.value = null;
    return false;
  }
  return true;
}

export const validateTotalFileSize = (files, t) => {
  const filesArr = Array.from(files);
  const totalSize = filesArr.reduce((accumulator, currentValue) => accumulator + currentValue.size, 0);
  if (totalSize > MAX_TOTAL_FILE_ATTACH_SIZE) {
    toast.error(t("ExceedMaxFileSize"))
    return false;
  }
  return true;
}