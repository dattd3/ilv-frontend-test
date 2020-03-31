import React from "react";
import { Progress } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ApiContext } from "../../modules";
import FileUtil from "../Benefit/file-util";

const types = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
];

function UploadJobDescPage() {
  return (
    <ApiContext.Consumer>{api => <JobDesc api={api} />}</ApiContext.Consumer>
  );
}

class JobDesc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0,
      selectedJobIdsFile: null,
      loadedJobIds: 0
    };
  }

  onChangeJobIdsHandler = event => {
    var files = event.target.files;
    if (
      FileUtil.maxSelectFile(event) &&
      FileUtil.checkMimeType(event, types) &&
      FileUtil.checkFileSize(event)
    ) {
      this.setState({
        selectedJobIdsFile: files,
        loadedJobIds: 0
      });
    }
  };

  onClickJobIdsHandler = async () => {
    var selectedFile = this.state.selectedJobIdsFile;

    if (selectedFile == null || selectedFile.length === 0) {
      toast.info("Plz, select file");
      return;
    }

    const data = new FormData();
    for (var x = 0; x < selectedFile.length; x++) {
      data.append("body", selectedFile[x]);
    }

    try {
      await this.props.api.uploadJobIds(data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loadedJobIds: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      });

      toast.success("Upload success");
    } catch (error) {
      //toast.error("Upload fail");
    }
  };

  onChangeHandler = event => {
    var files = event.target.files;
    if (
      FileUtil.maxSelectFile(event) &&
      FileUtil.checkMimeType(event, types) &&
      FileUtil.checkFileSize(event)
    ) {
      this.setState({
        selectedFile: files,
        loaded: 0
      });
    }
  };

  onClickHandler = async () => {
    var selectedFile = this.state.selectedFile;

    if (selectedFile == null || selectedFile.length === 0) {
      toast.info("Plz, select file");
      return;
    }

    const data = new FormData();
    for (var x = 0; x < selectedFile.length; x++) {
      data.append("body", selectedFile[x]);
    }

    try {
      await this.props.api.uploadJobDescription(data, {
        onUploadProgress: ProgressEvent => {
          this.setState({
            loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
          });
        }
      });

      toast.success("Upload success");
    } catch (error) {
      //toast.error("Upload fail");
    }
  };

  render() {
    return (
      <div className="container bg-white">
        <div className="row">
          <div className="offset-md-3 col-md-6">
            <div className="form-group">
              <label>Upload Job Description</label>
              <input
                type="file"
                className="form-control"
                accept={types.join(",")}
                formEncType="multipart/form-data"
                onChange={this.onChangeHandler}
              />
            </div>
            <div className="form-group">
              <ToastContainer />
              <Progress max="100" color="success" value={this.state.loaded}>
                {Math.round(this.state.loaded, 2)}%
              </Progress>
            </div>

            <button
              type="button"
              disabled={this.state.loaded !== 0}
              className="btn btn-success btn-block"
              onClick={this.onClickHandler}
            >
              Upload
            </button>
          </div>
          <div style={{ marginTop: 40 }} className="offset-md-3 col-md-6">
            <div className="form-group">
              <label>Upload Job Ids</label>
              <input
                type="file"
                className="form-control"
                accept={types.join(",")}
                formEncType="multipart/form-data"
                onChange={this.onChangeJobIdsHandler}
              />
            </div>
            <div className="form-group">
              <ToastContainer />
              <Progress
                max="100"
                color="success"
                value={this.state.loadedJobIds}
              >
                {Math.round(this.state.loadedJobIds, 2)}%
              </Progress>
            </div>

            <button
              type="button"
              disabled={this.state.loadedJobIds !== 0}
              className="btn btn-success btn-block"
              onClick={this.onClickJobIdsHandler}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadJobDescPage;
