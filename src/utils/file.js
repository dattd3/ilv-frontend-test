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

export const checkFilesMimeType = (files = [], mimeTypesAllow = whilteListFileExtension) => {
  const err = [];
  const filesArr = Array.from(files);
  filesArr.forEach((file) => {
    if (!mimeTypesAllow.includes(file.type)) {
      err.push(file.type + " không đúng định dạng! Vui lòng thử lại!\n");
    }
  })
  if (err.length > 0) {
    err.forEach(e => {
      toast.error(e);
    })
    return false;
  }
  return true;
}