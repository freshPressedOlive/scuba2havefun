<?php
	$inData = getRequestInfo();
	
	$id = $inData["id"]; // Unique ID of the contact to delete
	$userId = $inData["userId"]; // ID of the user, to make sure it's right
	
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError($conn->connect_error);
	} 
	else
	{
		// make sure it's the right user deleting this contact
		$stmt = $conn->prepare("SELECT UserID FROM Contacts WHERE ID=?");
		$stmt->bind_param("i", $id);
		$stmt->execute();
		$result = $stmt->get_result();

		if ($row = $result->fetch_assoc()) 
		{
			// if it's the wrong user id, complain
			if ($row["UserID"] != $userId) 
			{
				$stmt->close();
				$conn->close();
				returnWithError("Permission denied: Contact does not belong to the logged-in user");
				exit();
			}
		} 
		else 
		{
			// if the issue was the contact id
			$stmt->close();
			$conn->close();
			returnWithError("No contact found with the given ID");
			exit();
		}

		$stmt->close();

		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
		$stmt->bind_param("i", $id);
		$stmt->execute();

		if ($stmt->affected_rows > 0)
		{
			returnWithError(""); // Success
		}
		else
		{
			// probably won't get here, since it should have thrown this error by now
			// but just to be safe
			returnWithError("No contact found with the given ID");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
?>