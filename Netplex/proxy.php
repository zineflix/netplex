<?php
header("Content-Type: text/html");

// Optional: Whitelist allowed URLs for security
$url = "https://establishscarcely.com/s95r30t1n?key=37511c0ed4a09d8981528da2aa7dcff7";

// Fetch and output the content
echo file_get_contents($url);
?>
