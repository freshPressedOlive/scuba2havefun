<?php

// Function to get the JSON input from the request
function getRequestInfo() {
    return json_decode(file_get_contents('php://input'), true);
}

// Function to send the result as JSON
function sendResultInfoAsJson($obj) {
    header('Content-type: application/json');
    echo $obj;
}

// Function to return an error as JSON
function returnWithError($err) {
    $retValue = '{"error":"' . $err . '"}';
    sendResultInfoAsJson($retValue);
}

// Main script
$inData = getRequestInfo();

// Validate input
if (!isset($inData["id"]) || !isset($inData["firstName"]) || !isset($inData["lastName"]) || !isset($inData["phone"]) || !isset($inData["email"]) || !isset($inData["userId"])) {
    returnWithError("Missing required fields");
    exit();
}

$id = $inData["id"];
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$phone = $inData["phone"];
$email = $inData["email"];
$userId = $inData["userId"];

// Connect to the database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check for connection errors
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}
    
// Update the contact's information
$stmt = $conn->prepare("UPDATE Contacts SET FirstName=?, LastName=?, Phone=?, Email=? WHERE UserID=? AND ID=?");
$stmt->bind_param("ssssii", $firstName, $lastName, $phone, $email, $userId, $id);

if ($stmt->execute() && $stmt->affected_rows > 0) {
    returnWithError("");
} else {
    returnWithError("Failed to update contact or no changes made");
}

$stmt->close();
$conn->close();
?>

