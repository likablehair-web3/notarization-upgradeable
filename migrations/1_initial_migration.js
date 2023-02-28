const Notarize = artifacts.require("Notarize")
const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

module.exports = async (deployer, network, accounts) => {
    deployer = accounts[0];


    let IS_UPGRADE = true;

    let NOTARIZE_ADDRESS = "0xE618DF87c7F011aE344F3a9eCA8f7ec99eE35eF7";

    if (!IS_UPGRADE) {
        console.log("Contract is being deployed...");
        const notaAddress = await deployProxy(Notarize, { from: deployer })
        console.log("Deployed Notarize contract @ :", notaAddress.address)
    } else {
        console.log("Contract is being upgraded...");
        const notaAddress = await upgradeProxy(NOTARIZE_ADDRESS, Notarize, { from: deployer })
        console.log("Upgraded Notarize contract @ :", notaAddress.address)
    }

}