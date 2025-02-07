<?php

// Enable error reporting (for debugging)
error_reporting(E_ALL);
ini_set('display_errors', 1);

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
    $retValue = json_encode(array("error" => $err));
    sendResultInfoAsJson($retValue);
}

// Function to return success response
function returnWithSuccess() {
    $retValue = json_encode(array("success" => "User created successfully"));
    sendResultInfoAsJson($retValue);
}

// Main script
$inData = getRequestInfo();


// Get the input data
$firstName = $inData["firstName"];
$lastName = $inData["lastName"];
$login = $inData["login"];
$password = $inData["password"];


if(empty($firstName) || empty($lastName) || empty($login) || empty($password)){
    returnWithError("Missing required fields");
    exit();
}

// Hash the password for security
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Connect to the database
$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

// Check for connection errors
if ($conn->connect_error) {
    returnWithError($conn->connect_error);
    exit();
}

// Check if the username already exists
$stmt = $conn->prepare("SELECT ID FROM Users WHERE Login=?");
$stmt->bind_param("s", $login);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    returnWithError("Username already exists");
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// Insert the new user
$stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $firstName, $lastName, $login, $hashedPassword);

if ($stmt->execute()) {
    returnWithSuccess();
} else {
    returnWithError("Failed to create user");
}

$stmt->close();
$conn->close();
?>

