pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

contract Election {
    // Candidate struct
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    // Candidates mapping - contains every presidential candidate
    mapping(uint => Candidate) private candidates;
    // Number of presidential candidates
    uint private candidatesCount;
    // Voters mapping - contains every user that has voted
    mapping(address => bool) private voters;

    // Public constructor - adds the candidates
    constructor() public {
        addCandidate("Donald Trump");
        addCandidate("Joe Biden");
        addCandidate("Barack Obama");
        addCandidate("Elon Musk");
    }

    // Function for adding presidential candidates
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Function for voting for a specific candidate
    function vote(uint _candidateId) public {
        require(!voters[msg.sender]);

        require(_candidateId > 0 && _candidateId <= candidatesCount);

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount++;
    }

    // Getter function for a specific candidate
    function getCandidate(uint candidateId) public view returns (Candidate memory) {
        return candidates[candidateId];
    }

    // Getter function for a specific candidate in tuple format
    function getCandidateJS(uint candidateID) public view returns (uint, string memory, uint) {
        Candidate memory c = candidates[candidateID];

        return (c.id, c.name, c.voteCount);
    }

    // Getter function for the number of candidates
    function getCandidatesCount() public view returns (uint) {
        return candidatesCount;
    }

    // Getter function for a specific voter
    function getVoter(address voterAddress) public view returns (bool) {
        return voters[voterAddress];
    }

}