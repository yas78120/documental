import { apiCall } from './config'
import axios from 'axios'
import { useRouter } from 'next/router'
import { ParsedUrlQuery } from 'querystring'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { fetchUser } from 'src/store/apps/user'

export const Login = async (data: ParsedUrlQuery) => {
  const options = {
    url: '/api/login-central',
    method: 'POST',
    data: data
  }
  console.log(options)
  return await apiCall(options)
    .then(result => {
      console.log(result)

      return result
    })
    .catch(e => {
      console.log(e)
      throw e
    })

  return
}

export async function Redirect(id: string, token: string) {
  if (id != undefined && token != undefined) {
    console.log('data: ' + id + ' ' + token)
    const router = useRouter()
    const app = id
    console.log(app)
    console.log('app', app)
    console.log('tokennnnnnn', token)

    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
      dispatch(fetchUser())
    }, [dispatch])

    if (app && token) {
      try {
        //const res = await axios.post('http://10.10.214.237:3501/api/login-central', { app, token })
        const res = await axios.post('http://localhost:3501/api/login-central', { app, token })
        localStorage.setItem('token', res.data)

        //router.replace('http://10.10.214.219:3060/home')
        //router.replace('http://10.10.214.167:3300/home')
        router.replace('http://localhost:3300/home')
        //delete router.query.id
        //delete router.query.token
        if (res.status === 401 || res.status == 404) {
          console.log('errorrrrrrrrrrrr')
          router.replace('http://localhost:3000/login')
          //router.replace('http://10.10.214.225:3000/login')
          //router.replace('http://10.10.214.219:3005/login')
        }
      } catch (error: any) {
        console.log(error)
        alert(error.response.data.message)
        router.push('http://localhost:3000/login')
        //router.push('http://10.10.214.225:3000/login')
        //router.push('http://10.10.214.219:3005/login')
      }
    } else {
      // console.log('no existe tokennnnnnnnnnn')
      router.replace('http://localhost:3000/login')
      //router.replace('http://10.10.214.225:3000/login')
      //router.replace('http://10.10.214.219:3005/login')
    }
  }
}
/* const router = useRouter()
  const {id, token} = data
  const app = id;
  // console.log(app)
  console.log('app',app)
  console.log('tokennnnnnn',token)

    if(app && token){
      try {
        const res = await axios.post('http://10.10.214.219:3300/api/central/login-central',{app,token})
        localStorage.setItem('token', res.data)
        if(res.status === 401){
          // console.log('errorrrrrrrrrrrr')
          router.push('http://10.10.214.223:3000/home')
        }
      } catch (error) {
        router.push('http://10.10.214.223:3000/home')
      }
    }else{
      console.log('no existe tokennnnnnnnnnn')
      // router.push('http://10.10.214.223:3000/home')
    } */
