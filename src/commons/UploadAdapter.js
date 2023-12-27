import axios from 'axios';

export class UploadAdapter {
    constructor(loader) {
        this.loader = loader;
        this.upload = this.upload.bind(this);
        this.abort = this.abort.bind(this);
    }

    async upload() {
        return this.loader.file.then((file) => {
            const data = new FormData();
            data.append("Files", file);

            return axios({
                data,
                method: "POST",
                url: `https://cms-myvpapi.cloudvst.net/notifications/upload-notification-content-files`,
                headers: {
                    "Content-Type": "multipart/form-data",
                    'Authorization': `${localStorage.getItem('accessToken')}`
                },
                onUploadProgress: (progressEvent) => {
                    this.loader.uploadTotal = progressEvent.total;
                    this.loader.uploaded = progressEvent.loaded;
                    const uploadPercentage = parseInt(
                    Math.round((progressEvent.loaded / progressEvent.total) * 100)
                )},
            })
            .then(res => {
                let resData = {};
                resData.default = res.data || "";
                return resData;
            })
            .catch(({ error }) => Promise.reject(error))
        })
    }

    abort() {
      return Promise.reject();
    }
}
  
export function UploadAdapterPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => new UploadAdapter(loader);
}
