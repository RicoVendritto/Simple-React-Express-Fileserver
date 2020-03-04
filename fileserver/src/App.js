import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Progress } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0
    };
  }

  componentDidMount = async () => {
    console.log("componentDidMount");
    const resp = await axios.get("localhost:8000");
    console.log(resp);
  };

  onChangeHandler = e => {
    console.log("onChangeHandler");
    if (
      this.maxSelectFile(e) &&
      this.checkFileType(e) &&
      this.checkFileSize(e)
    ) {
      this.setState({
        selectedFile: e.target.files[0],
        loaded: 0
      });
    }
  };

  onClickHandler = () => {
    console.log("onClickHandler");
    if (
      this.state.selectedFile !== undefined &&
      this.state.selectedFile !== null
    ) {
      const data = new FormData();
      data.append("file", this.state.selectedFile);
      axios
        .post("http://localhost:8000/upload", data, {
          onUploadProgress: ProgressEvent => {
            console.log(ProgressEvent);
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
            });
          }
        })
        .then(res => {
          console.log(res.statusText);
          this.setState({
            selectedFile: null
          });
        });
    } else {
      console.log("No file selected");
    }
  };

  maxSelectFile = e => {
    console.log("maxSelectFile");
    let files = e.target.files;
    if (files.length > 3) {
      const msg = "Only 3 images can be uploaded at a time";
      e.target.value = null;
      console.log(msg);
      return false;
    }
    return true;
  };

  checkFileType = e => {
    console.log("checkFileType");
    let files = e.target.files;
    let err = "";
    const types = ["image/png", "image/jpeg", "image/gif"];
    for (let i = 0; i < files.length; i++) {
      if (types.every(type => files[i].type !== type)) {
        err += files[i].type + " is not a supported format\n";
      }
    }
    if (err !== "") {
      e.target.value = null;
      console.log(err);
      return false;
    }
    return true;
  };

  checkFileSize = e => {
    console.log("checkFileSize");
    let files = e.target.files;
    let size = 9999999;
    let err = "";
    for (let i = 0; i < files.length; i++) {
      console.log(files[i].size);
      if (files[i].size > size) {
        err += files[i].type + " is too large, please select a smaller file\n";
      }
    }
    if (err !== "") {
      e.target.value = null;
      console.log(err);
      return false;
    }
    return true;
  };

  render() {
    console.log(this.state);
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <form method="post" action="#" id="#">
                <div className="form-group files">
                  <label>Upload Your File </label>
                  <input
                    type="file"
                    className="form-control"
                    name="file"
                    onChange={this.onChangeHandler}
                  />
                </div>
              </form>
              <div className="form-group">
                <Progress max="100" color="success" value={this.state.loaded}>
                  {Math.round(this.state.loaded, 2)}%
                </Progress>
              </div>
              <button
                type="button"
                className="btn btn-success btn-block"
                onClick={this.onClickHandler}
              >
                Upload
              </button>
              <div>uploaded files</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
