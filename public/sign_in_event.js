const inform = document.querySelector('.plc')
const sign_in= (signIn) => {
    const input_login = document.querySelector('.login')
    const input_password = document.querySelector('.password')
    axios.post('http://localhost:3000/signIn',{
        "login": input_login.value,
        "password": input_password.value
    }).then(res=>{
        if(res.data !== "error"){
            localStorage.setItem("userdata", JSON.stringify([{"name":input_login.value, "password": input_password.value}]))
            const body = document.querySelector('body')
            body.innerHTML = '<div>Found</div>'
            window.location.href = 'Profile_HTML.html'
        }
        else {
            const body = document.querySelector(".inpErr")
            body.innerHTML = "<div>Check name/mail</div>"
        }
    })
}
inform.addEventListener('submit', sign_in)