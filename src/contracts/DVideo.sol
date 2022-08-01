pragma solidity ^0.5.0;
// 'truffle console' in the command line allows us to use js in the command line to test variables

// 1. model the video 
// 2. store the video 
// 3. upload video
// 4. list videos


contract DVideo {
  uint public videoCount = 0;
  string public name = "DVideo";
  //Create id=>struct mapping
  // store videos in blockchain
  mapping(uint => Video) public videos; // still store Video's in the mapping of videos[#s]

  //1. model the video
  //Create Struct
  struct Video {
    uint id; 
    string hash; 
    string title; 
    address author; 
  }

  //Create Event
  event VideoUploaded(
    uint id,
    string hash, 
    string title, 
    address author 
  );


  constructor() public {
  }

// upload video
  function uploadVideo(string memory _videoHash, string memory _title) public {
    // Make sure the video hash exists
      require(bytes(_videoHash).length > 0); // if false the code below doesn't execute. the criteria must be met for the rest to occur
    // converts to bytes first in order to show it exists in number
    // Make sure video title exists
    require(bytes(_title).length > 0);
    // Make sure uploader address exists
    require((msg.sender!=address(0))); // checks to make sure the msg.sender is an actual address instead of an 0x0 address which means there isn't an address

    // Increment video id
    videoCount ++;

    // Add video to the contract
    videos[videoCount] = Video(videoCount, _videoHash, _title, msg.sender);


    // Trigger an event
    emit VideoUploaded(videoCount, _videoHash, _title, msg.sender);

  }
}
