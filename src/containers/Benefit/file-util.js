import { toast } from "react-toastify";

export default class FileUtil {
  static maxSelectFile = event => {
    let files = event.target.files;
    if (files.length > 1) {
      const msg = "Only 1 file can be uploaded at a time";
      event.target.value = null;
      toast.warn(msg);
      return false;
    }
    return true;
  };

  static checkFileSize = event => {
    let files = event.target.files;
    let size = 2000000;
    let err = [];
    for (var x = 0; x < files.length; x++) {
      if (files[x].size > size) {
        err[x] = files[x].type + "is too large, please pick a smaller file\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      toast.error(err[z]);
      event.target.value = null;
    }
    return true;
  };

  static checkMimeType = (event, types) => {
    let files = event.target.files;
    let err = [];
    for (var x = 0; x < files.length; x++) {
      // eslint-disable-next-line no-loop-func
      if (types.every(type => files[x].type !== type)) {
        err[x] = files[x].type + " is not a supported format\n";
      }
    }
    for (var z = 0; z < err.length; z++) {
      toast.error(err[z]);
      event.target.value = null;
    }
    return true;
  };
}
