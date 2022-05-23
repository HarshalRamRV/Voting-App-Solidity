import React, { useState, useEffect } from "react";
import Table from 'react-bootstrap';
import Web3 from 'web3';
import ElectionContract from "./contracts/Election.json";
import getWeb3 from "./getWeb3";

import "./App.css";

const App = () => {
  const [accountAddress, setAccountAddress] = useState("");
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [candidatesList, setCandidatesList] = useState([]);
  // const [candidateResults, setCandidateResults] = useState();
  const [loading, setLoading] = useState();
  const [balance, setBalance] = useState(0);
  const [web3, setWeb3] = useState();
  const [electionContract, setElectionContract] = useState(); 

  // console.log("accountAddress", accountAddress);
  // console.log("CandidatesCount: ", candidatesCount);
  console.log("candidatesList: ", candidatesList);
  // // console.log("candidateResults", candidateResults);
  // console.log("loading", loading);
  // console.log("balance", balance);
  // console.log("web3", web3);
  // console.log("electionContract", electionContract);

  const loadBlockchainData = async() => {
    if(typeof window.ethereum !== 'undefined'){
      const web3 = new Web3(window.ethereum);

      window.ethereum.enable().catch(error => {
        // User denied account access
        console.log("ERROR: ", error);
      });

      const networkId = await web3.eth.net.getId();
      console.log("NetworkId: ", networkId);

      const accounts = await web3.eth.getAccounts();

      // Load Balance
      if(typeof accounts[0] !== 'undefined'){
        const balance = await web3.eth.getBalance(accounts[0]);
        // this.setState({ account: accounts[0], balance, web3: web3});
        setAccountAddress(accounts[0]);
        setBalance(balance);
        setWeb3(web3);
      }else{
        window.alert('Please Login with MetaMask');
      } 

      // LOAD CONTRACTS
      try{
        const Election = new web3.eth.Contract(ElectionContract.abi, ElectionContract.networks[networkId].address);
        setElectionContract(Election);

        const countElectionCandidates = await Election.methods.candidatesCount().call();

        // Setting candidates count
        setCandidatesCount(countElectionCandidates);

      }catch(error){
        console.log("ERROR encounterred while loading contracts", error);
      }
    }
  }

  const getCandidatesList = async() => {
    for(let iterator = 1; iterator <= candidatesCount; iterator++){
      const candidateInfo = await electionContract.methods.candidates(iterator).call();
      console.log("candidateInfo:::", candidateInfo);
      let candidateId = candidateInfo[0];
      let candidateName = candidateInfo[1];
      let candidateVoteCount = candidateInfo[2];

      // Create a new candidate object to be pushed into candidatesList 
      const candidateInfoObject = {
        candidateId,
        candidateName,
        candidateVoteCount
      }

      // Copy current contents of candidatesList into candidatesArray
      const candidatesArray = candidatesList;

      // Push the created object `candidateInfoObject` into candidatesArray
      candidatesArray.push(candidateInfoObject);

      // Update the candidatesList
      setCandidatesList(candidatesArray);
    }
  }

  useEffect(() => {
    console.log("inside useEFfect:::::");
    loadBlockchainData();
    if(candidatesCount > 0){
      getCandidatesList();
    }
  },[candidatesCount]);

  const castVote = () => {
    console.log("Vote Casted");
  }

  return(
    <div className="container-fluid ">
      <div className="row">
          <div className="col-lg-12 election-container">
            <h1 className="text-center">Election Results</h1>
            <div id="loader">
              <p className="text-center">Loading...</p>
            </div>
            <div id="content">
              <Table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Candidate Name</th>
                    <th>Candidates Vote Count</th>
                  </tr>
                </thead>
                <tbody>
                    
                </tbody>
              </Table>
              {/* <table className="table">
                <thead className="candidateListTableHead">
                  <tr className="candidateListTableRow">
                    <th scope="col" className="candidateListTableHeader">#</th>
                    <th scope="col" className="candidateListTableHeader">Name</th>
                    <th scope="col" className="candidateListTableHeader">Votes</th>
                  </tr>
                </thead>
                <tbody id="candidatesResults">
                </tbody>
              </table> */}
              <form onSubmit={ castVote }>
                <div className="form-group">
                  <label htmlFor="candidatesSelect">Select Candidate</label>
                  <select className="form-control" id="candidatesSelect">
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">Vote</button>
              </form>
              <p className="accountAddressClass">{ accountAddress }</p>
            </div>
          </div>
      </div>
    </div>
  );
}

export default App;
