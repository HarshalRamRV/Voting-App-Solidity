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
});