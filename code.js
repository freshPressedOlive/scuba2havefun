const urlBase = 'http://scuba2havefun.fun';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
const rowNo=[]

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";	
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	var hash = md5( password );
	//i uncommented above statemented
	document.getElementById("loginResult").innerHTML = "";
	console.log("hash: "+hash);
//	console.log("password: "+password);
//	let tmp = {login:login,password:password};
	let tmp={login:login,password:hash};
	//uncommented above
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase +'/LAMPAPI'+ '/Login.' + extension;
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
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
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
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
	//var hash = md5(registerPassword)
	var hash = md5(password);	
	console.log("hash "+hash);
	document.getElementById("registerResult").innerHTML = "";

	let tmp = {
        	firstName: firstName,
        	lastName: lastName,
        	login: username,
        	password:hash //change to hash later
    	};

    	let jsonPayload = JSON.stringify(tmp);

    	let url = urlBase + '/LAMPAPI/Register.' + extension;
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

	let tmp = {
		firstName: firstName,
		lastName: lastName,
		phone: phone,
		email: email,
		userId: userId
		};
	console.log(tmp.firstName);	
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/LAMPAPI/CreateContact.' + extension;
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
				document.getElementById("contactSearchResult").value = "Contact added.";
				console.log("CONTACT ADDED!!!!");
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		console.log("contact not added :(");
		document.getElementById("contactSearchResult").value = "Contact not added";
	}

	document.getElementById("addFirstName").value = "";
	document.getElementById("addLastName").value = "";
	document.getElementById("addEmail").value = "";
	document.getElementById("addPhone").value = "";


	addPopUp.style.display='none';
	contactList.style.display='block';

}

function searchContacts()
{
	addPopUp.style.display = 'none';
	contactList.style.display = 'block';

	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";
	
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
				document.getElementById("contactSearchResult").innerHTML = "Results for '"+srch+"': ";
				let jsonObject = JSON.parse( xhr.responseText );
				const table=document.getElementById("contactTable");
				
				const tbody = document.getElementById('tableList'); // Or use a specific ID/class selector
    				tbody.innerHTML = '';

				for( let i=0; i<jsonObject.results.length; i++ )
				{
					rowNo[i] = jsonObject.results[i].ID
					const newRow = tbody.insertRow();
					//newRow
					const htmlString = newRow.outerHTML;
					console.log("outerHTML: "+htmlString);
					newRow.id='row'+i;
                                        const cell0= newRow.insertCell(0);
                                        const cell1= newRow.insertCell(1);
                                        const cell2= newRow.insertCell(2);
                                        const cell3= newRow.insertCell(3);
                                        const cell4= newRow.insertCell(4);
                                        const cell5= newRow.insertCell(5);

					/*
                                        cell0.innerHTML=jsonObject.results[i].FirstName;
                                        cell1.innerHTML=jsonObject.results[i].LastName;
                                        cell2.innerHTML=jsonObject.results[i].Phone;
                                        cell3.innerHTML=jsonObject.results[i].Email;*/

					cell0.innerHTML="<p id='firstName" + i + "'>" + jsonObject.results[i].FirstName + "</p>";
					cell1.innerHTML="<p id='lastName"+i+"'>"+jsonObject.results[i].LastName+"</p>";
					cell2.innerHTML="<p id='phone"+i+"'>"+jsonObject.results[i].Phone+"</p>";
					cell3.innerHTML="<p id='email"+i+"'>"+jsonObject.results[i].Email+"</p>";

                                        var theEditButton=document.getElementById("editButton");
                                        var theDeleteButton=document.getElementById("areYouSure");
                                        cell4.innerHTML='<button type="button" id="editButton'+i+'" class="editButton" onclick="edit('+i+');"><span>&#8203;</span></button>'+'<button type="button" id="saveButton'+i+'" class="saveButton" onclick="saveEdit('+i+');"><span>&#8203;</span></button>';
					cell5.innerHTML='<button type="button" id="areYouSure'+i+'" class="deleteButton" onclick="areYouSure('+i+');"><span>&#8203;</span></button>' + '<button type="button" id="confirmDeleteButton'+i+'" class="confirmDeleteButton" onclick="deleteContact('+i+');">Confirm<span>&#8203;</span></button>'+'<button type="button" id="cancelDeleteButton'+i+'" class="cancelDeleteButton" onclick="dontDelete('+i+');">Cancel<span>&#8203;</span></button>';
					
					var elements = document.getElementsByClassName('saveButton');

					for (var j=0; j<elements.length;j++){
						elements[j].style.display='none';
					}
					
					var elements2 = document.getElementsByClassName('confirmDeleteButton');

					for (var j=0; j<elements2.length;j++){
						elements2[j].style.display='none';
					}

					var elements3 = document.getElementsByClassName('cancelDeleteButton');

                                        for (var j=0; j<elements3.length;j++){
                                                elements3[j].style.display='none';
                                        }

					
					if( i < jsonObject.results.length - 1 )
					{
						//contactList += "<br />\r\n";
					}
				}
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
	
}

function refreshContacts() {
	document.getElementById("searchText").value = ""; // I added this to clear the search bar
	
	document.getElementById("addFirstName").value = "";
	document.getElementById("addLastName").value = "";
	document.getElementById("addEmail").value = "";
	document.getElementById("addPhone").value = "";

	searchContacts();
}

function edit(no)
{
	console.log("editing contact... for id "+no);

	document.getElementById("editButton" + no).style.display = 'none';
        document.getElementById("saveButton" + no).style.display = 'block';
	
	var editFN = document.getElementById("firstName" + no);
	var editLN = document.getElementById("lastName" + no);
	var editPhone = document.getElementById("phone" + no);
	var editEmail = document.getElementById("email" + no);
	
	var newFN=editFN.innerText;
	var newLN=editLN.innerText;
	var newPhone=editPhone.innerText;
	var newEmail=editEmail.innerText;


	editFN.innerHTML="<input type='text' id='newFNText" + no + "' value='" + newFN + "'>";
	editLN.innerHTML="<input type='text' id='newLNText" + no + "' value='" + newLN + "'>";
	editPhone.innerHTML="<input type='text' id='newPhoneText" + no + "' value='" + newPhone + "'>";
	editEmail.innerHTML="<input type='text' id='newEmailText" + no + "' value='" + newEmail + "'>";

}

//basically updatecontact function
function saveEdit(no)
{
	var saveFN= document.getElementById("newFNText" + no).value;
	var saveLN = document.getElementById("newLNText" + no).value;
	var savePhone= document.getElementById("newPhoneText" + no).value;
	var saveEmail =document.getElementById("newEmailText" + no).value;
	var saveID =  rowNo[no]

	console.log("new name is "+saveFN+"; saveID is: "+saveID+"; userID is: "+userId);
	
	 document.getElementById("firstName" + no).innerHTML = saveFN;
	 document.getElementById("lastName" + no).innerHTML = saveLN;
  	 document.getElementById("phone" + no).innerHTML = savePhone;
   	 document.getElementById("email" + no).innerHTML = saveEmail;

	let tmp = {
		id: saveID,
		firstName: saveFN,
		lastName: saveLN,
		phone: savePhone,
		email: saveEmail,
		userId: userId
	};


    let jsonPayload = JSON.stringify(tmp);

	console.log(tmp.firstName);
    let url = urlBase + '/LAMPAPI/UpdateContact.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                //searchContacts();
            }
        };
        xhr.send(jsonPayload);
    } catch (err) {
        console.log(err.message);
    }

	document.getElementById("saveButton" + no).style.display = 'none';
        document.getElementById("editButton" + no).style.display = 'block';
}

/*Delete icon is clicked, awaiting confirmation*/
function areYouSure(no)
{
	//deletePopUp.style.display='inline-block';
        //contactList.style.display='none';
	//remove if theres no time
	console.log("are you sure for #"+no);
	document.getElementById("areYouSure" + no).style.display = 'none';
	document.getElementById("confirmDeleteButton" + no).style.display = 'block';
	document.getElementById("cancelDeleteButton" + no).style.display = 'block';

	var delFN = document.getElementById("firstName" + no).innerText;
	var delLN = document.getElementById("lastName" + no).innerText;

	//command to delete row
}

/*Once confirm is clicked*/
function deleteContact(no)
{
	//run deletecontact function
	//switch samepopup to only say "Contact Deleted!"; maybe make separate div for it? or make elements on original deletepopup hidden

	//var delfirstName
	//var delLastName;
	document.getElementById("row" + no + "").outerHTML = "";
	
	var delId=rowNo[no]

	let tmp= {
		id: delId,
		userId: userId
	}

	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/LAMPAPI/DeleteContact.'+extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type","application/json; charset=UTF-8");

	try{
		xhr.onreadystatechange=function() {
			if(this.readyState == 4 && this.status == 200){
				console.log("Contact has been deleted");
				refreshContacts();
			}
		};
		xhr.send(jsonPayload);
	} catch(err){
		console.log(err.message);
	}
	console.log("after try catch");

	//document.getElementById("confirmDeleteButton" + no).style.display = 'none';
        //document.getElementById("areYouSure" + no).style.display = 'block';
}

/*Either no or the x is clicked; popup display is set to none and the normal contacts page is restored*/
function dontDelete(no)
{
	//deletePopUp.style.display='none';
	//make contactlist appear
	contactList.style.display='block';
	document.getElementById("areYouSure" + no).style.display = 'block';
        document.getElementById("confirmDeleteButton" + no).style.display = 'none';
        document.getElementById("cancelDeleteButton" + no).style.display = 'none';	
	
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

	document.getElementById("addFirstName").value = "";
	document.getElementById("addLastName").value = "";
	document.getElementById("addEmail").value = "";
	document.getElementById("addPhone").value = "";

	const el=document.getElementById("addPopUp");
	const el2=document.getElementById("contactList");
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

function easterEgg() {
	if(bgDisplay.style.display == 'none') {
		bgDisplay.style.display = 'block';
	} else {
		bgDisplay.style.display = 'none';
	}
}
