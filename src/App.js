import React, { Component } from "react";
import Terminal from "./composants/terminal"
import  'bootstrap/dist/css/bootstrap.min.css' ;
import './App.css';
import { ModalAuth } from "./composants/modalAuth";
import { ListeChannels } from "./composants/listeChannels";
import { Alert2 } from "./composants/alert";
import ChannelShow from  "./composants/Channel";
import { io } from "socket.io-client";
import { ListGroup } from "react-bootstrap";


document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    try {
      document.getElementById("buttonGo").click();
    } catch (error) {
      try {
        document.getElementById("buttonEnter").click();
      } catch (error) {
        //no need to show the error
      }
    }
  }
  if (event.key === "Tab") {
    event.preventDefault();
    try {
      document.getElementById("refresh").click();
    } catch (error) {
        //no need to show the error
    }
  }
});

class App extends Component {
  constructor() {
    super();
    this.state = { 
      modalShow: true, 
      showAlertPseudo: false, 
      channels: [], 
      currentChannel: undefined, 
      commandAct:"", 
      showAlert: false,
      textAlert: "",
      variantAlert: "success", 
      pseudo: undefined, 
      socket: io('http://localhost:82/'), 
    };
    this.onChangePseudo = this.onChangePseudo.bind(this);
    this.setCurrentChannel = this.setCurrentChannel.bind(this);
    this.leaveChan = this.leaveChan.bind(this);
    this.onChangeCommand = this.onChangeCommand.bind(this);
    this.command = this.command.bind(this);
    this.validatePseudo = this.validatePseudo.bind(this);
    this.requestChannels = this.requestChannels.bind(this);
    this.setChannels = this.setChannels.bind(this);
    this.setShowAlert = this.setShowAlert.bind(this);
    this.setShowAlertPseudo = this.setShowAlertPseudo.bind(this);
    this.newChannel = this.newChannel.bind(this);
  }

  disconnect = () => {
    this.state.socket.emit("logged_out", { pseudo: this.state.pseudo});
  }

  setupBeforeUnloadListener = () => {
    window.addEventListener("beforeunload", (ev) => {
        ev.preventDefault();
        return this.disconnect();
    });
  };


  validatePseudo =  () => {
    this.state.socket.emit("login_register", {
      pseudo: this.state.pseudo
      });
    this.state.socket.on("logged_in", data => this.requestChannels(data));
  }

  requestChannels = (data) => {
    if (data.validate === true) {
      this.setState({ modalShow: false});
      this.state.socket.emit("listChannels");
      this.state.socket.on("listChannels", list => this.setChannels(list))
      this.setupBeforeUnloadListener();
    } else {
      this.setShowAlertPseudo(true);
    }
  }

  setChannels = (data) => {
    this.setState({ channels: data.liste });
  }

  onChangePseudo = (e) => {
    if (e !== this.state.pseudo) {
    this.setState({ pseudo: e});
    }
  }
  setShowAlert = (bool) => {
    this.setState({ showAlert: bool })
  }

  setShowAlertPseudo = (bool) => {
    this.setState({ showAlertPseudo: bool })
  }
  onChangeCommand = (e) => {
    if (e !== this.state.commandAct) {
    this.setState({ commandAct: e});
    }
  }
  afficherAlertePseudo(elem) {
    console.log(elem.pseudo);
    if (elem.pseudo !== this.state.pseudo) {
      this.setState({ variantAlert: "success"});
      let txt = "Nouvel utilisateur :" + elem.pseudo;
      this.setState({ textAlert: txt });
      this.setState({ showAlert: true });
    } else {
      this.setState({ variantAlert: "danger"});
      let txt = "pas de nouvel utilisateur" + elem.pseudo;
      this.setState({ textAlert: txt });
      this.setState({ showAlert: true });
    }
  }
  setCurrentChannel(elem) {
    this.setState({ currentChannel: elem});
    this.setState({ messageChannel: [{pseudo: "Gandalf", message: "Pas encore de messages dans ce channel !"}]});
    this.state.socket.emit("join", {channel: elem});
    this.state.socket.emit("listMessages", {channel: elem});
    this.state.socket.on("listMessages", (data) => {
      console.log("In setCurrentChannel")
      console.log(data)
      this.setMessages(data)
    });
    setInterval(this.refreshChannel, 100);
  }
  refreshChannel = () => {
    try {
      this.state.socket.emit("listMessages", {channel: this.state.currentChannel});
      this.state.socket.on("listMessages", data => this.setMessages(data));
      this.state.socket.on("join", data => this.afficherAlertePseudo(data));

    } catch(err) {
      //no need to do anything
    }
  }
  setMessages = (elem) => {
    console.log("setMessage:",elem)
    this.setState({ messageChannel: elem.list});
  }
  leaveChan = () => {
    this.state.socket.emit("leave", { channel: this.state.currentChannel });
    this.setState({ currentChannel: undefined })
  }

  newChannel = (data) => {
    if (data.validate === true) {
      this.state.socket.on("listChannels", this.requestChannels(data));
      this.setState({ variantAlert: "success"});
      this.setState({ textAlert: "Nouveau channel créé ! bien joué bg"});
      this.setState({ showAlert: true });
    } else {
      this.setState({ variantAlert: "danger"});
      this.setState({ textAlert: "Impossible de créer ce channel !  réessaye bg"});
      this.setState({ showAlert: true });
    }
  }

  delChannel = (data) => {
    if (data.validate === true) {
      this.requestChannels(data);
      this.state.socket.on("listChannels", list => this.setChannels(list));
      this.setState({ variantAlert: "success"});
      this.setState({ textAlert: "Le channel a bien été supprimé : bien joué bg "});
      this.setState({ showAlert: true });
    } else {
      this.setState({ variantAlert: "danger"});
      this.setState({ textAlert: "Impossible de supprimer ce channel !  réessaye bg"});
      this.setState({ showAlert: true });
    }
  }
  command = () => {
    if (this.state.commandAct.split(" ")[0] === "create") {
      this.state.socket.emit("create", {
        channel: this.state.commandAct.split(" ")[1]
        });
      this.state.socket.on("create", data => this.newChannel(data));
      this.setState({ command: ""});
    }
    else if (this.state.commandAct.split(" ")[0] === "delete") {
      this.state.socket.emit("delete", {
        channel: this.state.commandAct.split(" ")[1]
        });
      this.state.socket.on("delete", data => this.delChannel(data));
      this.setState({ command: ""});
    }
    else if (this.state.currentChannel === undefined) {
      if (this.state.channels.includes(this.state.commandAct) > 0) {
      this.setCurrentChannel(this.state.commandAct);
      this.setState({ command: ""});
      } else {
        this.setState({ variantAlert: "danger"});
        this.setState({ textAlert: "Ce channel n'existe pas ! dsl bg"});
        this.setShowAlert(true);
        this.setState({ command: ""});
      }
    } else {
      if (this.state.commandAct === "users") {
        this.state.socket.emit("listUsers", {channel: this.state.currentChannel});
      }
      this.state.socket.emit("messageChan", { message: this.state.commandAct, channel: this.state.currentChannel });
      this.state.socket.emit("listMessages", {channel: this.state.currentChannel });
      this.state.socket.on("listMessages", data => this.setMessages(data));
      this.setState({ command: ""});
    }
  }
  render() {
    return (
      <>
      <Terminal
        currentChannel = {this.state.currentChannel} 
        pseudo={this.state.pseudo} 
        leaveChan={this.leaveChan} 
        onChangeCommand={this.onChangeCommand} 
        command={this.command}
      />
      <Alert2
        showAlert={this.state.showAlert} 
        setShowAlert={this.setShowAlert}
        variant={this.state.variantAlert}
        text={this.state.textAlert} 
      />
      {(this.state.currentChannel === undefined) ? 
        <ListeChannels 
        style={{height: "600px"}}
        channels={this.state.channels}
        setCurrentChannel={this.setCurrentChannel}
        /> : 
        <ChannelShow 
          channel={this.state.currentChannel} 
          messageChannel={this.state.messageChannel}
          pseudo={this.state.pseudo} 
        />
      }
      <ModalAuth
        show={this.state.modalShow}
        validatePseudo={this.validatePseudo}
        onChangePseudo={this.onChangePseudo}
        pseudo={this.state.pseudo}
        showAlertPseudo={this.state.showAlertPseudo}
        setShowAlertPseudo={this.setShowAlertPseudo}
      />
      </>
    );
  }
}

export default App;