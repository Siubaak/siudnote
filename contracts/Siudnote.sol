// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract DNote {
  struct Notebook {
    address owner;
    string[] notes;
  }

  struct Setting {
    address owner;
    uint256 inboxStatus; // 0: closed; 1: accept all; 2: accept list;
    address[] inboxAcceptList;
  }

  uint256 NOTE_MAX_LENGTH = 1000;

  mapping(address => Notebook) notebooks;
  mapping(address => Notebook) inboxs;
  mapping(address => Setting) settings;

  // Notebook operations
  function read() external view returns (string[] memory) {
    Notebook memory notebook = notebooks[msg.sender];
    return notebook.notes;
  }

  function write(string memory note) public {
    require(bytes(note).length < NOTE_MAX_LENGTH, "The note limit exceeded");
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

  // Inbox operations
  function readInbox() external view returns (string[] memory) {
    Notebook memory inbox = inboxs[msg.sender];
    return inbox.notes;
  }

  function writeInbox(string memory note, address to) external {
    require(bytes(note).length < NOTE_MAX_LENGTH, "The note limit exceeded");
    require(to != address(0), "The receiver is empty");

    Setting memory setting = settings[to];

    if (setting.owner == address(0)) {
      // Setting doesn't exist
      setting.owner = to;
      settings[to] = setting;
    }

    require(setting.inboxStatus != 0, "The receiver's inbox is closed");

    if (setting.inboxStatus == 1) {
      bool accepted;
      for (uint256 i = 0; i < setting.inboxAcceptList.length; ++i) {
        if (to == setting.inboxAcceptList[i]) {
          accepted = true;
          break;
        }
      }
      require(accepted, "The sender isn't accepted by the receiver");
    }

    Notebook memory inbox = inboxs[to];
    if (inbox.owner == address(0)) {
      // Inbox doesn't exist
      inbox.owner = to;
      inbox.notes = new string[](1);
      inbox.notes[0] = note;
    } else {
      uint256 newSize = inbox.notes.length + 1;
      string[] memory newNotes = new string[](newSize);
      for (uint256 i = 0; i < inbox.notes.length; ++i) {
        newNotes[i] = inbox.notes[i];
      }
      newNotes[newSize - 1] = note;
      inbox.notes = newNotes;
    }
    inboxs[to] = inbox;
  }

  function delInboxNote(uint256 index, bool all) public {
    Notebook memory inbox = inboxs[msg.sender];
    require(inbox.owner != address(0), "Fail to find the inbox");
    require(inbox.notes.length > index, "Index is out of inbox notes range");
    if (all) {
      // Delete all notes
      inbox.notes = new string[](0);
    } else {
      uint256 newSize = inbox.notes.length - 1;
      string[] memory newNotes = new string[](newSize);
      for (uint256 i = 0; i < inbox.notes.length; ++i) {
        if (i < index) {
          newNotes[i] = inbox.notes[i];
        } else if (i > index) {
          newNotes[i - 1] = inbox.notes[i];
        }
      }
      inbox.notes = newNotes;
    }
    inboxs[msg.sender] = inbox;
  }

  function acceptInboxNote(uint256 index) external {
    Notebook memory inbox = inboxs[msg.sender];
    require(inbox.owner != address(0), "Fail to find the inbox");
    require(inbox.notes.length > index, "Index is out of inbox notes range");
    string memory note = inbox.notes[index];
    write(note); // write first in case of failure
    delInboxNote(index, false); // delete inbox note after write success
  }

  // Setting operations
  function getSetting() external view returns (Setting memory) {
    return settings[msg.sender];
  }

  function setInboxStatus(uint256 inboxStatus) external {
    require(inboxStatus == 0 || inboxStatus == 1 || inboxStatus == 2, "Invaild inbox status");
    Setting memory setting = settings[msg.sender];
    if (setting.owner != address(0)) {
      setting.owner = msg.sender;
    }
    setting.inboxStatus = inboxStatus;
    settings[msg.sender] = setting;
  }

  function addInboxAcceptAddress(address inboxAcceptAddress) external {
    Setting memory setting = settings[msg.sender];
    if (setting.owner != address(0)) {
      setting.owner = msg.sender;
      setting.inboxAcceptList = new address[](1);
      setting.inboxAcceptList[0] = inboxAcceptAddress;
    } else {
      uint256 newSize = setting.inboxAcceptList.length + 1;
      address[] memory newInboxAcceptList = new address[](newSize);
      for (uint256 i = 0; i < setting.inboxAcceptList.length; ++i) {
        newInboxAcceptList[i] = setting.inboxAcceptList[i];
      }
      newInboxAcceptList[newSize - 1] = inboxAcceptAddress;
      setting.inboxAcceptList = newInboxAcceptList;
    }
    settings[msg.sender] = setting;
  }

  function delInboxAcceptAddress(uint256 index, bool all) external {
    Setting memory setting = settings[msg.sender];
    require(setting.inboxAcceptList.length > index, "Index is out of inbox notes range");
    if (all) {
      // Delete all inbox accept list
      setting.inboxAcceptList = new address[](0);
    } else {
      uint256 newSize = setting.inboxAcceptList.length + 1;
      address[] memory newInboxAcceptList = new address[](newSize);
      for (uint256 i = 0; i < setting.inboxAcceptList.length; ++i) {
        if (i < index) {
          newInboxAcceptList[i] = setting.inboxAcceptList[i];
        } else if (i > index) {
          newInboxAcceptList[i - 1] = setting.inboxAcceptList[i];
        }
      }
      setting.inboxAcceptList = newInboxAcceptList;
    }
    settings[msg.sender] = setting;
  }

  // Function to receive Ether. msg.data must be empty
  receive() external payable {}

  // Fallback function is called when msg.data is not empty
  fallback() external payable {}
}
