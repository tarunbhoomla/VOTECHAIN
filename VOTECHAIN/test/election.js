var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  var electionInstance;

  it("initialization with four candidates", function() {
    return Election.deployed().then(function(instance) {
      return instance.getCandidatesCount();
    }).then(function(count) {
      assert.equal(count, 4);
    });
  });

  it("candidate initialization with correct property values", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.getCandidate(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "CORRECT ID");
      assert.equal(candidate[1], "Donald Trump", "CORRECT NAME");
      assert.equal(candidate[2], 0, "CORRECT VOTE COUNT");
      return electionInstance.getCandidate(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "CORRECT ID");
      assert.equal(candidate[1], "Joe Biden", "CORRECT NAME");
      assert.equal(candidate[2], 0, "CORRECT VOTE COUNT");
      return electionInstance.getCandidate(3);
    }).then(function (candidate) {
      assert.equal(candidate[0], 3, "CORRECT ID");
      assert.equal(candidate[1], "Barack Obama", "CORRECT NAME");
      assert.equal(candidate[2], 0, "CORRECT VOTE COUNT");
      return electionInstance.getCandidate(4);
    }).then(function (candidate) {
      assert.equal(candidate[0], 4, "CORRECT ID");
      assert.equal(candidate[1], "Elon Musk", "CORRECT NAME");
      assert.equal(candidate[2], 0, "CORRECT VOTE COUNT");
    });
  });

  it("voter casting a vote for a candidate", function () {
    return Election.deployed().then(function (instance) {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    }).then(function (receipt) {
      return electionInstance.getVoter(accounts[0]);
    }).then(function (voted) {
      assert(voted, "VOTER MARKED AS VOTED");
      return electionInstance.getCandidate(candidateId);
    }).then(function (candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "CANDIDATE VOTE COUNT INCREMENTED");
    });
  });

  it("throw exception for invalid candidate voting", function () {
    return Election.deployed().then(function (instance) {
      electionInstance = instance;
      return electionInstance.vote(10, { from: accounts[1] });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf("revert") >= 0, "ERROR MESSAGE MUST CONTAIN REVERT");
      return electionInstance.getCandidate(1);
    }).then(function (candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "DONALD TRUMP DID NOT RECEIVE ANY VOTES");
      return electionInstance.getCandidate(2);
    }).then(function (candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "JOE BIDEN DID NOT RECEIVE ANY VOTES");
      return electionInstance.getCandidate(3);
    }).then(function (candidate3) {
      var voteCount = candidate3[2];
      assert.equal(voteCount, 0, "BARACK OBAMA DID NOT RECEIVE ANY VOTES");
      return electionInstance.getCandidate(4);
    }).then(function (candidate4) {
      var voteCount = candidate4[2];
      assert.equal(voteCount, 0, "ELON MUSK DID NOT RECEIVE ANY VOTES");
    });
  });

  it("throw exception for double voting", function () {
    return Election.deployed().then(function (instance) {
      electionInstance = instance;
      candidateId = 2;
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(function (receipt) {
      return electionInstance.getVoter(accounts[1]);
    }).then(function (voter) {
      assert(voter, "VOTER MARKED AS VOTED");
      return electionInstance.getCandidate(candidateId);
    }).then(function (candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "FIRST VOTE ACCEPTED");
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function (error) {
      assert(error.message.indexOf("revert") >= 0, "ERROR MESSAGE MUST CONTAIN REVERT");
      return electionInstance.getCandidate(1);
    }).then(function (candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "DONALD TRUMP DID NOT RECEIVE ANY VOTES");
      return electionInstance.getCandidate(2);
    }).then(function (candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "JOE BIDEN DID NOT RECEIVE ANY MORE VOTES");
      return electionInstance.getCandidate(3);
    }).then(function (candidate3) {
      var voteCount = candidate3[2];
      assert.equal(voteCount, 0, "BARACK OBAMA DID NOT RECEIVE ANY VOTES");
      return electionInstance.getCandidate(4);
    }).then(function (candidate4) {
      var voteCount = candidate4[2];
      assert.equal(voteCount, 0, "ELON MUSK DID NOT RECEIVE ANY VOTES");
    });
  });
});