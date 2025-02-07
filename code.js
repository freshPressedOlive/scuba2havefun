const urlBase = 'http://scuba2havefun.fun';
const extension = 'php';

/*
const cors=require('cors');
app.use(cors());
*/

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";	
	console.log("heyyyyyyy");
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	//i uncommented above statemented
	document.getElementById("loginResult").innerHTML = "";
//	console.log("hash: "+hash);
//	console.log("password: "+password);
	let tmp = {login:login,password:password};

	//uncommented above
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase +'/LAMPAPI'+ '/Login.' + extension;
//temporarily adding +'/LAMPAPI' to above statement
	console.log("jidewoska");
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		console.log("1233244323142");
		xhr.onreadystatechange = function() 
		{
			console.log(this.readyState + ", "+this.status);
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					console.log("no user found:(((((((");
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
				console.log("user found :D");		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "contact.html";
			}
			console.log("state or smth is not ready");
		};
		xhr.send(jsonPayload);
		console.log("try3reqwds");
	}
	catch(err)
	{
		console.log("hisdajn");
		document.getElementById("loginResult").innerHTML = err.message;
	}

}


/*selfmade function*/
function doRegister(){
	firstName=document.getElementById("firstName").value;
	lastName=document.getElementById("lastName").value;
	
	let username=document.getElementById("registerName").value;
	let password=document.getElementById("registerPassword").value;
	//register name and register password up above !!!!
	/*
	if (!validSignUpForm(firstName,lastName,username, password)){
		document.getElementById("registerResult").innerHTML = "invalid signup";
	}*/

	//document.getElementById("signupResult").innerHTML = "invalid signup";	
	var hash = md5(registerPassword)
	
	console.log("registerrrrr");
	console.log(firstName);
	document.getElementById("registerResult").innerHTML = "";

	let tmp = {
        	firstName: firstName,
        	lastName: lastName,
        	login: username,
        	password: hash //change to hash later
    	};

    	let jsonPayload = JSON.stringify(tmp);

    	let url = urlBase + '/LAMPAPI/Register.' + extension;
	console.log("woo");
	let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	    try {
        xhr.onreadystatechange = function () {

            if (this.readyState != 4) {
                return;
            }

            if (this.status == 409) {
                document.getElementById("registerResult").innerHTML = "User already exists";
                return;
            }

            if (this.status == 200) {

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                document.getElementById("registerResult").innerHTML = "User added";
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
	    console.log("edjisji2ej1wqksm");
        };

        xhr.send(jsonPayload);
	console.log("sentjson");
    } catch (err) {
        document.getElementById("registerResult").innerHTML = err.message;
    }

}


function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Hi, " + firstName + " " + lastName+"!";
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function createContact()
{
	console.log("CREATING CONTACT !!!!!");	
	let firstName=document.getElementById("addFirstName").value;
	let lastName=document.getElementById("addLastName").value;
	let email=document.getElementById("addEmail").value;
	let phone=document.getElementById("addPhone").value;
	
	//Check that the info they gave is valid !!!!

	console.log(firstName +lastName+email+phone+"----");
	//let newContact = document.getElementById("contactText").value;
	//document.getElementById("contactCreateResult").innerHTML = "";

	let tmp = {
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		email: email,
		userId: userId
		};
	console.log(tmp.firstName);	
	let jsonPayload = JSON.stringify( tmp );
	console.log("mmm");
	let url = urlBase + '/LAMPAPI/CreateContact.' + extension;
	console.log("aaaaa");
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		console.log("hhhh");
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//document.getElementById("contactCreateResult").innerHTML = "Contact has been added";
				console.log("CONTACT ADDED!!!!");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		//document.getElementById("contactCreateResult").innerHTML = err.message;
		console.log("contact not added :(");
	}
	
}

function searchContacts()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
	let contactList = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/LAMPAPI/SearchContacts.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					contactList += jsonObject.results[i].FirstName+", ";
                                        contactList += jsonObject.results[i].LastName+", ";
                                        contactList += jsonObject.results[i].Phone+", ";
                                        contactList += jsonObject.results[i].Email+", ";
					if( i < jsonObject.results.length - 1 )
					{
						contactList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = contactList;
			}
		};
		xhr.send(jsonPayload);
		console.log("eeeeeeee");
	}
	catch(err)
	{
		console.log("efdefwds");	
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function refreshContacts(){
	console.log("refreshing contacts....");
	const table=document.getElementById("contactTable");
	let tmp={
		userId: userId,
		search: ""
	}
	let contactList = "";
	let jsonPayload = JSON.stringify( tmp );

        let url = urlBase + '/LAMPAPI/SearchContacts.' + extension;
        
        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	
	try
        {
                xhr.onreadystatechange = function() 
                {
                        if (this.readyState == 4 && this.status == 200) 
                        {
                               // document.getElementById("contactSearchResult").innerHTML = "Contact(s) have been retri>
                                let jsonObject = JSON.parse(xhr.responseText);
                                
                                for( let i=0; i<jsonObject.results.length; i++ )
                                {
                                        contactList += jsonObject.results[i].FirstName;
					contactList += jsonObject.results[i].LastName;
					contactList += jsonObject.results[i].Phone;
					contactList += jsonObject.results[i].Email;
                                        if( i < jsonObject.results.length - 1 )
                                        {
                                                contactList += "<br />\r\n";
                                        }
                                }
                                
                                //document.getElementsByTagName("p")[0].innerHTML = contactList;
				console.log(contactList);
                        }
                };
                xhr.send(jsonPayload);
                console.log("ree23dee");
        }
        catch(err)
        {
                console.log("refdefwds");        
                //document.getElementById("contactSearchResult").innerHTML = err.message;
        }


	/*
	console.log("userID is: "+tmp.userId);
	let jsonPayload= JSON.stringify(tmp);
	console.log("payloooooooad");
	let url=urlBase+'/LAMPAPI/SearchContacts.'+extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type","application/json; charset=UTF-8");
	console.log("before try stuff");
	//try stuff
	try{
		console.log("sigh");
		xhr.onreadystatechange=function() {
			console.log("gggggg");
			if(this.readyState == 4 && this.status == 200){
				let jsonObject = JSON.parse(xhr.responseText);
				console.log("8888");
				if (jsonObject.error){
					console.log(jsonObject.error);
					console.log("json error");
					return;
				}
				console.log("no error :D");

			
			}
			console.log("not ready");


	};
	//end of xhr statment stuff

	} catch(err){
		console.log(err.message);
		console.log("yikes");
	}*/
	console.log("after try and catch");
}

/*Clear search list*/
function refresh()
{

}

/*Edit*/
function edit()
{

}

/*Delete icon is clicked, awaiting confirmation*/
function areYouSure()
{

}

/*Once yes is clicked*/
function deleteContact()
{
	//run deletecontact function
	//switch samepopup to only say "Contact Deleted!"
}

/*Either no or the x is clicked; popup display is set to none and the normal contacts page is restored*/
function dontDelete()
{
	//[deletepopup].style.display='none';
	
}

function validSignUpForm(firstName, lastName,usr, password){
	var fErr=lErr=uErr=pErr=true;
	return true;
}

function validLoginForm(user,pass){
	//ask them to enter smth for both fields
	return true;
}

function validAddContact(){
	//upon clicking add contact button in the add contact page 
	//run addcontact
	//change popup to say contact added successfully
	return true;
}

function checkPastUsers(){
	//function to doublecheck user hasnt previously registered
	return false;
}
/*new stuff*/

function switchToLogin(){
	console.log("click");
	document.getElementById('loginSelect').style.backgroundColor = '#7038d0';
	document.getElementById('registerSelect').style.backgroundColor = '#101010';
	registerDiv.style.display='none';
	loginDiv.style.display='block';
}

function switchToRegister(){
	console.log ("clack");
	document.getElementById('loginSelect').style.backgroundColor = '#101010';
	document.getElementById('registerSelect').style.backgroundColor = '#7038d0';
	loginDiv.style.display='none';
	registerDiv.style.display='block';

}

/*toggle between addContact screen and contact list*/
function switchToAddContact(){
	console.log("jnreifodkmnjfekwmdlc");
	const el=document.getElementById("addPopUp");
	const el2=document.getElementById("contactList");
	console.log("asaassa");        
	if (window.getComputedStyle(el).display==="none"){
		console.log("clickity");
		contactList.style.display='none';
        	addPopUp.style.display='block';
	
	}else if(el2.style.display==="none"){
		console.log ("clackity");
		addPopUp.style.display='none';
        	contactList.style.display='block';
	}
}
