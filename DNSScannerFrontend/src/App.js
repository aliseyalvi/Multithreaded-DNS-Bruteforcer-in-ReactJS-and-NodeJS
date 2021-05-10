import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBIcon,MDBListGroup, MDBListGroupItem } from 'mdbreact';
import axios from 'axios';
import './App.css';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state={
      apiResponse:[],
      host:"",
      portrange:"",
      counter:0
  };
    this.handleChange=this.handleChange.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.getData=this.getData.bind(this);
  }



  handleChange = event => {
    const value = event.target.value;
    this.setState({ [event.target.name]: value});
  }

  handleSubmit = event => {
    event.preventDefault();

    const data = {
      host: this.state.host
    };
    //Handle Post requests and feeds data to scannerapi to execute multithreaded scanner written in C
    axios.post('http://localhost:9000/portscannerapi', { data })
      .then(res => {
        console.log(res);
      });
      
     //Call the getData() function to get Data from scannerapi every 10 seconds
      this.interval=setInterval(()=>{
        if(this.state.counter>25){
          clearInterval(this.interval);
          console.log("Interval Cleared");
        }
        this.getData();
        this.setState({ counter: this.state.counter + 1 });
        console.log("Get Request Sent and Counter:"+this.state.counter);
        
      },10000);
  }

   //Handle Get Requests to retrieve data written in a by Multithreaded Scanner every 10 seconds
  getData=()=>{
    axios.get('http://localhost:9000/portscannerapi')
      .then(res => {
        this.setState({apiResponse:res.data});
        console.log(this.state.apiResponse);
      })
  }
  
  


render(){
  const Output = this.state.apiResponse.map((line,i) =>
  <MDBListGroupItem key={i}>{line}</MDBListGroupItem>
  );
  return (
    <div className="App">
      {/*A Simple MDBootstrap Form */}
      <MDBContainer>
      <MDBRow>
      <MDBCol md="3">
        </MDBCol>
        <MDBCol md="6">
          <MDBCard>
            <MDBCardBody>
              <form onSubmit={this.handleSubmit}>
                <p className="h4 text-center py-4">Sub-Domain Name Scanner</p>
                <label
                  htmlFor="hostName"
                  className="grey-text font-weight-light"
                >
                  Host name
                </label>
                <input
                  type="text"
                  id="hostName"
                  className="form-control"
                  name="host" 
                  onChange={this.handleChange}
                />
                <br />
                <div className="text-center py-4 mt-3">
                  <MDBBtn className="btn btn-outline-purple" type="submit">
                    Scan
                    <MDBIcon far icon="paper-plane" className="ml-2" />
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="3">
        </MDBCol>
      </MDBRow>
      <MDBRow>
        <MDBCol md="3">

        </MDBCol>
        <MDBCol md="6">
                 <p>
                   <br/>
                   
                   <MDBListGroup>
                   {Output}
                   </MDBListGroup>
                 </p>
        </MDBCol>
        <MDBCol md="3">

        </MDBCol>
      </MDBRow>
    </MDBContainer>

    </div>
  );
}
}
export default App;
