const DVideo = artifacts.require('./DVideo.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('DVideo', ([deployer, author]) => {
  let dvideo

  before(async () => {
    dvideo = await DVideo.deployed()
  })

  describe('deployment', async () => { // makes sure deployment happens and the contract has an address and isn't nullyt6\
    it('deploys successfully', async () => {
      const address = await dvideo.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await dvideo.name()
      assert.equal(name, 'DVideo')
    })
  })

  describe('videos', async () => { // makes sure a video exists and is in the blockchain
    let result, videoCount
    const hash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'

    before(async () => {
      result = await dvideo.uploadVideo(hash, 'Video title', { from: author })// does it by doing UploadVideo function with fake hash and fake author to see if it worked
      videoCount = await dvideo.videoCount()
    })

    //check event
    it('creates videos', async () => { // tests the upload video function here
      // SUCESS
      assert.equal(videoCount, 1)
      const event = result.logs[0].args
      assert.equal(event.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(event.hash, hash, 'Hash is correct')
      assert.equal(event.title, 'Video title', 'title is correct')
      assert.equal(event.author, author, 'author is correct')

      // FAILURE: Video must have hash
      await dvideo.uploadVideo('', 'Video title', { from: author }).should.be.rejected;

      // FAILURE: Video must have title
      await dvideo.uploadVideo('Video hash', '', { from: author }).should.be.rejected;
    })

    //check from Struct
    it('lists videos', async () => { // makes sure to check video arguments are returned normally
      const video = await dvideo.videos(videoCount)
      assert.equal(video.id.toNumber(), videoCount.toNumber(), 'id is correct')
      assert.equal(video.hash, hash, 'Hash is correct')
      assert.equal(video.title, 'Video title', 'title is correct')
      assert.equal(video.author, author, 'author is correct')
    })
  })
})