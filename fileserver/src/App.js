import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null
    };
  }

  onChangeHandler = e => {
    console.log("onChangeHandler");
    if (this.maxSelectFile(e) && this.checkFileType(e)) {
      this.setState({
        selectedFile: e.target.files[0],
        loaded: 0
      });
    }
  };

  onClickHandler = () => {
    console.log("onClickHandler");
    const data = new FormData();
    data.append("file", this.state.selectedFile);
    axios.post("http://localhost:8000/upload", data, {}).then(res => {
      console.log(res.statusText);
    });
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
    console.log("test file extention");
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
              <button
                type="button"
                className="btn btn-success btn-block"
                onClick={this.onClickHandler}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
