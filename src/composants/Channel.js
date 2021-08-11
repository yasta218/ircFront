import React from "react";
import { Component } from "react";
import { ListGroup } from "react-bootstrap";
import "./composants.css"


class ChannelShow extends Component {
    constructor() {
        super();
        this.state = { messages: [{pseudo: "pseudo1", message: "message1"}, {pseudo: "pseudo2", message:"message2" }] };
        this._messageType = this._messageType.bind(this);
      }
      _messageType = (pseudo) =>{
        if(pseudo == this.props.pseudo ){
          return "messageSelf"
        }else{
          return "messageOther"
        }
      }
    render() {
        const listMessages = this.props.messageChannel.map((message) => (
            <ListGroup.Item variant="dark" className={this._messageType(message.pseudo)} action={true}>
                <span style={{fontWeight:"bold"}} >{message.pseudo}</span>   : {message.message}
            </ListGroup.Item>
          ));
        return(
            <>
            <ListGroup
              style={{
                width:"100%",
                marginBottom:"15%",
                marginLeft:"15%"
              }}>
                        {listMessages}
            </ListGroup>
              </>
        )
}
}
export default ChannelShow