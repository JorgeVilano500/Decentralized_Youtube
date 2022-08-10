import React, { Component } from 'react';
import DVideo from '../abis/DVideo.json'
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';
// import * as IPFS from 'ipfs-core' // library didn't work in creating an ipfs connection 

 

//Declare IPFS
// idk why ipfs didnt work at first it started working for the deso IG without any fix.. 
const ipfsClient = require('ipfs-http-client') // I see how to stop the issue, just downgrade about 2-4 versions below current because of bugs with current browser. 
const ipfs = ipfsClient.create({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
// const ipfs =  IPFS.create()// doesnt work cus library doesn't work 


class App extends Component {
  
  async componentDidMount() { // ComponentWillMount is depreciated, it is replaced by componentDidMount
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      // await window.ethereum.enable()
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    this.setState({
      account: accounts[0]
    })
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    //Load accounts
    //Add first account the the state
    // const accounts = await web3.eth.getAccounts();
    // this.setState({
    //   account: accounts[0]
    // })

    //Get network ID
    //Get network data
    const networkId = await web3.eth.net.getId(); // forgot the await for this method. make sure to always hae a await for web3.eth methods or web3 methods in general
    // gets the id of the network/blockchain we want to connect to
    // console.log(networkId)
    const networkData = DVideo.networks[networkId] 
    // console.log(DVideo.networks);

    //Check if net data exists, then
      //Assign dvideo contract to a variable
      if (networkData) {
        const dvideo = new web3.eth.Contract(DVideo.abi, networkData.address)// loads the contract into the blockchain Im pretty sure
        this.setState({dvideo}) // we can use the dvideo contract and whats inside of it later in the program

        //Add dvideo to the state
        const videosCount = await dvideo.methods.videoCount().call(); // have to put .call after each method from the blockchain beause of web3
        this.setState({videosCount})


        // load videos, sort by newest
        for (let i = videosCount; i >=1; i--) {
          const video = await dvideo.methods.videos(i).call() // we all each video in the array we have in the backend blockchain
          this.setState({
            videos: [...this.state.videos, video ] // then we add each video from the last state to the newer state. 
          })
        }

        //Set Latest video with tile to view as default 
        const latest = await dvideo.methods.videos(videosCount).call() // videosCall will cause the latest video to be put
        this.setState({
          currentHash: latest.hash, 
          currentTitle: latest.title
        })
        this.setState({loading: false})

      }
      else {
        window.alert('The following contract has not been deployed to the network')
      }



      //Check videoAmounts
      //Add videAmounts to the state

      //Iterate throught videos and add them to the state (by newest)


      //Set latest video and it's title to view as default 
      //Set loading state to false

      //If network data doesn't exisits, log error
  }

  //Get video
  captureFile = event => {
    event.preventDefault()
    const file = event.target.files[0] // this is how we extract the file when we input it into the system 
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result) // when the function is done, it will set the video as a buffer array and this will be needed to upload to ipfs
      })
      console.log('buffer', this.state.buffer)
    }
  }

  //Upload video
  uploadVideo = async title => {
    console.log('Submitting to IPFS')

    // add to IPFS...  it needs to be uploaded to IPFS as a buffer 
    const {cid } = await ipfs.add(this.state.buffer)
    console.log('CID', cid);
    this.setState({loading: true})
    this.state.dvideo.methods.uploadVideo(cid._baseCache.get('z'), title).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({loading: false})
    })
  }


  //Change Video
  changeVideo = (hash, title) => {
    this.setState({'currentHash': hash})
    this.setState({'currentTitle': title})
  }

  constructor(props) {
    super(props)
    this.state = {
      buffer: null,
      account: '',
      dvideo: '',
      videos: [],
      loading: true,
      currentHash: null,
      currentTitle: null
    }

    //Bind functions
  }

  render() {
    return (
      <div>
        <Navbar 
          //Account
          account={this.state.account}
        />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              //states&functions
              captureFile={this.captureFile}
              uploadVideo={this.uploadVideo}
              currentHash={this.state.currentHash}
              currentTitle={this.state.currentTitle}
              videos={this.state.videos}
              changeVideo={this.changeVideo}
            />
        }
      </div>
    );
  }
}

export default App;