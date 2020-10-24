import React from 'react';
import './App.css';
import fire from './fire';

interface IState {
  messages: Message[],
  notes: string[]
}

interface Message {
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
      messages: [],
      notes: [""]
     }; // <- set up react state
  }

  componentWillMount() {
    /* Create reference to messages in Firebase Database */
    let messagesRef = fire.database().ref('messages').orderByKey().limitToLast(100);
    messagesRef.on('child_added', snapshot => {
      /* Update React state when message is added at Firebase Database */
      let message = { text: snapshot.val(), id: snapshot.key };
      this.setState({ messages: [message].concat(this.state.messages) });
    })
  }
  private addMessage = () => {
    // e.preventDefault(); // <- prevent form submit from reloading the page
    /* Send the message to Firebase */
    fire.database().ref('messages').push(this.inputEl.value);
    this.inputEl.value = ''; // <- clear the input
  }

  render() {
    return (
      <>
        <input type="text" ref={el => this.inputEl = el} />
        <button onClick={() => this.addMessage()}>Add to DB</button>
        <ul>
          { /* Render the list of messages */
            this.state.messages.map(message => <li key={message.id}>{message.text}</li>)
          }
        </ul>
      </>
    );
  }
}
