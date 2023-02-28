// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlEnumerableUpgradeable.sol";

contract Notarize is OwnableUpgradeable, AccessControlEnumerableUpgradeable {

  using CountersUpgradeable for CountersUpgradeable.Counter;
  

  bytes32 public constant HASH_WRITER = keccak256("HASH_WRITER");

  CountersUpgradeable.Counter private _docCounter;
  mapping(uint256 => Doc) private _documents;
  mapping(bytes32 => bool) private _regHashes;

  event DocHasAdded(uint256 docCounter, string docUrl, bytes32 docHash);

  struct Doc{
    string docUrl;
    bytes32 docHash;
  }
  
  CountersUpgradeable.Counter public getInfoCounter;

  function initialize() external initializer {
    __Ownable_init_unchained();
    _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
  }

  function setHashWriterRole(address _hashWriter) external onlyRole(DEFAULT_ADMIN_ROLE){
    grantRole(HASH_WRITER, _hashWriter);
  }

  function addNewDocument(string memory _url, bytes32 _hash) external onlyRole(HASH_WRITER){
    require(!_regHashes[_hash], "Hash already notirized");
    uint256 counter = _docCounter.current();
    _documents[counter] = Doc({docUrl: _url, docHash: _hash});
    _regHashes[_hash] = true;
    _docCounter.increment();
    emit DocHasAdded(counter, _url, _hash);
  }


  function getDocInfo(uint256 _num) external view returns  ( string memory, bytes32) {
    return (_documents[_num].docUrl, _documents[_num].docHash);
  }

  function getDocInfoAndCounter(uint256 _num) external  returns  ( string memory, bytes32) {
    getInfoCounter.increment();
    return (_documents[_num].docUrl, _documents[_num].docHash);
  }

 function getDocsCount() external view returns  (uint256) {
  return _docCounter.current();
  }

  function getRegisteredHash(bytes32 _hash) external view returns (bool) {
    return _regHashes[_hash];

  }

}
