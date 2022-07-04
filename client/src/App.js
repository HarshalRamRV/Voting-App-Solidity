import React, { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import Web3 from 'web3';
import ElectionContract from "./contracts/Election.json";
import Navbar from './Navbar';

import "./App.css";


const App = () => {
  const [, updateState] = React.useState();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const [accountAddress, setAccountAddress] = useState("");
  const [account, setAccount] = useState(null)
  const [candidatesCount, setCandidatesCount] = useState(0);
  const [candidatesList, setCandidatesList] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showForm, setShowForm] = useState(false);
  // const [candidateResults, setCandidateResults] = useState();
  const [loading, setLoading] = useState();
  const [balance, setBalance] = useState(0);
  const [web3, setWeb3] = useState();
  const [electionContract, setElectionContract] = useState(); 

  // console.log("accountAddress", accountAddress);
  // console.log("CandidatesCount: ", candidatesCount);
  console.log("candidatesList: ", candidatesList);
  // // console.log("candidateResults", candidateResults);
  console.log("selectedCandidate", selectedCandidate);
  console.log("balance", balance);
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

        // TODO: EVENT LISTENING for emitted events from Election

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

  const castVote = async() => {
    console.log("Vote Casted: ", selectedCandidate, accountAddress);
    setLoading(true);
    await electionContract.methods.vote(selectedCandidate).send({ from : accountAddress });
    setLoading(false);
    setShowForm(false);
  }

  const selectCandidate = (e) => {
    e.preventDefault();
    console.log("CandidateSelected: ", e.target.id);
    setSelectedCandidate(e.target.id);
  }

  const checkVoted = async() => {
      const check = await electionContract.methods.voters(accountAddress).call();
      console.log("Check in checkVoted: ", check);
      if(check){
        setShowForm(false);
      }else{
        setShowForm(true);
      }
      return check;
  }


  useEffect(() => {
    console.log("INSIDE USEEFFECT::::::::::::::::::::::::::::::::::::::::::");
    loadBlockchainData();
    if(electionContract && candidatesCount > 0){
      console.log("Inside check for candidates count > 0 in useEffect")
      getCandidatesList();
      checkVoted();
    }
  },[candidatesCount]);

  return(
    <div className="con">
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
        <a
          className="navbar-brand col-sm-3 col-md-2 ms-3"
          target="_blank"
          rel="noopener noreferrer"
        >
          Online Voting Application
        </a>

          <small><a class="nav-link" style={{"color":"white"}}><span id="account"> {accountAddress}</span></a></small>

      </nav>
    <div className="container p-5">
      <div className="row electionContainerRow">
          <div className="col-lg-12 electionContainerColumn">
            <h1 className="electionResultsHeader"></h1>       
            {loading && 
             <div id="loader">
            <p className="text-center" color="black">Loading...</p>
          </div>}
            <div bordered className="candidatesTableContainer card p-3 pb-0">
              <Table className="candidateListTable">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Candidate Name</th>
                    <th>Candidates Vote Count</th>
                  </tr>
                </thead>
                <tbody>
                  { candidatesList && candidatesList.map((candidate, index) => {
                      return(
                        <tr key={index}>
                          <td>{candidate.candidateId}</td>
                          <td>{candidate.candidateName}</td>
                          <td>{candidate.candidateVoteCount}</td>
                        </tr>
                      )
                  })}
                </tbody>
              </Table>
            </div>
            { showForm &&
              <div className="formContainer">
                <form onSubmit={ castVote }>
                  <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" id="candidatesDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                      {selectedCandidate == null ?"Select Candidate": candidatesList[selectedCandidate-1].candidateName}
                    </button>
                    <ul className="dropdown-menu" aria-labelledby="candidatesDropdown">
                      { candidatesList && candidatesList.map((candidate, index) => {
                          return(
                            /* eslint-disable jsx-a11y/anchor-is-valid */
                            <li key={index}><a className="dropdown-item" href="#" onClick={(e) => selectCandidate(e)} id={index+1}>{candidate.candidateName}</a></li>
                          )
                      })}
                    </ul>
                  </div>
                  <div className="castVoteButtonContainer">
                    <button onClick={forceUpdate} type="submit" className="btn btn-primary">Vote</button>
                  </div>             
                </form>
               </div>
            }   
          </div>
      </div>
    </div>
    </div>
  );
}

export default App;
