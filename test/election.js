const Election = artifacts.require('./Election.sol');

contract("Election", function(accounts){
    let electionInstance;

    it("INITIALIZES WITH TWO CANDIDATES", function(){
        return Election.deployed().then(function(instance){
            return instance.candidatesCount();
        }).then(function(count){
            assert.equal(count, 2);
        });
    });

    it("INITIALIZES CANDIDATES WITH CORRECT INFORMATION", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(function(candidate){
            console.log("Candidate[1]: ", candidate);
            assert.equal(candidate[0], 1, "contains the correct id");
            assert.equal(candidate[1], "Candidate 1", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");
            return electionInstance.candidates(2);
        }).then(function(candidate){
            console.log("Candidate[2]: ", candidate);
            assert.equal(candidate[0], 2, "contains the correct id");
            assert.equal(candidate[1], "Candidate 2", "contains the correct name");
            assert.equal(candidate[2], 0, "contains the correct vote count");
        })
    })

    it("ALLOWS A VOTER TO CAST VOTE", function(){
        return Election.deployed().then(function(instance){
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, { from : accounts[0] });
        }).then(function(receipt){
            return electionInstance.voters(accounts[0]);
        }).then(function(voted){
            assert(voted, "the voter was marked as voted");
            return electionInstance.candidates(candidateId);
        }).then(function(candidate){
            console.log("Candidate[2]: ", candidate);
            const voteCount = candidate[2];
            assert.equal(voteCount, 1, "Increment the candidate's vote count");
        })
    })
});