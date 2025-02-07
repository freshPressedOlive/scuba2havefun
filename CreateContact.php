<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"];
	$lastName = $inData["lastName"];
	$phone = $inData["phone"];
	$email = $inData["email"];
	$userId = $inData["userId"];

	// Validate first and last names
		// make sure neither is blank
	if (empty(trim($firstName))) 
	{
		returnWithError("First name cannot be blank");
		exit();
	}
	if (empty(trim($lastName))) 
	{
		returnWithError("Last name cannot be blank");
		exit();
	}

	// Input validation
		// built-in email validation
	if (!filter_var($email, FILTER_VALIDATE_EMAIL)) 
	{
		returnWithError("Invalid email format");
		exit();
	}

	// use a regex to check that it's 10 digits
		// how permissive should we be here?
	if (!preg_match("/^\d{10}$/", $phone)) 
	{
		returnWithError("Phone number must be 10 digits and no other characters");
		exit();
	}


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (UserId, FirstName, LastName, Phone, Email) VALUES (?, ?, ?, ?, ?)");
		$stmt->bind_param("sssss", $userId, $firstName, $lastName, $phone, $email);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>