// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract DNote {
  struct Notebook {
    address owner;
    string[] notes;
  }

  uint256 NOTE_MAX_LENGTH = 1000;

  mapping(address => Notebook) notebooks;
  mapping(address => bool) test;

  function read() external view returns (string[] memory) {
    Notebook memory notebook = notebooks[msg.sender];
    return notebook.notes;
  }

  function write(string memory note) external {
    require(bytes(note).length < NOTE_MAX_LENGTH, "The note limit is 100");
    NOTE_MAX_LENGTH = NOTE_MAX_LENGTH - 1;
    Notebook memory notebook = notebooks[msg.sender];
    if (notebook.owner == address(0)) {
      // Notebook doesn't exist
      notebook.owner = msg.sender;
      notebook.notes = new string[](1);
      notebook.notes[0] = note;
    } else {
      uint256 newSize = notebook.notes.length + 1;
      string[] memory newNotes = new string[](newSize);
      for (uint256 i = 0; i < notebook.notes.length; ++i) {
        newNotes[i] = notebook.notes[i];
      }
      newNotes[newSize - 1] = note;
      notebook.notes = newNotes;
    }
    notebooks[msg.sender] = notebook;
  }

  function del(uint256 index, bool all) external {
    Notebook memory notebook = notebooks[msg.sender];
    require(notebook.owner != address(0), "Fail to find the notebook");
    require(notebook.notes.length > index, "Index is out of notebook notes range");
    if (all) {
      // Delete all notes
      notebook.notes = new string[](0);
    } else {
      uint256 newSize = notebook.notes.length - 1;
      string[] memory newNotes = new string[](newSize);
      for (uint256 i = 0; i < notebook.notes.length; ++i) {
        if (i < index) {
          newNotes[i] = notebook.notes[i];
        } else if (i > index) {
          newNotes[i - 1] = notebook.notes[i];
        }
      }
      notebook.notes = newNotes;
    }
    notebooks[msg.sender] = notebook;
  }

  // Function to receive Ether. msg.data must be empty
  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}
}
