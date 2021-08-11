import React from "react";
import { ListGroup,Container,Row,Col } from "react-bootstrap";

export function ListeChannels(props) {
    const listeChannels = props.channels.map((channel) => (
        <ListGroup.Item variant="dark" style={{
            textDecoration: "none",
            cursor: "pointer"
          }} onClick={() => props.setCurrentChannel(channel)}>
            {channel}
        </ListGroup.Item>
      ));
    return(
        <Container>
            <Row>
                <Col><h1>Votre liste de channels</h1></Col>
            </Row>
            <Row>
                <Col><h2>Connected</h2></Col>
                <Col><h2>Available</h2></Col>
            </Row>
            <Row>
                <Col><ListGroup >{listeChannels}</ListGroup></Col>
                <Col><ListGroup >{listeChannels}</ListGroup></Col>
            </Row>
            
            
        </Container>
    )
}
