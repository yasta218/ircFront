import React from "react";
import { Component } from "react";
import { Navbar, Form, FormControl, Button } from "react-bootstrap";
import { PersonFill } from "react-bootstrap-icons";


class Terminal extends Component {
    render() {
        return(
<>
<Navbar className="bg-dark justify-content-around">
  <span style={{ color: "white"}}>
<PersonFill></PersonFill>
{" "}
{this.props.pseudo}
</span>
<Button variant="dark" onClick={() => this.props.leaveChan()}>Home</Button>
</Navbar>
<Navbar inline fixed="bottom" className="bg-dark justify-content-center">
  <Form inline className="w-75 justify-content-center" >
    <FormControl onChange={(e) => this.props.onChangeCommand(e.target.value)} type="text" placeholder="" className="w-75 d-inline-block" />
    <Button variant="dark" onClick={() => this.props.command()} id="buttonEnter" className="m-3">Run</Button>
  </Form>
  
</Navbar>
  </>
        )
}
}
export default Terminal