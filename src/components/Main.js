import React, { Component } from 'react';

class Main extends Component {

  render() {
    return (
      <div className="container-fluid text-monospace">
      <br></br>
      &nbsp;
      <br></br>
        <div className="row">
          <div className="col-md-10">
            <div className="embed-responsive embed-responsive-16by9" style={{ maxHeight: '768px'}}>
              {/* Video... */}
              <video 
                src={`https://ipfs.infura.io/ipfs/${this.props.currentHash}`}
                controls
              ></video>
            </div>
            <h3>{this.props.currentTitle}</h3>
          </div>
          <div className="col-md-2 overflow-auto text-center" style={{ maxHeight: '768px', minWidth: '175px' }}>
            <h5><b>Share Video </b></h5>
            <form onSubmit={(event) => {
              {/* Upload Video...*/}
              event.preventDefault();
              const title = this.videoTitle.value 
              this.props.uploadVideo(title)

            }} >
              &nbsp;
              {/* Get Video...*/}
              <input type='file' accept='.mp4, .mkv, .ogg, .wmv' onChange={this.props.captureFile} style={{width: '250px'}} />
              <div className="form-group mr-sm-2">
                {/* Input Title*/}
                <input 
                required
                id='videoTitle'
                type='text' 
                ref={(input) => {this.videoTitle = input }}
                className='form-control-sm'
                placeholder='Title...'
                />

              </div>
              {/* Upload Button */}
              <button type='submit' className='btn btn-danger btn-block btn-sm'>Upload!</button>
              &nbsp;
            </form>
            {/* Map Video...*/}
            {this.props.videos.map((video, key) => {
              return(
                <div className='card mb-4 text-center bg-secondary mx-auto' style={{width: '175px'}} key={key}>
                  <div className='card-title bg-dark'>
                    <small className='text-white'><b>{video.title}</b></small>
                  </div>
                  <div>
                    <p onClick={() => {this.props.changeVideo(video.hash, video.title)}}>
                      <video 
                      src={`https://ipfs.infura.io/ipfs/${video.hash}`}
                      style={{width: '150px'}}
                      />
                    </p>
                    </div>

                  </div>
              )
            })}

              {/* Return Video...*/}
              <div style={{ width: '175px'}}>
                <div className="card-title bg-dark">
                  <small className="text-white"><b>{/*Video title*/}</b></small>
                </div>
                  <div>
                    {/* Change Video...*/}
                    {/* Return Side Videos...*/}
                  </div>
              </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Main;