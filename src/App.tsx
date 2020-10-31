import React from 'react';
import './App.css';
import fire from './fire';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { isThisTypeNode } from 'typescript';

interface IState {
  currentUser: firebase.User,
  messages: Message[]
  // notes: Note[]
}

interface Message {
  text: any;
  id: string | null;
}

interface Note {
  text: any;
  id: string | null;
}
interface IProps {

}
export default class App extends React.Component<IProps, IState> {
  public inputEl: HTMLInputElement;
  constructor(p: IProps) {
    super(p);

    this.inputEl = null;
    this.state = {
      currentUser: null,
      messages: []
    };

  }



  componentWillMount() {

    const waitForCurrentUser = setInterval(() => {
      if (firebase.auth().currentUser !== null) {
        clearInterval(waitForCurrentUser);
        this.setState({
          currentUser: firebase.auth().currentUser
        });

        this.addUser();

      } else {
        console.log('Wait for it');
      }
    }, 100);


    let messagesRef = fire.database().ref('messages');
    if (messagesRef) {
      messagesRef.on('child_added', snapshot => {
        /* Update React state when message is added at Firebase Database */
        let note = { text: snapshot.val(), id: snapshot.key };
        this.setState({ messages: [note].concat(this.state.messages) });
      })
    }

  }


  

  addMessage = () => {
    fire.database().ref('messages').push("test").catch(reason => {
      console.log(reason);
      // database rule:
      //".write": "auth.token.email === 'molodtsovdenis@gmail.com'"
    })
  }


  addUser = () => {
    fire.database().ref(`users/${this.state.currentUser.uid}`).set({      
        name: this.state.currentUser.displayName,
        email: this.state.currentUser.email,
        roles:{'admin':true}      
    });
  }

  
  signOut = async () => {
    await firebase.auth().signOut();

    this.setState({
      currentUser: null
    });
  }

  SignOutButton = () => {
    return (<>
      <button onClick={this.signOut}>
        Sign out
      </button>
    </>)
  }


  Authentication = () => {
    const uiConfig = {
      // Popup signin flow rather than redirect flow.
      signInFlow: 'popup',
      // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
      signInSuccessUrl: '/',
      // We will display Google and Facebook as auth providers.
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
      ]
    };
    return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}
    />
  }

  render() {
    return (
      <>
        {!firebase.auth().currentUser &&
          <this.Authentication />
        }

        {firebase.auth().currentUser &&
          <>
            <this.SignOutButton />
            <h2>{firebase.auth().currentUser.email}</h2>
            <h2>{firebase.auth().currentUser.displayName}</h2>
            <img src={firebase.auth().currentUser.photoURL}></img>
          </>
        }

        <div>
          <button onClick={() => this.addMessage()}>Add message!</button>
        </div>

        {this.state.messages && <ul>
          {this.state.messages.map(message => <li key={message.id}>{message.text}</li>)}
        </ul>
        }
        

      </>
    );
  }

}
