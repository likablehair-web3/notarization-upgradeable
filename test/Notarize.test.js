const { BN, constants, expectEvent, expectRevert, time } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))

const Notarize = artifacts.require("Notarize");
const { ZERO_ADDRESS } = constants;
const fromWei = (x) => web3.utils.fromWei(x.toString());
const toWei = (x) => web3.utils.toWei(x.toString());

const HashWriter = '0x9bd7b39e404ec8163ddb5278c0044198ca50a2bf864985cbc93f934a5afed5d6';
const AdminRole = '0x0000000000000000000000000000000000000000000000000000000000000000';
const hash1 = "0x581e485160710c46cf71ea355b87f213e8e50cd532332a6cfe4abdd9145758fc";
const hash2 = "0x079c46f531ba2c32c9ed181feaf1c7561db1f6740347c93f5a08d6b581b94a5a";


contract('Chimera Notarization Test', function (accounts) {

  const Admin = accounts[0];
  const HashWriter1 = accounts[1];

  it('retrieve  contract', async function () {
    NotarizeContract = await Notarize.deployed();
    expect(NotarizeContract.address).to.be.not.equal(ZERO_ADDRESS);
    expect(NotarizeContract.address).to.match(/0x[0-9a-fA-F]{40}/);
  });

  it('Contract owner assign hash writer role to account1', async function () {

    await expectRevert(NotarizeContract.setHashWriterRole(HashWriter1, {from: HashWriter1}),
          'AccessControl: account ' + HashWriter1.toLowerCase() + ' is missing role '+ AdminRole);
    await NotarizeContract.setHashWriterRole(HashWriter1, {from: Admin});
    expect(await NotarizeContract.hasRole(HashWriter, HashWriter1)).to.be.true;
  });

  it('An hash writer address cannot assign the same role to another address', async function () {

    await expectRevert(NotarizeContract.setHashWriterRole(HashWriter1, {from: HashWriter1}),
          'AccessControl: account ' + HashWriter1.toLowerCase() + ' is missing role '+ AdminRole);
  });

  it('An admin address cannot notarize a document', async function () {

    await expectRevert(NotarizeContract.addNewDocument("Example1", hash1, {from: Admin}),
          'AccessControl: account ' + Admin.toLowerCase() + ' is missing role '+ HashWriter);
  });

  it('An hash writer address can notarize a document and get notarized doc back', async function(){
    await NotarizeContract.addNewDocument('Example1', hash1, {from: HashWriter1})
    tot = await NotarizeContract.getDocsCount();
    console.log("Total document registerd : " , tot.toString());
    docInfo = await NotarizeContract.getDocInfo(tot-1);
    console.log(docInfo[0].toString() + ':' + docInfo[1].toString()); 

  })

  it('An hash writer address cannot notarize a document twice', async function(){
    await expectRevert(NotarizeContract.addNewDocument('Example1', hash1, {from: HashWriter1}), "Hash already notirized")
    tot = await NotarizeContract.getDocsCount();
    console.log("Total document registerd : " , tot.toString());
  })

  it('An hash writer address can notarize another document and get notarized doc back', async function(){
    await NotarizeContract.addNewDocument('Chimera:Test', hash2, {from: HashWriter1})
    tot = await NotarizeContract.getDocsCount();
    console.log("Total document registerd : " , tot.toString());
    docInfo = await NotarizeContract.getDocInfo(tot-1);
    console.log(docInfo[0].toString() + ':' + docInfo[1].toString()); 

  })


  it('How many request on document info ', async function(){
    getDocInfoCounter = await NotarizeContract.getInfoCounter()
    console.log(getDocInfoCounter.toString())
    tx = await NotarizeContract.getDocInfoAndCounter(tot-1);
    getDocInfoCounter = await NotarizeContract.getInfoCounter()
    console.log(getDocInfoCounter.toString())
    tx = await NotarizeContract.getDocInfoAndCounter(tot-1);
    getDocInfoCounter = await NotarizeContract.getInfoCounter()
    console.log(getDocInfoCounter.toString())
    tx = await NotarizeContract.getDocInfoAndCounter(tot-1);
    getDocInfoCounter = await NotarizeContract.getInfoCounter()
    console.log(getDocInfoCounter.toString())
    tx = await NotarizeContract.getDocInfoAndCounter(tot-1);
    getDocInfoCounter = await NotarizeContract.getInfoCounter()
    console.log(getDocInfoCounter.toString())
    tx = await NotarizeContract.getDocInfoAndCounter(tot-1);
    getDocInfoCounter = await NotarizeContract.getInfoCounter()
    console.log(getDocInfoCounter.toString())
    tx = await NotarizeContract.getDocInfoAndCounter(tot-1);
    getDocInfoCounter = await NotarizeContract.getInfoCounter()
    console.log(getDocInfoCounter.toString())
  })
  

  
  it('it is document already registered ', async function(){
    expect( await NotarizeContract.getRegisteredHash(hash1)).to.be.true;
    const hashCorrupted = "0x581e485160710c46cf71ea355b87f213e8e503d532332a6cfe4abdd9245758fc";

    expect( await NotarizeContract.getRegisteredHash(hashCorrupted)).to.be.false
  })
  

});
