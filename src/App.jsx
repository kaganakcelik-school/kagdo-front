import './index.css'
import axios from 'axios'
import { useState, useEffect } from 'react'


const Note = props => {
	return (
			<li> 
				{props.note.content} 
				<button onClick={props.deleteButton}>done</button> 
			</li> 
	)
}


const App = () => {
	const [users, setUsers] = useState([])
	const [user, setUser] = useState({})
	
	const [notes, setNotes] = useState([])
	const [newNote, setNewNote] = useState('')

	//sign in stuff
	const [signedIn, setSignedIn] = useState(false)
	
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	//sign up stuff
	const [newUsername, setNewUsername] = useState('')
	const [newPassword, setNewPassword] = useState('')
	
	useEffect(() => {
		
		// console.log('begining to initialize the notes from the backend')

		// axios
		// 	.get('https://b75c659f-c502-4d23-899c-35373fca4890-00-3o38368hhttwi.picard.replit.dev/api/users/kagan')
		// 	.then(response => {
		// 		setNotes(response.data.notes)
		// 	})
		//this the new code which should be final soon

		axios
			.get('https://ffdo-server.onrender.com/api/users')
			.then(response => {
				setUsers(response.data)
			})
	}, [])

	const addNote = event => {
		event.preventDefault()
		console.log('user:', user)
		const noteObject = {
			content: newNote
		}

		axios
			.post(`https://ffdo-server.onrender.com/api/users/${user.username}`, noteObject)
			.then(response => {
				setNotes(notes.concat(noteObject))
				setNewNote('')
			})
	}

	const handleNoteChange = event => {
		setNewNote(event.target.value)
	}

	const deleteButton = id => {
		axios
			.delete(`https://ffdo-server.onrender.com/api/users/${user.username}/${id}`)
			.then(response => {
				setNotes(notes.filter(note => note.id !== id))
			})
	}

	const signIn = event => {
		event.preventDefault()

		if (users.find(user => user.username === username && user.password === password)) {
			setUser(users.find(user => user.username === username && user.password === password))
			axios
				.get(`https://ffdo-server.onrender.com/api/users/${users.find(user => user.username === username && user.password === password).username}`)
				.then(response => {
					setNotes(response.data[0].notes)
					console.log('these are the notes', response.data[0].notes)
				})
			setSignedIn(true)
		} else {
			alert('incorrect username or password')
			return
		}

		
		
	}

	const signUp = event => {
		event.preventDefault()

		if (users.find(user => user.username === newUsername)) {
			alert('someone already has this username so choose a new one lil cuh')
			setNewUsername('')
			return
		}
		
		const newUserObject = {
			username: newUsername,
			password: newPassword
		}

		axios
			.post('https://ffdo-server.onrender.com/api/users', newUserObject)
			.then(response => {
				setUsers(users.concat(newUserObject))
				alert('account created')
				setNewUsername('')
				setNewPassword('')
			})
	}
	
  return (
    <div>
			<h1>kagan todo</h1>
			
			{!signedIn 
				? 
				<div>
					<p>u needa sign in</p>
					<form onSubmit={signIn}>
						username <input 
											 value={username}
											 onChange={event => {
												 setUsername(event.target.value)
											 }} 
											 />
						<br/>
						password <input 
											 value={password}
											 onChange={event => {
												 setPassword(event.target.value)
											 }}
											 />
						<button type='sumbit'>sign in</button>
					</form>


					{/* sign up */}
					<p>if u dont have account u needa sign up</p>
					<form onSubmit={signUp}>
						create username <input
															value={newUsername}
															onChange={event => {
																setNewUsername(event.target.value)
															}}
															/>
						<br/>
						create password <input
															value={newPassword}
															onChange={event => {
																setNewPassword(event.target.value)
															}}
															/>
						<button type='submit'>sign up</button>
					</form>
				</div>
				: 
				<div>
					<form onSubmit={addNote}>
						<input
							value={newNote}
							onChange={handleNoteChange}
						/>
						<button type='submit'>add note</button>
					</form>

					<ul>
						{notes.map(note => <Note key={note.id} note={note} deleteButton={() => deleteButton(note.id)} />)}
					</ul>
				</div>
			}
			
			
			
			
			
		</div>
  )
}

export default App
