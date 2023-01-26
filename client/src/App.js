
import './App.css';
import {useState, useEffect} from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Cookies from 'js-cookie'

import Grid from '@mui/material/Grid'
import Stack from '@mui/material/Stack'


function App() {

  const [gists, setGists] = useState()
  const [user, setUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState()
  const clienId = ""

  useEffect(()=> {
    if(token){
      setIsLoading(true)
      fetch("/fetchUser", {
        headers: { Authorization: "token " + token }
      }).then(r => r.json()).then(r => {
        if(r.user.login){
          setUser(r.user)
          setGists(r.gists)
        }else{
          setUser(null)
          setIsLoading(false)
        }
      })
    }
  }, [token]);

  useEffect(()=>{
    if(!token){
      let newToken = new URLSearchParams(window.location.search).get("access_token");
      if(newToken){
        Cookies.set("token", newToken)
      }else{
        newToken = Cookies.get("token")
      }
      setToken(newToken)
    }
  }, [token])

  return (
    <div className="App">
      <header className="App-header" style={{paddingTog: "20px"}}>
        {user ? 
        <div>
          <img src={user.avatar_url}  className="App-logo" alt="profile pic"/>
          <div>
          @{user.login}
          </div>
          <Grid container sx={{width: "90%", margin: "auto", marginTop: "40px"}}>

          {gists.map(gist => {
            return(
              <Grid key={gist.full_name} md={4} sx={{my: 1}}>
                <Stack   
                  direction="row"
                  justifyContent="flex-start"
                  alignItems="center"
                  spacing={2}>
                  <img src={gist.owner.avatar_url} class="Repo" alt={"Repo: " + gist.full_name}/>
                  <div>
                    {gist.full_name}
                  </div>
                </Stack>
            
                <p style={{fontSize: "15px", width: "90%"}}>
                {gist.description}
                </p>
            </Grid>)
          })}
          </Grid>

        </div> : 
        isLoading ?
          <Stack   
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            spacing={2}> 
            <p>
            Loading information 
            </p>
             <CircularProgress />
          </Stack> :
          <div>

            <p>User not authenticated</p>
          <a href={"https://github.com/login/oauth/authorize?client_id=" + clienId}>Click to authenticate</a>
          </div>
           }
        
      </header>
    </div>
  );
}

export default App;
