import { useState } from 'react'
import { Button, Container, Paper, TextField } from '@material-ui/core'
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import apiRequest from './helpers/apiRequest'
import './App.css';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  age: '',
  userID: ''
}

function App() {
  const [infoText, setInfoText] = useState(null)
  const [isSuccess, setIsSucces] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)

  const handleFormChange = (event) => {
    setForm({...form, [event.target.name]: event.target.value})
  }

  const isValidForm = () => {
    return form.fullName.length && form.email.length
  }

  const handleSearch = () => {
    setIsSucces(false)
    if(!form.userID.length) {
      setInfoText('Please enter user id')
      return
    }

    apiRequest({
      path: 'user/' + form.userID
    }).then((response) => {
      if(!response) {
        setInfoText('Network error')
        return
      }

      if(response.status === 'success') {
        setForm(response)
        setInfoText(null)
      }
      else {
        setForm(EMPTY_FORM)
        setInfoText(response.status === 'non-existent-user' ? "Requested user doesn't exists" : 'Unknown error')
      }
    })
  }

  const saveNewUser = () => {
    apiRequest({
      path: 'user',
      method :'PUT',
      params: {...form, age: Number(form.age)}
    }).then((response) => {
      if(!response) {
        setInfoText('Network error')
        return
      }
      
      if(response.id && response.id.length) {
        setIsSucces(true)
        setInfoText(`User saved succesfully`)
        setForm({
          ...form,
           userID: response.id.split('/')[1]
        })
      }
    })
  }

  const updateUser = () => {
    apiRequest({
      path: 'user',
      method: 'POST',
      params: {...form, age: Number(form.age)}
    }).then((response) => {
      if(!response) {
        setInfoText('Network error')
        return
      }

      if (response.status === 'success') {
        setIsSucces(true)
        setInfoText('User updated succesfully')
      }
      else {
        setInfoText('Cannot update user')
      }
    })
  }

  const handleSave = () => {
    setIsSucces(false)
    if(!isValidForm()) {
      setInfoText('Full name and email are mandatory fields. Please fill them.')
      return
    }
    //IF ALREADY EXISTS userID IS UPDATING DATA, OTHERWISE IS SAVING A NEW ONE
    form.userID.length ? updateUser() : saveNewUser()
  }

  return (
    <ThemeProvider theme={theme}>
      <div className='container'>
          <Container maxWidth='sm'>
              <Paper elevation={5}>
                <form noValidate>
                  <div className='search-container'>
                    <TextField label='User ID' type='text' name='userID' value={form.userID} onChange={handleFormChange}/>
                    <Button onClick={handleSearch} variant='contained' color='secondary'>Search</Button>
                  </div>
                  <h6>User information:</h6>
                  <TextField fullWidth onChange={handleFormChange} name='fullName' value={form.fullName} label='Full Name' type='text'/>
                  <TextField fullWidth onChange={handleFormChange} name='email' value={form.email} label='Email' type='mail'/>
                  <TextField fullWidth onChange={handleFormChange} name='age' value={form.age} label='Age' type='number' />
                  <div className='save-button-container'>
                    <div>
                      {infoText && <p className={`info-text ${isSuccess ? 'info-text-success': 'info-text-error'}`}>{infoText}</p>}
                    </div>
                    <Button onClick={handleSave} variant='contained' color='secondary'>Save</Button>
                  </div>
                </form>
              </Paper>
          </Container>
      </div>
    </ThemeProvider>
  );
}

const theme = createMuiTheme({
  overrides: {
    MuiButtonBase: {
      root: {
        height: '36px',
        width: '88px'
      }
    },
    MuiInput: {
      root: {
        color: '#FFF',
        width: '100%'
      },
      underline: {
        borderBottom: '1px solid #FFF',
      }
    },
    MuiFormLabel: {
      root: {
        color: '#FFF',
        '&$focused': {
          color: '#FFF',
        },
      },
    },
    MuiFormControl: {
      fullWidth: {
        marginBottom: '0.7rem'
      }
    }
  }
});

export default App;
