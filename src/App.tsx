import React from 'react';
import './App.css';
import fire from './fire';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { isThisTypeNode } from 'typescript';

interface IState {
  currentUser: firebase.User,
  messages: Message[],
  notes: Note[]
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
      currentUser: firebase.auth().currentUser,
      messages: [],
      notes: []
    }; // <- set up react state



  }

  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('notes').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let note = { text: snapshot.val(), id: snapshot.key };
      this.setState({ notes: [note].concat(this.state.notes) });
    })
  }
  addMessage = () => {
    // e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('notes').push(this.inputEl.value);
    this.inputEl.value = ''; // <- clear the input
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

      </>
    );
  }
}
