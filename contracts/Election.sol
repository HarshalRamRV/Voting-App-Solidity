// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.9.0;

contract Election  {
    // // Store Candidate
    // string public candidate;

    // Candidate Model.
    struct Candidate  {
        uint id;
        string name;
        uint voteCount;
    }

    // To fetch in truffle console , we do let candidateUno = await Election.candidates(1)
    // and then access 
    //          `id` by candidateUno[0], 
    //          `name` by candidateUno[1] 
    //          `voteCount` by candidateUno[2].
    
    // Something like candidateUno.id won't work as EVM doesn't really know what a struct is or how to build a struct (when compiled)

    // To convert BN(Big Number) `id` of a candidate, then we would do something like this 
    //          candidateUno[0].toNumber()

    // To convert BN(Big Number) `voteCount` of a candidate, then we would do something like this 
    //          candidateUno[2].toNumber() 

    // Store Candidate. No way to see size of mapping or iterate(loop) over in solidity.
    mapping(uint => Candidate) public candidates;
    
    // Fetch Candidate

    // Store Candidates Count(No. of candidates). Counter cache to store size of mapping or no of candidates in election.
    // Each time we insert a candidate in mapping, this counter is increased. Defaults to 0 if unassigned.
    uint public candidatesCount;

    // Add a new candidate
    function addCandidate(string memory _name) private {
        candidatesCount++;
        candidates[candidatesCount] = Candidate(candidatesCount, _name, 0);
    }

    // Constructor
    constructor() {
        // When our is migrated and deployed, we call the list of candidates who will be standing in the election.
        addCandidate("Candidate 1");
        addCandidate("Candidate 2");
    }
    
    // Read Candidate
}